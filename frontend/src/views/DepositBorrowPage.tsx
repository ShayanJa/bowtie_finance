import React, { useEffect, useState } from "react";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import { useVault } from "../hooks/vault";
import { useAPY } from "../hooks/useAPY";

const DepositWithdrawPage = () => {
  const [
    getBalance,
    ,
    ,
    ,
    ,
    maxiumBorrow,
    getValueOfCollateral,
    ,
    ,
    ,
    getMaxWithdraw,
  ] = useVault();
  const [getAPY] = useAPY();
  const [balance, setBalance] = useState("0");
  const [value, setValue] = useState("0");
  const [apy, setAPY] = useState("0");
  const [maxWithdraw, setMaxWithdraw] = useState("0");
  useEffect(() => {
    const setup = async () => {
      setBalance(await getBalance());
      setValue(await getValueOfCollateral());
      setAPY(await getAPY());
      setMaxWithdraw(await getMaxWithdraw());
    };
    setup();
  }, [getBalance, getValueOfCollateral, getAPY, getMaxWithdraw]);
  return (
    <>
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 bg-blend-multiply">
          <div className="px-4 py-6 sm:px-0">
            <h3 className="text-xl leading-6 font-medium text-white">Stats</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="px-4 py-5 bg-gray-800 shadow rounded-3xl overflow-hidden sm:p-6">
                <dt className="text-lg font-medium text-white truncate">
                  Deposited
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-white">
                  {balance || "0"} ETH
                </dd>
              </div>
              <div className="px-4 py-5 bg-gray-800 shadow rounded-3xl overflow-hidden sm:p-6">
                <dt className="text-lg font-medium text-white truncate">
                  Earning
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-white">
                  {apy} %
                </dd>
              </div>
              <div className="px-4 py-5 bg-gray-800 shadow rounded-3xl overflow-hidden sm:p-6">
                <dt className="text-lg font-medium text-white truncate">
                  Available to Withdraw
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-white">
                  {maxWithdraw} ETH
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
