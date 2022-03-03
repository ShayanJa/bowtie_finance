import { useCallback } from "react";
import { useActiveWeb3, useForceUpdate } from "../state/application/hooks";
import { useTokenContract } from "./contracts";
import { ethers, utils } from "ethers";

export const useToken = () => {
  const collateral = useTokenContract();
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
