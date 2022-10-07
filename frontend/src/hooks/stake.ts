import { useCallback } from "react";
import { useActiveWeb3 } from "../state/application/hooks";
import { useStakingContract } from "./contracts";
import { ethers, utils } from "ethers";
import { TestUSDCoin__factory } from "../contracts/generated";
import toast from "react-hot-toast";

export const useStakingRewards = (): [
  () => Promise<boolean>,
  () => Promise<void>,
  () => Promise<string>,
  (amount: string) => Promise<void>,
  (amount: string) => Promise<void>,
  () => Promise<string>,
  () => Promise<string>
] => {
  const staking = useStakingContract();
  const { address, provider } = useActiveWeb3();

  const allowance = useCallback(async () => {
    const collateral = await staking.stakingToken();
    console.log(collateral);

    const coin = TestUSDCoin__factory.connect(collateral, provider);
    const x = await coin.allowance(address, staking.address);
    return x.gt(0);
  }, [address, provider]);

  const approve = useCallback(async () => {
    try {
      const collateral = await staking.stakingToken();
      const coin = TestUSDCoin__factory.connect(collateral, provider);
      await coin.approve(staking.address, ethers.constants.MaxUint256);
    } catch (e) {
      console.log(e);
    }
  }, [address, provider]);

  const totalStaked = useCallback(async () => {
    try {
      return utils.formatEther(await staking.totalSupply());
    } catch (e) {
      console.log(e);
      return "0";
    }
  }, [provider]);

  const stake = useCallback(async (amount) => {
    try {
      const req = async () => {
        const tx = await staking.stake(utils.parseEther(amount));
        await tx.wait();
      };
      await toast.promise(req(), {
        loading: "Staking...",
        success: "Staked",
        error: "Error Staking",
      });
    } catch (e) {
      console.log(e);
    }
  }, []);
  const unstake = useCallback(async (amount) => {
    try {
      const req = async () => {
        const tx = await staking.withdraw(utils.parseEther(amount));
        await tx.wait();
      };
      await toast.promise(req(), {
        loading: "Unstaking...",
        success: "Unstaked",
        error: "Error Withdrawing",
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const balance = useCallback(async () => {
    try {
      return utils.formatEther(await staking.balanceOf(address));
    } catch (e) {
      console.log(e);
      return "0";
    }
  }, [provider]);

  const reward = useCallback(async () => {
    try {
      return utils.formatEther(await staking.rewardPerToken()); //TODO: Fix
    } catch (e) {
      console.log(e);
      return "0";
    }
  }, [provider]);
  return [allowance, approve, totalStaked, stake, unstake, balance, reward];
};
