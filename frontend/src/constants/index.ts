export enum ChainId {
  NOT_CONNECTED = 0,
  // MAINNET = 1,
  // RINKEBY = 4,
  AVAX = 43114,
  FUJI = 43113,
}

export const USDC_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x9a7317071fab80ab63ED97128705F81B185BAB37",
  [ChainId.AVAX]: "0x9a7317071fab80ab63ED97128705F81B185BAB37",
  [ChainId.FUJI]: "",
};

export const CURVE_POOL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
};

export const BOWTIE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
};

export const COLLATERALADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
};

export const VAULT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
};

export const RIBBON_VAULT_COVEREDCALL_ADDRESS: {
  [chainId in ChainId]: string;
} = {
  [ChainId.NOT_CONNECTED]: "0x98d03125c62DaE2328D9d3cb32b7B969e6a87787",
  [ChainId.AVAX]: "0x98d03125c62DaE2328D9d3cb32b7B969e6a87787",
  [ChainId.FUJI]: "",
};
