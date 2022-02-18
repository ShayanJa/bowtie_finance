import { useCallback } from "react";
import { useActiveWeb3 } from "../state/application/hooks";
import { useVaultContract } from "./contracts";
import { ethers, utils } from "ethers";
import { TestUSDCoin__factory } from "../contracts/generated";

export const useVault = (): [
  () => Promise<boolean>,
  () => Promise<void>,
  (amount: string) => Promise<void>
] => {
  const vault = useVaultContract();
  const { address, provider } = useActiveWeb3();

  const allowance = useCallback(async () => {
    const collateral = await vault.collateral();
    const coin = TestUSDCoin__factory.connect(collateral, provider);
    const x = await coin.allowance(address, vault.address);
    return x.gt(0);
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

  return [allowance, approve, deposit];
};
