// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const oracle = "0x0";
  const ribbonVault = "0x0";

  const RUSD = await ethers.getContractFactory("Usdb");
  const rUsd = await RUSD.deploy();

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(ribbonVault, rUsd.address, oracle);

  await vault.deployed();
  await rUsd.transferOwnership(vault.address);

  console.log({
    ribbonVault: ribbonVault,
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
