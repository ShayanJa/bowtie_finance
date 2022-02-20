import { useCallback, useMemo, useEffect, useState } from "react";
import { ChainId } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import Web3Modal from "web3modal";

import {
  Web3Provider,
  JsonRpcProvider,
  BaseProvider,
  JsonRpcSigner,
} from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { getNetwork } from "@ethersproject/networks";
import { utils } from "ethers";
import { web3Connect, web3Disconnect } from "./actions";
import { AppDispatch, AppState } from "..";
// import WalletConnectProvider from "@walletconnect/web3-provider";

type GeneralProvider =
  | JsonRpcProvider
  | JsonRpcSigner
  | Web3Provider
  | BaseProvider;

const web3Modal = new Web3Modal({
  network: "avax",
  theme: "dark",
  cacheProvider: true,
  // providerOptions: {
  //   walletconnect: {
  //     package: WalletConnectProvider,
  //     options: {
  //       infuraId: "f9e55101f9f34182941ec80382cc4f93",
  //     },
  //   },
  // },
});

export interface Web3Interface {
  address: string;
  provider: GeneralProvider;
  chainId: ChainId;
  balance: string;
}

export const useProvider = (): GeneralProvider => {
  return (window as any).web3Provider;
};

export const useWeb3Modal = (): [() => Promise<void>, () => void] => {
  const dispatch: AppDispatch = useDispatch();

  /* Open wallet selection modal. */
  const connectWallet = useCallback(async () => {
    try {
      const newProvider = await web3Modal.connect();
      (window as any).web3Provider = new Web3Provider(newProvider);
      const accounts = await (window as any).web3Provider.listAccounts();
      const address = accounts[0];
      const balance = (
        await (window as any).web3Provider.getBalance(address)
      ).toString();
      const chainId: number = (
        await (window as any).web3Provider.detectNetwork()
      ).chainId;
      dispatch(
        web3Connect({
          address,
          balance,
          chainId,
        })
      );
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  const disconnectWallet = useCallback(async () => {
    const provider = await web3Modal.connect();
    if (provider.close) {
      //Close connection for wallet connect
      await provider.close();
    }
    web3Modal.clearCachedProvider();
    dispatch(web3Disconnect());
  }, [dispatch]);

  return [connectWallet, disconnectWallet];
};

const useFixedETHBalance = (): string => {
  const balance = useSelector((state: AppState) => state.application.balance);
  const formattedBalance = utils.formatUnits(BigNumber.from(balance));
  return parseFloat(formattedBalance).toFixed(4);
};

export const useNetworkName = (): [string] => {
  const [chainId] = useChainId();
  const network = getNetwork(chainId);
  const { name } = network;
  return [name];
};

export const useChainId = (): [ChainId] => {
  const chainId = useSelector((state: AppState) => state.application.chainId);
  return [chainId];
};

const useEthAddress = (): string => {
  return useSelector((state: AppState) => state.application.address);
};

export const useActiveWeb3 = (): Web3Interface => {
  const [chainId] = useChainId();
  const balance = useFixedETHBalance();
  const address = useEthAddress();
  const provider = useProvider();

  return useMemo(() => {
    if (provider instanceof JsonRpcProvider) {
      return {
        address,
        chainId,
        balance,
        provider: provider.getSigner(),
      };
    }
    return {
      address,
      chainId,
      balance,
      provider,
    };
  }, [address, chainId, balance, provider]);
};

export const useSubscribe = () => {
  const { chainId, address } = useActiveWeb3();
  const [connectWallet] = useWeb3Modal();
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && ethereum.on) {
      const handleChainChanged = () => {
        // eat errors
        connectWallet();
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          connectWallet();
        }
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("disconnect", (error: { code: number; message: string }) => {
        console.log(error);
      });
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
    return undefined;
  }, [chainId, address]); // eslint-disable-line
};
