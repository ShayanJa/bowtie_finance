import React, { useEffect, useState } from "react";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import { useVault } from "../hooks/vault";

const DepositWithdrawPage = () => {
  const [getBalance] = useVault();
  const [balance, setBalance] = useState("0");
  useEffect(() => {
    const setup = async () => {
      const bal = await getBalance();
      setBalance(bal);
    };
    setup();
  }, []);
  return (
    <>
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 bg-blend-multiply">
          <div className="px-4 py-6 sm:px-0">
            <h3 className="text-xl leading-6 font-medium text-white">Stats</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="px-4 py-5 bg-gray-800 shadow rounded-3xl overflow-hidden sm:p-6">
                <dt className="text-lg font-medium text-white truncate">
                  Balance
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-white">
                  {balance || "0"} ETH
                </dd>
              </div>
              <div className="px-4 py-5 bg-gray-800 shadow rounded-3xl overflow-hidden sm:p-6">
                <dt className="text-lg font-medium text-white truncate">
                  Staked
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-white">
                  1.43242421 ETH
                </dd>
              </div>
              <div className="px-4 py-5 bg-gray-800 shadow rounded-3xl overflow-hidden sm:p-6">
                <dt className="text-lg font-medium text-white truncate">
                  Available to Withdraw
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-white">
                  1.43242421 ETH
                </dd>
              </div>
            </dl>
            <Deposit />
            <Withdraw />
          </div>
        </div>
      </main>
    </>
  );
};

export default DepositWithdrawPage;
