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
    "0x0a77230d17318075983913bc2145db16c7366156"
  );

  /*
  // TEST: liquidations by updating oracle price
  //
  // const initialPrice = 277030883681;
  //
  // const Oracle = await ethers.getContractFactory("MockOracle");
  // const oracle = await Oracle.deploy(initialPrice);
  */

  const weth = await ethers.getContractAt(
    "WETH9",
    "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"
  );

  const ribbonVault = await ethers.getContractAt(
    "IRibbonThetaVault",
    "0x98d03125c62DaE2328D9d3cb32b7B969e6a87787"
  );

  const usdb = await ethers.getContractAt(
    "UsdB",
    "0x480f99A35579985353c900827F6bF3B9ff8c41e5"
  );

  const curveToken = "0x39BA6943D7C0F415bce7A8c42A8C601eaD6Ee426";

  const Bowtie = await ethers.getContractFactory("BowTie");
  const bowtie = await Bowtie.deploy();

  const STAKING = await ethers.getContractFactory("StakingRewards");
  const staking = await STAKING.deploy(
    sender.address,
    sender.address,
    weth.address,
    curveToken
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
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
