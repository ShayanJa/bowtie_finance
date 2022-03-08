import { SubgraphDataContext } from "../context/subgraphContext";
import { useCallback, useContext } from "react";
import { useActiveWeb3, useForceUpdate } from "../state/application/hooks";
import { useRibbonVaultContract } from "./contracts";
import { ethers, utils } from "ethers";

export const useAPY = () => {
  const data = useContext(SubgraphDataContext);
  const vault = useRibbonVaultContract();

  const getGraphData = async () => {
    try {
      const [round] = await vault.vaultState();
      const lastPrice = utils.formatEther(
        await vault.roundPricePerShare(round - 1)
      );
      const startPrice = utils.formatEther(
        await vault.roundPricePerShare(round - 2)
      );
      const weeklyReturn = parseFloat(lastPrice) / parseFloat(startPrice) - 1;
      const expected = (1 + weeklyReturn) ** 52 - 1;
      return (expected * 100).toFixed(3);
    } catch (e) {
      console.log(e);
      return data.vaultSubgraphData;
    }
  };
  return [getGraphData];
};
