import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import {
  MockOracle,
  MockRibbonThetaVault,
  MockUSD,
  WETH9,
  Vault,
  SubVault,
  BowTie,
} from "../typechain";

describe("Vault", function () {
  let sender: SignerWithAddress;
  let debtBuyer: SignerWithAddress;
  let ribbonVault: MockRibbonThetaVault;
  let oracle: MockOracle;
  let usdb: MockUSD;
  let bowtie: BowTie;
  let weth: WETH9;
  let vault: Vault;
  let initSnapshotId: string;

  let initialDeposit: BigNumber;
  let liquidationPrice: BigNumber;
  let initialCollateralValue: BigNumber;

  let liquidatedVaultAddress: string;

  before(async function () {
    [sender, debtBuyer] = await ethers.getSigners();
    const initialPrice = BigNumber.from(277030883681);
    liquidationPrice = initialPrice.mul(9).div(10);
    initialDeposit = BigNumber.from("10").pow(18);
    initialCollateralValue = initialDeposit.mul(initialPrice).div(1e8);

    const Oracle = await ethers.getContractFactory("MockOracle");
    oracle = await Oracle.deploy(initialPrice);

    const USDB = await ethers.getContractFactory("MockUSD");
    usdb = await USDB.deploy();

    const Bowtie = await ethers.getContractFactory("BowTie");
    bowtie = await Bowtie.deploy();

    const WETH = await ethers.getContractFactory("WETH9");
    weth = await WETH.deploy();

    const RibbonVault = await ethers.getContractFactory("MockRibbonThetaVault");
    ribbonVault = await RibbonVault.deploy(weth.address, weth.address);

    const STAKING = await ethers.getContractFactory("StakingRewards");
    const staking = await STAKING.deploy(
      sender.address,
      sender.address,
      weth.address,
      weth.address
    );

    const bowtieStaking = await STAKING.deploy(
      sender.address,
      sender.address,
      usdb.address,
      bowtie.address
    );

    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy(
      weth.address,
      usdb.address,
      oracle.address,
      staking.address,
      weth.address,
      bowtie.address,
      bowtieStaking.address,
      ribbonVault.address
    );
    await usdb.transferOwnership(vault.address);
    await staking.setRewardsDistribution(vault.address);
    await bowtieStaking.setRewardsDistribution(vault.address);
  });

  it("should deposit ETH", async function () {
    initSnapshotId = await takeSnapshot();
    await weth.approve(vault.address, initialDeposit);
    await vault.depositETH({ value: initialDeposit });
    const bal = await vault.balanceOf(sender.address);
    console.log(bal);
    const subVaultAddress = await vault.subVaults(sender.address);
    const subVault = await ethers.getContractAt("SubVault", subVaultAddress);
    const reciept = await ribbonVault.depositReceipts(subVault.address);
    console.log(reciept);
    console.log(initialDeposit);
    expect(reciept.amount).to.be.eq(bal);
    expect(bal).to.be.eq(initialDeposit);

    revertToSnapShot(initSnapshotId);
  });
  it("Should mint tokens", async function () {
    await weth.deposit({ value: initialDeposit });
    const afterMint = await weth.balanceOf(sender.address);
    expect(afterMint).to.be.eq(initialDeposit);
  });
  it("should deposit tokens", async function () {
    expect(await vault.balanceOf(sender.address)).to.be.eq(0);

    await weth.approve(vault.address, initialDeposit);
    await vault.deposit(initialDeposit);
    expect(await vault.balanceOf(sender.address)).to.be.eq(initialDeposit);
  });

  it("should have proper value of colatteral", async function () {
    const balance = await vault.balanceOf(sender.address);
    expect(await vault.getValueOfCollateral(balance.toString())).to.eq(
      initialCollateralValue
    );
  });
  it("should revert: Can't borrow total colalteral amount", async function () {
    initSnapshotId = await takeSnapshot();
    const maxAmount = await vault.maximumBorrowAmount(sender.address);
    await expect(vault.borrow(maxAmount)).to.be.revertedWith(
      "Borrowing too much"
    );
    expect(await usdb.balanceOf(sender.address)).to.be.eq(0);
    revertToSnapShot(initSnapshotId);
  });
  it("should borrow up to max sub 1", async function () {
    initSnapshotId = await takeSnapshot();
    const maxAmount = await vault.maximumBorrowAmount(sender.address);
    await vault.borrow(maxAmount.sub(1));
    expect(await usdb.balanceOf(sender.address)).to.be.eq(maxAmount.sub(1));
    revertToSnapShot(initSnapshotId);
  });
  it("should borrow correct value", async function () {
    const depositAmount = 1e8;
    await vault.borrow(depositAmount);
    expect(await usdb.balanceOf(sender.address)).to.be.eq(depositAmount);
  });
  it("should not allow liquidation under the max amount", async function () {
    await expect(vault.liquidate(sender.address)).to.be.reverted;
  });

  describe("Sub Vault", () => {
    let subVault: SubVault;
    before(async function () {
      initSnapshotId = await takeSnapshot();
      const subVaultAddress = await vault.subVaults(sender.address);
      subVault = await ethers.getContractAt("SubVault", subVaultAddress);
    });
    after(async () => {
      revertToSnapShot(initSnapshotId);
    });

    it("should have vault as owner", async () => {
      expect(await subVault.owner()).to.be.eq(vault.address);
    });
    it("should revert: only owner allowed to initiate withdraw", async function () {
      const amount = 100;
      await expect(subVault.initiateWithdraw(amount)).to.be.reverted;
    });
    it("should revert: only owner allowed to withdraw tokeens", async function () {
      const amount = 100;
      await expect(subVault.withdrawTokens(sender.address, amount)).to.be
        .reverted;
    });

    it("only vault can withdraw tokens from subVault ", async function () {
      const amount = 100;
      const reciept = await ribbonVault.depositReceipts(sender.address);
      console.log(reciept);
      await vault.withdraw(amount);
      const actual = await ethers.provider.getBalance(subVault.address);
      expect(actual).to.be.eq(amount);
      await vault.withdrawTokens(amount);
    });
    it("only vault can withdraw tokens from subVault ", async function () {
      const amount = 100;
      console.log(await vault.balanceOf(sender.address));
      const reciept = await ribbonVault.depositReceipts(subVault.address);
      console.log(reciept);
      await vault.initiateWithdraw(amount);
    });

    it("should revert: only msg.sender and liquidator can access subVault", async function () {
      const amount = 100;
      await expect(subVault.withdrawTokens(sender.address, amount)).to.be
        .reverted;
    });
  });

  describe("cleanup", () => {
    it("should pay back tokens", async function () {
      const depositAmount = 1e8;
      await vault.repay(depositAmount);
      // expect(await rUsd.balanceOf(sender.address)).to.be.eq(0);
      expect(await usdb.totalSupply()).to.be.eq(0);
    });

    it("should withdraw all tokens", async function () {
      initSnapshotId = await takeSnapshot();
      const amount = await vault.balanceOf(sender.address);
      await vault.withdraw(amount);
      expect(await vault.balanceOf(sender.address)).to.be.eq(0);
      revertToSnapShot(initSnapshotId);
    });

    it("should liquidate", async function () {
      const depositAmount = 1e8;
      await weth.deposit({ value: depositAmount });
      await weth.approve(vault.address, depositAmount);
      await vault.deposit(depositAmount);
      const subVaultAddr = await vault.subVaults(sender.address);
      const subVault = await ethers.getContractAt("SubVault", subVaultAddr);
      console.log(await vault.balanceOf(sender.address));
      console.log("hey");
      console.log(await subVault.getValueInUnderlying());
      const maxAmount = await vault.maximumBorrowAmount(sender.address);
      console.log(maxAmount);
      await vault.borrow(maxAmount.sub(1));
      console.log(await oracle.latestRoundData());
      await oracle.setPrice(liquidationPrice);
      await vault.liquidate(sender.address);
      console.log(await oracle.latestRoundData());

      console.log(await subVault.getValueInUnderlying());
      const numAuctions = await vault.numAuctions();
      expect(numAuctions).to.be.eq(1);
      const auction = await vault.auctions(numAuctions.sub(1));
      console.log(await vault.subVaults(sender.address));
      expect(await vault.subVaults(sender.address)).to.be.eq(
        "0x0000000000000000000000000000000000000000"
      );
      await expect(vault.initiateWithdraw(1)).to.be.reverted;
      console.log(await vault.subVaults(sender.address));

      console.log(auction);
    });
    it("should buy debt", async () => {
      const subVaultAddress = await vault.subVaults(debtBuyer.address);
      console.log(subVaultAddress);
      expect(subVaultAddress).to.be.eq(
        "0x0000000000000000000000000000000000000000"
      );
      const numAuctions = await vault.numAuctions();
      const auction = await vault.auctions(numAuctions.sub(1));
      const usdbVal = auction.price;
      const subVaultBond = auction.subVault;
      liquidatedVaultAddress = auction.subVault;
      console.log(auction);
      // Have to use usdb to buy debt
      const subVault = await ethers.getContractAt("SubVault", subVaultBond);
      await vault
        .connect(debtBuyer)
        .depositETH({ value: initialDeposit.mul(2) });
      await vault.connect(debtBuyer).borrow(usdbVal);
      await usdb.connect(debtBuyer).approve(vault.address, usdbVal);
      const usdbBal = await usdb.balanceOf(debtBuyer.address);
      console.log(usdbBal);
      const underlying = await subVault.getValueInUnderlying();
      const val = await vault.getValueOfCollateral(underlying);
      console.log(underlying);
      console.log(val);

      await vault.connect(debtBuyer).buyDebt(0);

      const newNumAuctions = await vault.numAuctions();
      expect(newNumAuctions).to.be.eq(0);
      expect(await subVault.owner()).to.be.eq(debtBuyer.address);
    });
    it("should allow token withdraw", async () => {
      const subVault = await ethers.getContractAt(
        "SubVault",
        liquidatedVaultAddress
      );
      const bal = await subVault.getValueInUnderlying();
      const info = async () => {
        const subvaultWeth = await weth.balanceOf(subVault.address);
        const userWeth = await weth.balanceOf(debtBuyer.address);
        const vaultWeth = await weth.balanceOf(vault.address);
        const ribVault = await weth.balanceOf(ribbonVault.address);
        console.log({ userWeth, subvaultWeth, vaultWeth, ribVault });
      };
      let userWeth = await weth.balanceOf(debtBuyer.address);

      // await vault.connect(debtBuyer).withdrawAll();
      const _bal = await subVault.getValueInUnderlying();
      console.log(bal, _bal);
      console.log(bal);
      await info();
      // await subVault.connect(debtBuyer).initiateWithdraw(_bal);
      await info();

      await subVault.connect(debtBuyer).completeWithdraw();
      await info();
      await subVault.connect(debtBuyer).withdrawAllCollateral();
      await info();
      userWeth = await weth.balanceOf(debtBuyer.address);

      const liquidatorBal = await weth.balanceOf(debtBuyer.address);
      console.log(liquidatorBal);
      expect(userWeth).to.be.gt(10);
    });
  });
});

