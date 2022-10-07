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
  [ChainId.DEVELOPMENT]: "0x79F86fDb626533F6ed19722D7CC3784ED24876dd",
  [ChainId.AVAX]: "0x480f99A35579985353c900827F6bF3B9ff8c41e5",
  [ChainId.FUJI]: "0x1e566B755e0aE9394D081635eE8724c35d3570ff",
  [ChainId.RINKEBY]: "0xadd1100D13A6848F50CB422f0BdC39525f4e9f53",
  [ChainId.ONE]: "",
};

export const USDC_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  [ChainId.DEVELOPMENT]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  [ChainId.AVAX]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  [ChainId.FUJI]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  [ChainId.RINKEBY]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  [ChainId.ONE]: "",
};

export const CURVE_POOL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.DEVELOPMENT]: "",
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.AVAX]: "",
  [ChainId.FUJI]: "",
  [ChainId.RINKEBY]: "0xDD1a612550FC1c00A36d6ef20E456ea6af955722", //TODO change
  [ChainId.ONE]: "",
};

export const BOWTIE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.DEVELOPMENT]: "0xDF2d0269776aa20C6ab98Ed750562144B509151D",
  [ChainId.AVAX]: "0x657b48059c9f82C95A57923f999a356413386B76",
  [ChainId.FUJI]: "",
  [ChainId.RINKEBY]: "",
  [ChainId.ONE]: "",
};

export const COLLATERAL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "",
  [ChainId.DEVELOPMENT]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  [ChainId.AVAX]: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  [ChainId.FUJI]: "",
  [ChainId.RINKEBY]: "0x10a46010D8849d816152fD3Cf22b318D252Fd1f7",
  [ChainId.ONE]: "",
};

export const VAULT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  // [ChainId.DEVELOPMENT]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A", //test-deploy
  [ChainId.DEVELOPMENT]: "0xf2CEC9A7ce1bB82cCFFc4eA3e4056cc8119226ef", // mainnet-fork
  [ChainId.AVAX]: "0x6C43aBa8DedA0A011882a022dBfFA9A8BCe8f658",
  [ChainId.FUJI]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.RINKEBY]: "0x65b62fF7Ec34129a15885E7a7b001bDef8357568",
  [ChainId.ONE]: "",
};

export const STAKING_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.DEVELOPMENT]: "0xEe1a37067AB32390dCBC86D53c8708E6E4c3EAF1",
  [ChainId.AVAX]: "0x5DC83Eb87573297b31f4468e5a11029d1f565dd6",
  [ChainId.FUJI]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.RINKEBY]: "0x35B84A6D1827a267Abbad92809B1124987bfc582",
  [ChainId.ONE]: "",
};

export const BOWTIE_STAKING_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.NOT_CONNECTED]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.DEVELOPMENT]: "0xe3d0f476d638AB700B230047C0f0E1f3c3af017B",
  [ChainId.AVAX]: "0xF3CBBFBDEA1e974E0473207d4E254f485ba58f43",
  [ChainId.FUJI]: "0x566B69225CaD8F2AF3f1Ee890aF569316FFB3e4A",
  [ChainId.RINKEBY]: "0x35B84A6D1827a267Abbad92809B1124987bfc582",
  [ChainId.ONE]: "",
};

export const RIBBON_VAULT_COVEREDCALL_ADDRESS: {
  [chainId in ChainId]: string;
} = {
  [ChainId.NOT_CONNECTED]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
  [ChainId.DEVELOPMENT]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
  [ChainId.AVAX]: "0x98d03125c62DaE2328D9d3cb32b7B969e6a87787",
  [ChainId.FUJI]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
  [ChainId.RINKEBY]: "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
  [ChainId.ONE]: "",
};
