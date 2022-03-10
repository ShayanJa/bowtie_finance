import React, { useCallback } from "react";
import { useUsdbTokenContract } from "./contracts";
import { useActiveWeb3 } from "../state/application/hooks";
import { ethers, utils } from "ethers";

export const useUSDB = () => {
  const usdb = useUsdbTokenContract();
  const { address } = useActiveWeb3();
  const getBalance = useCallback(async () => {
    try {
      return utils.formatEther(await usdb.balanceOf(address));
    } catch (e) {
      console.log(e);
      return "0";
    }
  }, [usdb, address]);
  return [getBalance];
};
