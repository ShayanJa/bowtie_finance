import { createAction } from "@reduxjs/toolkit";

export const web3Connect = createAction<{
  address: string;
  balance: string;
  chainId: number;
  blockNumber: number;
}>("application/web3Connect");

export const web3Disconnect = createAction("application/web3Disconnect");

export const updateUsdBalance = createAction<{ balance: string }>(
  "application/updateUsdcBalance"
);

export const updateCollateralBalance = createAction<{ balance: string }>(
  "application/updateCollateralBalance"
);
