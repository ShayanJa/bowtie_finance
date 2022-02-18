export enum ChainId {
  NOT_CONNECTED = 0,
  DEVELOPMENT = 1337,
  // MAINNET = 1,
  // RINKEBY = 4,
  AVAX = 43114,
  FUJI = 43113,
}

export const USDC_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x9a7317071fab80ab63ED97128705F81B185BAB37",
  [ChainId.DEVELOPMENT]: "0x9a7317071fab80ab63ED97128705F81B185BAB37",
  [ChainId.AVAX]: "0x9a7317071fab80ab63ED97128705F81B185BAB37",
  [ChainId.FUJI]: "",
};

export const CURVE_POOL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.DEVELOPMENT]: "",
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
};

export const BOWTIE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.DEVELOPMENT]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
};

export const COLLATERAL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.DEVELOPMENT]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
};

export const VAULT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.DEVELOPMENT]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.AVAX]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.FUJI]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
};

export const STAKING_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.DEVELOPMENT]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.AVAX]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.FUJI]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
};

export const RIBBON_VAULT_COVEREDCALL_ADDRESS: {
  [chainId in ChainId]: string;
} = {
  [ChainId.NOT_CONNECTED]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
  [ChainId.DEVELOPMENT]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
  [ChainId.AVAX]: "0x98d03125c62DaE2328D9d3cb32b7B969e6a87787",
  [ChainId.FUJI]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
};
