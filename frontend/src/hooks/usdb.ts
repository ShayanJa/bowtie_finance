import React, { useCallback } from "react";
import { useUsdbTokenContract, useVaultContract } from "./contracts";
import { useActiveWeb3, useForceUpdate } from "../state/application/hooks";
import { ethers, utils } from "ethers";
import toast from "react-hot-toast";

export const useUSDB = (): [
  () => Promise<string>,
  () => Promise<boolean>,
  () => Promise<void>
] => {
  const usdb = useUsdbTokenContract();
  const vault = useVaultContract();
  const refresh = useForceUpdate();

  const { address, provider } = useActiveWeb3();
  const getBalance = useCallback(async () => {
    try {
      return utils.formatEther(await usdb.balanceOf(address));
    } catch (e) {
      console.log(e);
      return "0";
    }
  }, [usdb, address]);

  const allowance = useCallback(async () => {
    try {
      const x = await usdb.allowance(address, vault.address);
      return x.gt(0);
    } catch (e) {
      console.log(e);
      return false;
    }
  }, [address, provider]);

  const approve = useCallback(async () => {
    try {
      const req = async () => {
        const tx = await usdb.approve(
          vault.address,
          ethers.constants.MaxUint256
        );
        await tx.wait();
        await refresh();
      };

      await toast.promise(req(), {
        loading: "Approving...",
        success: "Approved",
        error: "Error approving",
      });
    } catch (e) {
      console.log(e);
    }
  }, [address, provider]);

  return [getBalance, allowance, approve];
};
