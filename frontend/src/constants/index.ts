export enum ChainId {
  NOT_CONNECTED = 0,
  DEVELOPMENT = 1337,
  // MAINNET = 1,
  // RINKEBY = 4,
  AVAX = 43114,
  FUJI = 43113,
  ONE = 1666600000,
}

export const ORACLE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
  [ChainId.DEVELOPMENT]: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
  [ChainId.AVAX]: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
  [ChainId.FUJI]: "",
  [ChainId.ONE]: "",
};

export const USDB_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x1e566B755e0aE9394D081635eE8724c35d3570ff",
  [ChainId.DEVELOPMENT]: "0x1e566B755e0aE9394D081635eE8724c35d3570ff",
  [ChainId.AVAX]: "0x1e566B755e0aE9394D081635eE8724c35d3570ff",
  [ChainId.FUJI]: "0x1e566B755e0aE9394D081635eE8724c35d3570ff",
  [ChainId.ONE]: "",
};

export const CURVE_POOL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.DEVELOPMENT]: "",
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
  [ChainId.ONE]: "",
};

export const BOWTIE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.DEVELOPMENT]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
  [ChainId.ONE]: "",
};

export const COLLATERAL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.DEVELOPMENT]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
  [ChainId.ONE]: "",
};

export const VAULT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  // [ChainId.DEVELOPMENT]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A", //test-deploy
  [ChainId.DEVELOPMENT]: "0x26301F4CA0d63f518e394919B12C76601dfDD5b8", // mainnet-fork
  [ChainId.AVAX]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.FUJI]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.ONE]: "",
};

export const STAKING_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.DEVELOPMENT]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.AVAX]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.FUJI]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.ONE]: "",
};

export const RIBBON_VAULT_COVEREDCALL_ADDRESS: {
  [chainId in ChainId]: string;
} = {
  [ChainId.NOT_CONNECTED]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
  [ChainId.DEVELOPMENT]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
  [ChainId.AVAX]: "0x98d03125c62DaE2328D9d3cb32b7B969e6a87787",
  [ChainId.FUJI]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
  [ChainId.ONE]: "",
};
