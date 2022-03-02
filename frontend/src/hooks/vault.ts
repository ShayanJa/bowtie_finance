import { useCallback } from "react";
import { useActiveWeb3, useForceUpdate } from "../state/application/hooks";
import { useVaultContract } from "./contracts";
import { ethers, utils } from "ethers";
import { TestUSDCoin__factory } from "../contracts/generated";
import toast from "react-hot-toast";

export const useVault = (): [
  () => Promise<string>,
  () => Promise<boolean>,
  () => Promise<void>,
  (amount: string) => Promise<void>,
  (amount: string) => Promise<void>,
  () => Promise<string>,
  () => Promise<string>,
  () => Promise<string>,
  (amount: string) => Promise<void>
] => {
  const vault = useVaultContract();
  const { address, provider } = useActiveWeb3();
  const refresh = useForceUpdate();
  const balance = useCallback(async () => {
    try {
      const bal = await vault.balanceOf(address);
      return utils.formatEther(bal);
    } catch (e) {
      console.log(e);
      return "0";
    }
  }, [vault, address]);

  const allowance = useCallback(async () => {
    try {
      const collateral = await vault.collateral();
      const coin = TestUSDCoin__factory.connect(collateral, provider);
      const x = await coin.allowance(address, vault.address);
      return x.gt(0);
    } catch (e) {
      console.log(e);
      return false;
    }
  }, [address, provider]);

  const approve = useCallback(async () => {
    try {
      const req = async () => {
        const collateral = await vault.collateral();
        const coin = TestUSDCoin__factory.connect(collateral, provider);
        const tx = await coin.approve(
          vault.address,
          ethers.constants.MaxUint256
        );
        await tx.wait();
        await refresh();
      };

      await toast.promise(req(), {
        loading: "Approving...",
        success: "Approved",
        error: "Error approving",
      });
    } catch (e) {
      console.log(e);
    }
  }, [address, provider]);

  const deposit = useCallback(
    async (amount) => {
      try {
        const req = async () => {
          const tx = await vault.depositETH({
            value: utils.parseEther(amount),
          });
          await tx.wait();
        };

        await toast.promise(req(), {
          loading: "Depositing...",
          success: "Deposited",
          error: "Error Depositing",
        });
        await refresh();
      } catch (e) {
        console.log(e);
      }
    },
    [vault, address]
  );

  const borrow = useCallback(
    async (amount) => {
      try {
        const req = async () => {
          const tx = await vault.borrow(utils.parseEther(amount));
          await tx.wait();
        };
        await toast.promise(req(), {
          loading: "Borrowing...",
          success: "Borrowed",
          error: "Error Borrowing",
        });
        await refresh();
      } catch (e) {
        console.log(e);
      }
    },
    [vault, address]
  );
  const maxiumBorrow = useCallback(async () => {
    try {
      const maxi = await vault.maximumBorrowAmount(address);
      return utils.formatEther(maxi);
    } catch (e) {
      console.log(e);
      return "0";
    }
  }, [vault, address]);
  const getValueOfCollateral = useCallback(async () => {
    try {
      console.log((await vault.getLatestPrice()).toString());
      const bal = await vault.balanceOf(address);
      const val = await vault.getValueOfCollateral(bal);
      return utils.formatEther(val);
    } catch (e) {
      console.log(e);
      return "0";
    }
  }, [vault, address]);

  const borrowed = useCallback(async () => {
    try {
      const bal = await vault.borrowed(address);
      return utils.formatEther(bal);
    } catch (e) {
      console.log(e);
      return "0";
    }
  }, [vault, address]);

  const withdraw = useCallback(
    async (amount) => {
      try {
        const req = async () => {
          const tx = await vault.withdraw(utils.parseEther(amount));
          await tx.wait();
        };
        await toast.promise(req(), {
          loading: "Withdrawing...",
          success: "Withdrawed",
          error: "Error Withdrawing",
        });
        await refresh();
      } catch (e) {
        console.log(e);
      }
    },
    [vault, address]
  );

  return [
    balance,
    allowance,
    approve,
    deposit,
    borrow,
    maxiumBorrow,
    getValueOfCollateral,
    borrowed,
    withdraw,
  ];
};
