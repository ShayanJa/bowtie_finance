// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const [sender, ...senders] = await ethers.getSigners();
  const initialPrice = 371750669620572;
  const initialAmount = 1e8;

  const Oracle = await ethers.getContractFactory("MockOracle");
  const oracle = await Oracle.deploy(initialPrice);

  const WETH = await ethers.getContractFactory("WETH9");
  const weth = await WETH.deploy();

  const RibbonVault = await ethers.getContractFactory("MockRibbonThetaVault");
  const ribbonVault = await RibbonVault.deploy(weth.address);
  // await ribbonVault.mint(sender.address, initialAmount);

  const RUSD = await ethers.getContractFactory("MockUSD");
  const rUsd = await RUSD.deploy();

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(
    ribbonVault.address,
    rUsd.address,
    oracle.address
  );

  await vault.deployed();

  console.log({
    ribbonVault: ribbonVault.address,
    rUSD: rUsd.address,
    vault: vault.address,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
