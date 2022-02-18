import { useCallback } from "react";
import { useActiveWeb3 } from "../state/application/hooks";
import { useVaultContract } from "./contracts";
import { ethers, utils } from "ethers";
import { TestUSDCoin__factory } from "../contracts/generated";

export const useVault = (): [
  () => Promise<boolean>,
  () => Promise<void>,
  (amount: string) => Promise<void>,
  (amount: string) => Promise<void>,
  () => Promise<string>
] => {
  const vault = useVaultContract();
  const { address, provider } = useActiveWeb3();

  const allowance = useCallback(async () => {
    try {
      const collateral = await vault.collateral();
      const coin = TestUSDCoin__factory.connect(collateral, provider);
      const x = await coin.allowance(address, vault.address);
      return x.gt(0);
    } catch (e) {
      console.log(e);
      return false;
    }
  }, [address, provider]);

  const approve = useCallback(async () => {
    try {
      const collateral = await vault.collateral();
      const coin = TestUSDCoin__factory.connect(collateral, provider);
      await coin.approve(vault.address, ethers.constants.MaxUint256);
    } catch (e) {
      console.log(e);
    }
  }, [address, provider]);

  const deposit = useCallback(
    async (amount) => {
      try {
        const tx = await vault.depositETH({ value: utils.parseEther(amount) });
        await tx.wait();
      } catch (e) {
        console.log(e);
      }
    },
    [vault, address]
  );

  const borrow = useCallback(
    async (amount) => {
      try {
        const tx = await vault.borrow(utils.parseEther(amount));
        await tx.wait();
      } catch (e) {
        console.log(e);
      }
    },
    [vault, address]
  );
  const maxiumBorrow = useCallback(async () => {
    try {
      const maxi = await vault.maximumBorrowAmount(address);
      return utils.formatEther(maxi);
    } catch (e) {
      console.log(e);
      return "0";
    }
  }, [vault, address]);

  return [allowance, approve, deposit, borrow, maxiumBorrow];
};
