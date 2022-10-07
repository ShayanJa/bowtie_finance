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
  IRibbonThetaVault,
  ISwapRouter,
} from "../typechain";

describe.skip("Forked Vault", function () {
  let sender: SignerWithAddress;
  let debtBuyer: SignerWithAddress;
  let ribbonVault: IRibbonThetaVault;
  let oracle: MockOracle;
  let usdb: MockUSD;
  let usdc: MockUSD;
  let bowtie: BowTie;
  let weth: WETH9;
  let router: ISwapRouter;
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

    // const oracle = await ethers.getContractAt(
    //   "AggregatorV3Interface",
    //   "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"
    // );

    const USDB = await ethers.getContractFactory("MockUSD");
    usdb = await USDB.deploy();

    const Bowtie = await ethers.getContractFactory("BowTie");
    bowtie = await Bowtie.deploy();

    weth = await ethers.getContractAt(
      "WETH9",
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    );

    usdc = await ethers.getContractAt(
      "MockUSD",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    );

    ribbonVault = await ethers.getContractAt(
      "IRibbonThetaVault",
      "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B"
    );

    router = await ethers.getContractAt(
      "ISwapRouter",
      "0xE592427A0AEce92De3Edee1F18E0157C05861564"
    );

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
      ribbonVault.address,
      usdc.address,
      router.address
    );
    await usdb.transferOwnership(vault.address);
    await staking.setRewardsDistribution(vault.address);
    await bowtieStaking.setRewardsDistribution(vault.address);
  });

  it("should deposit ETH", async function () {
    console.log(weth.address);
    console.log(vault.address);
    await weth.approve(vault.address, initialDeposit);
    await vault.depositETH({ value: initialDeposit });
    const bal = await vault.balanceOf(sender.address);
    const subVaultAddress = await vault.subVaults(sender.address);
    const subVault = await ethers.getContractAt("SubVault", subVaultAddress);
    console.log(subVault.address);
    console.log(ribbonVault);
    const reciept = await ribbonVault.depositReceipts(subVault.address);
    expect(reciept[1]).to.be.eq(bal);
    expect(bal).to.be.eq(initialDeposit);
  });
  it("should have proper value of colatteral", async function () {
    const balance = await vault.balanceOf(sender.address);
    expect(await vault.getValueOfCollateral(balance.toString())).to.eq(
      initialCollateralValue
    );
  });
  it("should revert: Can't borrow total collateral amount", async function () {
    const maxAmount = await vault.maximumBorrowAmount(sender.address);
    await expect(vault.borrow(maxAmount)).to.be.revertedWith(
      "Borrowing too much"
    );
    expect(await usdb.balanceOf(sender.address)).to.be.eq(0);
  });
  it("should borrow correct value", async function () {
    const depositAmount = 1e8;
    const maxAmount = await vault.maximumBorrowAmount(sender.address);
    console.log(maxAmount);
    await vault.borrow(depositAmount);
    expect(await usdb.balanceOf(sender.address)).to.be.eq(depositAmount);
  });
  it("should not allow liquidation under the max amount", async function () {
    await expect(vault.liquidate(sender.address)).to.be.reverted;
  });

  describe.skip("Sub Vault", () => {
    let subVault: SubVault;
    before(async function () {
      const subVaultAddress = await vault.subVaults(sender.address);
      subVault = await ethers.getContractAt("SubVault", subVaultAddress);
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
      // const amount = 100;
      const amount = await vault.balanceOf(sender.address);
      console.log(await vault.balanceOf(sender.address));
      await vault.withdrawTokens(amount);
    });
    it("only vault can withdraw tokens from subVault ", async function () {
      const amount = 100;
      await vault.withdraw(amount);
      await vault.withdrawTokens(amount);
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
      const maxAmount = await vault.maximumBorrowAmount(sender.address);
      await vault.borrow(maxAmount.sub(1));

      await oracle.setPrice(liquidationPrice);
      await vault.liquidate(sender.address);
      const numAuctions = await vault.numAuctions();
      expect(numAuctions).to.be.eq(1);
      const auction = await vault.auctions(numAuctions.sub(1));
      console.log(await vault.subVaults(sender.address));
      expect(await vault.subVaults(sender.address)).to.be.eq(
        "0x0000000000000000000000000000000000000000"
      );
      await expect(vault.initiateWithdraw(1)).to.be.reverted;
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

      // Have to use usdb to buy debt
      const subVault = await ethers.getContractAt("SubVault", subVaultBond);
      await vault
        .connect(debtBuyer)
        .depositETH({ value: initialDeposit.mul(2) });
      await vault.connect(debtBuyer).borrow(usdbVal);
      await usdb.connect(debtBuyer).approve(vault.address, usdbVal);
      const liquidatorBal = await weth.balanceOf(debtBuyer.address);
      console.log(liquidatorBal);
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
      const userWeth = await weth.balanceOf(debtBuyer.address);
      await info();
      await subVault.connect(debtBuyer).withdrawAllCollateral();
      await info();

      // await vault.connect(debtBuyer).withdrawAll();
      const _bal = await subVault.getValueInUnderlying();
      console.log(bal, _bal);
      console.log(bal);
      const liquidatorBal = await weth.balanceOf(debtBuyer.address);
      console.log(liquidatorBal);
      expect(userWeth).to.be.gt(10);
    });
  });
});

async function revertToSnapShot(id: string) {
  await ethers.provider.send("evm_revert", [id]);
}

async function takeSnapshot() {
  const snapshotId: string = await ethers.provider.send("evm_snapshot", []);
  return snapshotId;
}
