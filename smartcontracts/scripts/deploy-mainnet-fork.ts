// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const oracle = await ethers.getContractAt(
    "AggregatorV3Interface",
    "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"
  );

  const weth = await ethers.getContractAt(
    "WETH9",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  );

  const ribbonVault = await ethers.getContractAt(
    "IRibbonThetaVault",
    "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B"
  );
  // await ribbonVault.mint(sender.address, initialAmount);

  const USDB = await ethers.getContractFactory("UsdB");
  const usdb = await USDB.deploy();

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(
    weth.address,
    usdb.address,
    oracle.address,
    ribbonVault.address,
    weth.address
  );

  await vault.deployed();

  console.log({
    ribbonVault: ribbonVault.address,
    usdb: usdb.address,
    vault: vault.address,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
