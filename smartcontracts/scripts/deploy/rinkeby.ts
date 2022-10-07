// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const [sender] = await ethers.getSigners();
  const oracle = await ethers.getContractAt(
    "AggregatorV3Interface",
    "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
  );

  const WETH = await ethers.getContractFactory("WETH9");
  const weth = await WETH.deploy();

  const USDB = await ethers.getContractFactory("UsdB");
  const usdb = await USDB.deploy();

  const USDC = await ethers.getContractFactory("MockUSD");
  const usdc = await USDC.deploy();

  const SwapRouter = await ethers.getContractFactory("TestUniswapV3Router");
  const router = await SwapRouter.deploy();

  const STAKING = await ethers.getContractFactory("StakingRewards");
  const staking = await STAKING.deploy(
    sender.address,
    sender.address,
    weth.address,
    weth.address
  );

  const Vault = await ethers.getContractFactory("BaseVault");
  const vault = await Vault.deploy(
    weth.address,
    usdb.address,
    oracle.address,
    staking.address,
    weth.address,
    usdc.address,
    router.address
  );

  await vault.deployed();
  await staking.setRewardsDistribution(vault.address);
  await usdb.transferOwnership(vault.address);
  console.log({
    weth: weth.address,
    usdb: usdb.address,
    vault: vault.address,
    staking: staking.address,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
