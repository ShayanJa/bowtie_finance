// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const oracle = await ethers.getContractAt(
    "AggregatorV3Interface",
    "0xdCD81FbbD6c4572A69a534D8b8152c562dA8AbEF"
  );

  const weth = await ethers.getContractAt(
    "WETH9",
    "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a"
  );

  // await ribbonVault.mint(sender.address, initialAmount);

  const USDB = await ethers.getContractFactory("UsdB");
  const usdb = await USDB.deploy();

  const Vault = await ethers.getContractFactory("BaseVault");
  const vault = await Vault.deploy(
    weth.address,
    usdb.address,
    oracle.address,
    weth.address
  );

  await vault.deployed();

  console.log({
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
