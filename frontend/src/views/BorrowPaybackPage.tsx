import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Borrow from "./Borrow";
import Payback from "./Payback";
import { useVault } from "../hooks/vault";

const BorrowPaybackPage = () => {
  const [getBalance, , , , , maxiumBorrow, getValueOfCollateral, getBorrowed] =
    useVault();
  const [balance, setBalance] = useState("0");
  const [value, setValue] = useState("0");
  const [borrowedAmount, setborrowedAmount] = useState("0");
  const [ratio, setRatio] = useState(0);
  useEffect(() => {
    const setup = async () => {
      const bal = await getBalance();
      const col = await getValueOfCollateral();
      const bor = await getBorrowed();
      setBalance(bal);
      setValue(col);
      setborrowedAmount(bor);
      setRatio((parseFloat(col) * 100) / parseFloat(bor));
    };
    setup();
  }, [getBalance, getBorrowed, getValueOfCollateral]);
  return (
    <>
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 bg-blend-multiply">
          <h3 className="mt-5 text-xl leading-6 font-medium text-white">
            Stats
          </h3>
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
                Borrowed
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {borrowedAmount} USDB
              </dd>
            </div>
            <div className="px-4 py-5 bg-gray-800 shadow rounded-3xl overflow-hidden sm:p-6">
              <dt className="text-lg font-medium text-white truncate">
                Collateral Ratio
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {/* 185.714% */}
                {ratio.toFixed(3)} %
              </dd>
            </div>
          </dl>
          <Borrow />
          <Payback />
          {/* TODO
              <Payback/> */}
        </div>
      </main>
    </>
  );
};

export default BorrowPaybackPage;
