import React, { createContext, ReactElement } from "react";
import { BigNumber } from "@ethersproject/bignumber";

export type VaultPriceHistory = {
  pricePerShare: BigNumber;
  timestamp: number;
};
export type VaultSubgraphDataContextType = {
  vaultPriceHistory: VaultPriceHistory[];
};

export type SubGraphContextType = {
  vaultSubgraphData: any;
};

export const defaultVaultSubgraphData: VaultSubgraphDataContextType = {
  vaultPriceHistory: [],
};

export const SubgraphDataContext = createContext<SubGraphContextType>({
  vaultSubgraphData: 0,
});

export const SubgraphDataContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  return (
    <SubgraphDataContext.Provider value={{ vaultSubgraphData: 0 }}>
      {children}
    </SubgraphDataContext.Provider>
  );
};
