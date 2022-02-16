import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MockOracle, MockRibbonThetaVault, MockUSD, Vault } from "../typechain";

describe("Vault", function () {
  let sender: SignerWithAddress;
  let ribbonVault: MockRibbonThetaVault;
  let oracle: MockOracle;
  let rUsd: MockUSD;
  let vault: Vault;
  let collateralValue: number;
  let initSnapshotId: string;

  before(async function () {
    [sender] = await ethers.getSigners();
    const initialPrice = 277030883681;

    const Oracle = await ethers.getContractFactory("MockOracle");
    oracle = await Oracle.deploy(initialPrice);

    const RibbonVault = await ethers.getContractFactory("MockRibbonThetaVault");
    ribbonVault = await RibbonVault.deploy();

    const RUSD = await ethers.getContractFactory("MockUSD");
    rUsd = await RUSD.deploy();

    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy(
      ribbonVault.address,
      rUsd.address,
      oracle.address
    );
    await rUsd.transferOwnership(vault.address);
    collateralValue = 295236344964;
  });

  it("Should mint tokens", async function () {
    const initialAmount = 1e8;

    await ribbonVault.mint(sender.address, initialAmount);

    const afterMint = await ribbonVault.balanceOf(sender.address);
    expect(afterMint).to.be.eq(initialAmount);
  });
  it("should deposit tokens", async function () {
    const depositAmount = 1e8;
    await ribbonVault.approve(vault.address, depositAmount);

    await vault.deposit(depositAmount);
    expect(await vault.balancesOf(sender.address)).to.be.eq(depositAmount);
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
    expect(await rUsd.balanceOf(sender.address)).to.be.eq(0);
    revertToSnapShot(initSnapshotId);
  });
  it("should borrow up to max sub 1", async function () {
    initSnapshotId = await takeSnapshot();
    const maxAmount = await vault.maximumBorrowAmount(sender.address);
    await vault.borrow(maxAmount.sub(1));
    expect(await rUsd.balanceOf(sender.address)).to.be.eq(maxAmount.sub(1));
    revertToSnapShot(initSnapshotId);
  });
  it("should borrow correct value", async function () {
    const depositAmount = 1e8;
    await vault.borrow(depositAmount);
    expect(await rUsd.balanceOf(sender.address)).to.be.eq(depositAmount);
  });
  it("should not allow liquidation under the max amount", async function () {
    await expect(vault.liquidate(sender.address)).to.be.reverted;
  });
  it("should pay back tokens", async function () {
    const depositAmount = 1e8;
    await vault.repay(depositAmount);
    expect(await rUsd.balanceOf(sender.address)).to.be.eq(0);
    expect(await rUsd.totalSupply()).to.be.eq(0);
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
  let rUsd: MockUSD;
  let vault: Vault;

  before(async function () {
    [sender] = await ethers.getSigners();
    const initialPrice = 277030883681;

    const Oracle = await ethers.getContractFactory("MockOracle");
    oracle = await Oracle.deploy(initialPrice);

    const RibbonVault = await ethers.getContractFactory("MockRibbonThetaVault");
    ribbonVault = await RibbonVault.deploy();

    const RUSD = await ethers.getContractFactory("MockUSD");
    rUsd = await RUSD.deploy();

    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy(
      ribbonVault.address,
      rUsd.address,
      oracle.address
    );
  });
  it("should transfer ownership", async function () {
    await rUsd.transferOwnership(vault.address);
  });

  it("should be owned by the vault", async function () {
    const owner = await rUsd.owner();
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
