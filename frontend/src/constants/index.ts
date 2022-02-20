export enum ChainId {
  NOT_CONNECTED = 0,
  DEVELOPMENT = 1337,
  // MAINNET = 1,
  RINKEBY = 4,
  AVAX = 43114,
  FUJI = 43113,
  ONE = 1666600000,
}

export const ORACLE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
  [ChainId.DEVELOPMENT]: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
  [ChainId.AVAX]: "0x0A77230d17318075983913bC2145DB16C7366156",
  [ChainId.FUJI]: "",
  [ChainId.RINKEBY]: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  [ChainId.ONE]: "0xdCD81FbbD6c4572A69a534D8b8152c562dA8AbEF",
};

export const USDB_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x1e566B755e0aE9394D081635eE8724c35d3570ff",
  [ChainId.DEVELOPMENT]: "0x1e566B755e0aE9394D081635eE8724c35d3570ff",
  [ChainId.AVAX]: "0x1e566B755e0aE9394D081635eE8724c35d3570ff",
  [ChainId.FUJI]: "0x1e566B755e0aE9394D081635eE8724c35d3570ff",
  [ChainId.RINKEBY]: "0x4957781f947FD022962b0D32b9cA35eFD0C70b56",
  [ChainId.ONE]: "",
};

export const CURVE_POOL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.DEVELOPMENT]: "",
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
  [ChainId.RINKEBY]: "",
  [ChainId.ONE]: "",
};

export const BOWTIE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.DEVELOPMENT]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
  [ChainId.RINKEBY]: "",
  [ChainId.ONE]: "",
};

export const COLLATERAL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.DEVELOPMENT]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
  [ChainId.RINKEBY]: "",
  [ChainId.ONE]: "",
};

export const VAULT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  // [ChainId.DEVELOPMENT]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A", //test-deploy
  [ChainId.DEVELOPMENT]: "0x26301F4CA0d63f518e394919B12C76601dfDD5b8", // mainnet-fork
  [ChainId.AVAX]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.FUJI]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.RINKEBY]: "0x819c6b38a02f876120BCA98A6f815985105c2371",
  [ChainId.ONE]: "",
};

export const STAKING_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.DEVELOPMENT]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.AVAX]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.FUJI]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.RINKEBY]: "",
  [ChainId.ONE]: "",
};

export const RIBBON_VAULT_COVEREDCALL_ADDRESS: {
  [chainId in ChainId]: string;
} = {
  [ChainId.NOT_CONNECTED]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
  [ChainId.DEVELOPMENT]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
  [ChainId.AVAX]: "0x98d03125c62DaE2328D9d3cb32b7B969e6a87787",
  [ChainId.FUJI]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
  [ChainId.RINKEBY]: "",
  [ChainId.ONE]: "",
};
