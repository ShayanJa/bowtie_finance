export enum ChainId {
  NOT_CONNECTED = 0,
  // MAINNET = 1,
  // RINKEBY = 4,
  AVAX = 43114,
}

export const USDC_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x9a7317071fab80ab63ED97128705F81B185BAB37",
  [ChainId.AVAX]: "0x9a7317071fab80ab63ED97128705F81B185BAB37",
};

export const CURVE_POOL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.AVAX]: "",
};

export const BOWTIE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.AVAX]: "",
};

export const COLLATERALADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.AVAX]: "",
};

export const VAULT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.AVAX]: "",
};
