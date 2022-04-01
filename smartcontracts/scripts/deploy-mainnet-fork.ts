// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const [sender] = await ethers.getSigners();
  const testAddress = "0x30106e56b179c62bD0972DdEd25bD86cB2fa3d88";

  // const oracle = await ethers.getContractAt(
  //   "AggregatorV3Interface",
  //   "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"
  // );

  const initialPrice = 277030883681;

  const Oracle = await ethers.getContractFactory("MockOracle");
  const oracle = await Oracle.deploy(initialPrice);

  const weth = await ethers.getContractAt(
    "WETH9",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  );

  const ribbonVault = await ethers.getContractAt(
    "IRibbonThetaVault",
    "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B"
  );

  const USDB = await ethers.getContractFactory("UsdB");
  const usdb = await USDB.deploy();

  const Bowtie = await ethers.getContractFactory("BowTie");
  const bowtie = await Bowtie.deploy();

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
  const vault = await Vault.deploy(
    weth.address,
    usdb.address,
    oracle.address,
    staking.address,
    weth.address,
    bowtie.address,
    bowtieStaking.address,
    ribbonVault.address
  );

  await vault.deployed();
  await staking.setRewardsDistribution(vault.address);
  await bowtieStaking.setRewardsDistribution(vault.address);
  await usdb.transferOwnership(vault.address);
  console.log({
    weth: weth.address,
    usdb: usdb.address,
    bowtie: bowtie.address,
    vault: vault.address,
    staking: staking.address,
    bowtieStaking: bowtieStaking.address,
  });
  await sender.sendTransaction({
    to: testAddress,
    value: ethers.utils.parseEther("1"),
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
