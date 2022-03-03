import { useCallback } from "react";
import { useActiveWeb3, useForceUpdate } from "../state/application/hooks";
import { useUsdbTokenContract, useVaultContract } from "./contracts";
import { ethers, utils } from "ethers";
import { TestUSDCoin__factory } from "../contracts/generated";
import toast from "react-hot-toast";

export const useToken = () => {
  const collateral = useUsdbTokenContract();
  const { address } = useActiveWeb3();
  const getBalance = useCallback(async () => {
    try {
      return utils.formatEther(await collateral.balanceOf(address));
    } catch {
      return "0";
    }
  }, []);
  return [getBalance];
};
