import { useMemo } from "react";
import { useActiveWeb3 } from "../state/application/hooks";
import { USDC_ADDRESS } from "../constants";

import { TestUSDCoin__factory } from "../contracts/generated";
import { constants } from "ethers";

export const useUSDCTestTokenContract = () => {
  const { provider, chainId } = useActiveWeb3();
  return useMemo(() => {
    return TestUSDCoin__factory.connect(
      USDC_ADDRESS[chainId] || constants.AddressZero,
      provider
    );
  }, [provider, chainId]);
};
