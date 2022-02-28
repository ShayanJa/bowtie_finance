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
} from "../typechain";

describe("Vault", function () {
  let sender: SignerWithAddress;
  let ribbonVault: MockRibbonThetaVault;
  let oracle: MockOracle;
  let rUsd: MockUSD;
  let weth: WETH9;
  let vault: Vault;
  let initSnapshotId: string;

  let initialDeposit: BigNumber;
  let initialCollateralValue: BigNumber;

  before(async function () {
    [sender] = await ethers.getSigners();
    const initialPrice = 9030883681;
    initialDeposit = BigNumber.from("10").pow(18);
    initialCollateralValue = initialDeposit.mul(initialPrice).div(1e8);

    const Oracle = await ethers.getContractFactory("MockOracle");
    oracle = await Oracle.deploy(initialPrice);

    const RUSD = await ethers.getContractFactory("MockUSD");
    rUsd = await RUSD.deploy();

    const WETH = await ethers.getContractFactory("WETH9");
    weth = await WETH.deploy();

    const RibbonVault = await ethers.getContractFactory("MockRibbonThetaVault");
    ribbonVault = await RibbonVault.deploy(weth.address);

    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy(
      weth.address,
      rUsd.address,
      oracle.address,
      ribbonVault.address,
      weth.address
    );
    await rUsd.transferOwnership(vault.address);
  });

  it("should deposit ETH", async function () {
    initSnapshotId = await takeSnapshot();
    await weth.approve(vault.address, initialDeposit);
    await vault.depositETH({ value: initialDeposit });
    const bal = await vault.balanceOf(sender.address);
    console.log(bal);
    // expect(await weth.balanceOf(vault.address)).to.be.eq(0);
    // expect(await weth.balanceOf(vault.address)).to.be.eq(0);

    revertToSnapShot(initSnapshotId);
  });
  it("Should mint tokens", async function () {
    await weth.deposit({ value: initialDeposit });
    const afterMint = await weth.balanceOf(sender.address);
    expect(afterMint).to.be.eq(initialDeposit);
  });
  it("should deposit tokens", async function () {
    await weth.approve(vault.address, initialDeposit);
    await vault.deposit(initialDeposit);
    // expect(await vault.balanceOf(sender.address)).to.be.eq(initialDeposit);
    // expect(await weth.balanceOf(vault.address)).to.be.eq(0);
  });

  // it("should have proper value of colatteral", async function () {
  //   const balance = await vault.balanceOf(sender.address);
  //   expect(await vault.getValueOfCollateral(balance.toString())).to.eq(
  //     initialCollateralValue
  //   );
  // });
  it("should revert: Can't borrow total colalteral amount", async function () {
    initSnapshotId = await takeSnapshot();
    console.log("hey");
    const maxAmount = await vault.maximumBorrowAmount(sender.address);
    console.log(maxAmount);
    await expect(vault.borrow(maxAmount)).to.be.revertedWith(
      "Borrowing too much"
    );
    // expect(await rUsd.balanceOf(sender.address)).to.be.eq(0);
    revertToSnapShot(initSnapshotId);
  });
  it("should borrow up to max sub 1", async function () {
    initSnapshotId = await takeSnapshot();
    const maxAmount = await vault.maximumBorrowAmount(sender.address);
    await vault.borrow(maxAmount.sub(1));
    // expect(await rUsd.balanceOf(sender.address)).to.be.eq(maxAmount.sub(1));
    revertToSnapShot(initSnapshotId);
  });
  it("should borrow correct value", async function () {
    const depositAmount = 1e8;
    await vault.borrow(depositAmount);
    // expect(await rUsd.balanceOf(sender.address)).to.be.eq(depositAmount);
  });
  it("should not allow liquidation under the max amount", async function () {
    await expect(vault.liquidate(sender.address)).to.be.reverted;
  });
  describe("Sub Vault", () => {
    let subVault: SubVault;
    before(async function () {
      const subVaultAddress = await vault.subVaults(sender.address);
      subVault = await ethers.getContractAt("SubVault", subVaultAddress);
    });

    it("should have vault as owner", async () => {
      expect(await subVault.owner()).to.be.eq(vault.address);
    });
    it("should revert: only owner allowed to withdraw tokeens", async function () {
      const collateral = await subVault.collateral();
      const amount = 100;
      await expect(subVault.withdrawTokens(collateral, amount)).to.be.reverted;
    });
    it("owner vault can withdraw tokens from subVault ", async function () {
      const collateral = await subVault.collateral();
      const amount = 100;
      await vault.withdrawTokens(collateral, amount);
    });
    // it("should revert: only msg.sender and liquidator can access subVault", async function () {
    //   const collateral = await subVault.collateral();
    //   const amount = 100;
    //   await expect(subVault.withdrawTokens(collateral, amount)).to.be.reverted;
    // });
  });

  it("should pay back tokens", async function () {
    const depositAmount = 1e8;
    await vault.repay(depositAmount);
    // expect(await rUsd.balanceOf(sender.address)).to.be.eq(0);
    expect(await rUsd.totalSupply()).to.be.eq(0);
  });
  // it("should withdraw all tokens", async function () {
  //   const amount = await vault.balanceOf(sender.address);
  //   await vault.withdraw(amount);
  //   expect(await vault.balanceOf(sender.address)).to.be.eq(0);
  // });
  it("should liquidate", async function () {
    const depositAmount = 1e8;
    // await ribbonVault.approve(vault.address, depositAmount);
    await vault.deposit(depositAmount);
    const maxAmount = await vault.maximumBorrowAmount(sender.address);
    await vault.borrow(maxAmount.sub(1));
    await oracle.setPrice("27703088368");
    await vault.liquidate(sender.address);
    // expect(await vault.balanceOf(sender.address)).to.be.eq(0);
  });
});

describe("UsdB", function () {
  // eslint-disable-next-line no-unused-vars
  let sender: SignerWithAddress;
  let ribbonVault: MockRibbonThetaVault;
  let oracle: MockOracle;
  let usdb: MockUSD;
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
    ribbonVault = await RibbonVault.deploy(weth.address);

    const USDB = await ethers.getContractFactory("MockUSD");
    usdb = await USDB.deploy();

    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy(
      weth.address,
      usdb.address,
      oracle.address,
      ribbonVault.address,
      weth.address
    );
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
