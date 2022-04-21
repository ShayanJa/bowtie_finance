import { useCallback } from "react";
import { useActiveWeb3, useForceUpdate } from "../state/application/hooks";
import { useOptionsContract, useVaultContract } from "./contracts";
import { BigNumber, BigNumberish, ethers, utils } from "ethers";
import toast from "react-hot-toast";
import { useSubVaultContract, useRibbonVaultContract } from "./contracts";

export interface Auction {
  liquidator: string;
  debt: ethers.BigNumber;
  subVault: string;
  price: ethers.BigNumber;
  underlying: ethers.BigNumber;
  val: ethers.BigNumber;
  expiry: ethers.BigNumber;
}

export const useAuctions = (): [
  () => Promise<Auction[]>,
  (auctionId: BigNumberish) => Promise<void>
] => {
  const vault = useVaultContract();
  const ribbonVault = useRibbonVaultContract();
  const SubVault = useSubVaultContract();
  const OptionContract = useOptionsContract();
  const { address } = useActiveWeb3();
  const refresh = useForceUpdate();

  const auctions = useCallback(async () => {
    try {
      const numAuctions = await vault.numAuctions();
      let bonds = [];
      for (var i = 0; i < numAuctions.toNumber(); i++) {
        const {
          debt,
          liquidator,
          subVault: subVaultAddress,
          price,
        } = await vault.auctions(i);
        const { currentOption } = await ribbonVault.optionState();
        const option = OptionContract(currentOption);
        const expiry = await option.expiryTimestamp();
        const subVault = SubVault(subVaultAddress);
        const underlying = await subVault.getValueInUnderlying();
        const val = await vault.getValueOfCollateral(underlying);

        const bond: Auction = {
          liquidator,
          debt,
          subVault: subVaultAddress,
          price,
          underlying,
          val,
          expiry,
        };
        bonds.push(bond);
      }
      return bonds;
    } catch (e) {
      console.log(e);
      return [];
    }
  }, [vault, ribbonVault, SubVault, OptionContract, address]);

  const buyDebt = useCallback(
    async (auctionId: BigNumberish) => {
      try {
        const req = async () => {
          const tx = await vault.buyDebt(auctionId);
          await tx.wait();
        };
        await toast.promise(req(), {
          loading: "Buying Bond...",
          success: "Bond Bought",
          error: "Error Buying Bond",
        });
        await refresh();
        await refresh();
      } catch (e) {
        console.log(e);
        return;
      }
    },
    [vault, address]
  );

  return [auctions, buyDebt];
};
