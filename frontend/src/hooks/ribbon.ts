import { useCallback } from "react";
import { useActiveWeb3 } from "../state/application/hooks";
import { useRibbonVaultContract } from "./contracts";
import { utils } from "ethers";

export const useRibbon = () => {
  const { address } = useActiveWeb3();
  const ribbon = useRibbonVaultContract();

  const getDeposits = useCallback(async () => {
    const [round, amount, unredeemedShares] = await ribbon.depositReceipts(
      address
    );
    const unredeemedSharesToAvax = await ribbon.accountVaultBalance(address);
    const total = amount.add(unredeemedSharesToAvax);
    return [
      utils.formatEther(amount),
      utils.formatEther(unredeemedShares),
      utils.formatEther(total),
    ];
  }, [address, ribbon]);

  return [getDeposits];
};