describe("UsdB", function () {
  // eslint-disable-next-line no-unused-vars
  let sender: SignerWithAddress;
  let ribbonVault: MockRibbonThetaVault;
  let oracle: MockOracle;
  let usdb: MockUSD;
  let bowtie: BowTie;
  let vault: Vault;
  let weth: WETH9;

  before(async function () {
    [sender] = await ethers.getSigners();
    const initialPrice = 277030883681;

    const Oracle = await ethers.getContractFactory("MockOracle");
    oracle = await Oracle.deploy(initialPrice);

    const WETH = await ethers.getContractFactory("WETH9");
    weth = await WETH.deploy();

    const RibbonVault = await ethers.getContractFactory("MockRibbonThetaVault");
    ribbonVault = await RibbonVault.deploy(weth.address, weth.address);

    const USDB = await ethers.getContractFactory("MockUSD");
    usdb = await USDB.deploy();

    const Bowtie = await ethers.getContractFactory("BowTie");
    bowtie = await Bowtie.deploy();

    const STAKING = await ethers.getContractFactory("StakingRewards");
    const staking = await STAKING.deploy(
      sender.address,
      sender.address,
      weth.address,
      weth.address
    );

    const bowtieStaking = await STAKING.deploy(
      sender.address,
      sender.address,
      usdb.address,
      bowtie.address
    );

    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy(
      weth.address,
      usdb.address,
      oracle.address,
      staking.address,
      weth.address,
      bowtie.address,
      bowtieStaking.address,
      ribbonVault.address
    );
    await staking.setRewardsDistribution(vault.address);
    await bowtieStaking.setRewardsDistribution(vault.address);
  });
  it("should transfer ownership", async function () {
    await usdb.transferOwnership(vault.address);
  });

  it("should be owned by the vault", async function () {
    const owner = await usdb.owner();
    expect(owner).to.be.eq(vault.address);
  });
  it("should revert: can only be minted by vault", async function () {
    await expect(usdb.mint(sender.address, 100)).to.be.reverted;
  });
});

async function revertToSnapShot(id: string) {
  await ethers.provider.send("evm_revert", [id]);
}

async function takeSnapshot() {
  const snapshotId: string = await ethers.provider.send("evm_snapshot", []);
  return snapshotId;
}
