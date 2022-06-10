import { useCallback } from "react";
import { useActiveWeb3 } from "../state/application/hooks";
import { useOracleContract } from "./contracts";
import { BigNumber, ethers, utils } from "ethers";

export const useOracle = (): [() => Promise<string>] => {
  const oracle = useOracleContract();
  const { address, provider } = useActiveWeb3();

  const getPrice = useCallback(async () => {
    try {
      const [, price] = await oracle.latestRoundData();
      const newPrice = utils.formatUnits(price, await oracle.decimals());
      return newPrice;
    } catch (e) {
      console.log(e);
      return BigNumber.from(0).toString();
    }
  }, [address, provider]);

  return [getPrice];
};
