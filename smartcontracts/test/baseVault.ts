import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import {
  BaseVault,
  MockOracle,
  MockRibbonThetaVault,
  MockUSD,
  WETH9,
  Vault,
} from "../typechain";

describe("BaseVault", function () {
  let sender: SignerWithAddress;
  let ribbonVault: MockRibbonThetaVault;
  let oracle: MockOracle;
  let usdb: MockUSD;
  let weth: WETH9;
  let vault: BaseVault;
  let collateralValue: number;
  let initSnapshotId: string;
  let initialDeposit: BigNumber;
  before(async function () {
    [sender] = await ethers.getSigners();
    const initialPrice = 277030883681;
    initialDeposit = BigNumber.from("10").pow(18);

    const Oracle = await ethers.getContractFactory("MockOracle");
    oracle = await Oracle.deploy(initialPrice);

    const WETH = await ethers.getContractFactory("WETH9");
    weth = await WETH.deploy();

    const USDB = await ethers.getContractFactory("MockUSD");
    usdb = await USDB.deploy();

    const Vault = await ethers.getContractFactory("BaseVault");
    vault = await Vault.deploy(
      weth.address,
      usdb.address,
      oracle.address,
      weth.address
    );
    await usdb.transferOwnership(vault.address);
    collateralValue = 295236344964;
  });

  it("Should mint tokens", async function () {
    await weth.deposit({ value: initialDeposit });
    const afterMint = await weth.balanceOf(sender.address);
    expect(afterMint).to.be.eq(initialDeposit);
  });
  it("should deposit tokens", async function () {
    await weth.approve(vault.address, initialDeposit);
    await vault.deposit(initialDeposit);
    expect(await vault.balancesOf(sender.address)).to.be.eq(initialDeposit);
  });

  it("should have proper value of colatteral", async function () {
    const balance = await vault.balancesOf(sender.address);
    expect(await vault.getValueOfCollateral(balance.toString())).to.eq(
      collateralValue
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
  it("should pay back tokens", async function () {
    const depositAmount = 1e8;
    await vault.repay(depositAmount);
    expect(await usdb.balanceOf(sender.address)).to.be.eq(0);
    expect(await usdb.totalSupply()).to.be.eq(0);
  });
  it("should withdraw all tokens", async function () {
    const amount = await vault.balancesOf(sender.address);
    await vault.withdraw(amount);
    expect(await vault.balancesOf(sender.address)).to.be.eq(0);
  });
  it("should liquidate", async function () {
    const depositAmount = 1e8;
    await ribbonVault.approve(vault.address, depositAmount);
    await vault.deposit(depositAmount);
    const maxAmount = await vault.maximumBorrowAmount(sender.address);
    await vault.borrow(maxAmount.sub(1));
    await oracle.setPrice("27703088368");
    await vault.liquidate(sender.address);
    expect(await vault.balancesOf(sender.address)).to.be.eq(0);
  });
});

describe("UsdB", function () {
  // eslint-disable-next-line no-unused-vars
  let sender: SignerWithAddress;
  let ribbonVault: MockRibbonThetaVault;
  let oracle: MockOracle;
  let usdb: MockUSD;
  let vault: BaseVault;
  let weth: WETH9;

  before(async function () {
    [sender] = await ethers.getSigners();
    const initialPrice = 277030883681;

    const Oracle = await ethers.getContractFactory("MockOracle");
    oracle = await Oracle.deploy(initialPrice);

    const USDB = await ethers.getContractFactory("MockUSD");
    usdb = await USDB.deploy();

    const Vault = await ethers.getContractFactory("BaseVault");
    vault = await Vault.deploy(
      weth.address,
      usdb.address,
      oracle.address,
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
});

async function revertToSnapShot(id: string) {
  await ethers.provider.send("evm_revert", [id]);
}

async function takeSnapshot() {
  const snapshotId: string = await ethers.provider.send("evm_snapshot", []);
  return snapshotId;
}