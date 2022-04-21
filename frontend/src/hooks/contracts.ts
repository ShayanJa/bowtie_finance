import { useMemo } from "react";
import { useActiveWeb3 } from "../state/application/hooks";
import {
  USDB_ADDRESS,
  RIBBON_VAULT_COVEREDCALL_ADDRESS,
  VAULT_ADDRESS,
  STAKING_ADDRESS,
  ORACLE_ADDRESS,
  COLLATERAL_ADDRESS,
} from "../constants";

import {
  TestUSDCoin__factory,
  RibbonThetaVault__factory,
  Vault__factory,
  StakingRewards__factory,
  Oracle__factory,
  Usdb__factory,
  Weth__factory,
  SubVault__factory,
  Otoken__factory,
} from "../contracts/generated";
import { constants } from "ethers";

export const useUsdbTokenContract = () => {
  const { provider, chainId } = useActiveWeb3();
  return useMemo(() => {
    return Usdb__factory.connect(
      USDB_ADDRESS[chainId] || constants.AddressZero,
      provider
    );
  }, [provider, chainId]);
};

export const useTokenContract = () => {
  const { provider, chainId } = useActiveWeb3();
  return useMemo(() => {
    return Weth__factory.connect(
      COLLATERAL_ADDRESS[chainId] || constants.AddressZero,
      provider
    );
  }, [provider, chainId]);
};

export const useRibbonVaultContract = () => {
  const { provider, chainId } = useActiveWeb3();
  return useMemo(() => {
    return RibbonThetaVault__factory.connect(
      RIBBON_VAULT_COVEREDCALL_ADDRESS[chainId],
      provider
    );
  }, [provider, chainId]);
};

export const useVaultContract = () => {
  const { provider, chainId } = useActiveWeb3();
  return useMemo(() => {
    return Vault__factory.connect(VAULT_ADDRESS[chainId], provider);
  }, [provider, chainId]);
};

export const useSubVaultContract = () => {
  const { provider } = useActiveWeb3();
  return (fundAddress: string) =>
    SubVault__factory.connect(fundAddress, provider);
};

export const useOptionsContract = () => {
  const { provider } = useActiveWeb3();
  return (fundAddress: string) =>
    Otoken__factory.connect(fundAddress, provider);
};

export const useStakingContract = () => {
  const { provider, chainId } = useActiveWeb3();
  return useMemo(() => {
    return StakingRewards__factory.connect(STAKING_ADDRESS[chainId], provider);
  }, [provider, chainId]);
};

export const useOracleContract = () => {
  const { provider, chainId } = useActiveWeb3();
  return useMemo(() => {
    return Oracle__factory.connect(ORACLE_ADDRESS[chainId], provider);
  }, [provider, chainId]);
};
