import { createReducer } from "@reduxjs/toolkit";
import { updateUsdBalance, web3Connect, web3Disconnect } from "./actions";
import { ChainId } from "../../constants";
import { ethers } from "ethers";

export interface BoolMap {
  readonly [address: string]: boolean;
}

export interface ApplicationState {
  readonly address: string;
  readonly balance: string;
  readonly chainId: number;
}

const initialState: ApplicationState = {
  // Web3
  address: "",
  balance: "0",
  chainId: ChainId.NOT_CONNECTED,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(web3Connect, (state, action) => {
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.balance = action.payload.balance;
    })
    .addCase(web3Disconnect, (state, action) => {
      state.address = "";
      state.chainId = ChainId.NOT_CONNECTED;
      state.balance = "0";
    })
);
