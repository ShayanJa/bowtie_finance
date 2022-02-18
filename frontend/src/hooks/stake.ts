import { useCallback } from "react";
import { useActiveWeb3 } from "../state/application/hooks";
import { useStakingContract } from "./contracts";
import { ethers, utils } from "ethers";
import { TestUSDCoin__factory } from "../contracts/generated";

export const useStakingRewards = (): [
  () => Promise<boolean>,
  () => Promise<void>
  // (amount: string) => Promise<void>
] => {
  const staking = useStakingContract();
  const { address, provider } = useActiveWeb3();

  const allowance = useCallback(async () => {
    const collateral = await staking.stakingToken();
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

  return [allowance, approve];
};
