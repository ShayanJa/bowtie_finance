import React from "react";
import Header from "../components/Header";
import Borrow from "./Borrow";

const BorrowPaybackPage = () => {
  return (
    <>
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 bg-blend-multiply">
          <h3 className="mt-5 text-xl leading-6 font-medium text-white">Stats</h3>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="px-4 py-5 bg-gray-800 shadow rounded-3xl overflow-hidden sm:p-6">
              <dt className="text-lg font-medium text-white truncate">
                Balance
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                2.45453 AVAX
              </dd>
            </div>
            <div className="px-4 py-5 bg-gray-800 shadow rounded-3xl overflow-hidden sm:p-6">
              <dt className="text-lg font-medium text-white truncate">
              Borrowed
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                1.43242421 AVAX
              </dd>
            </div>
            <div className="px-4 py-5 bg-gray-800 shadow rounded-3xl overflow-hidden sm:p-6">
              <dt className="text-lg font-medium text-white truncate">
                Staked
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                1.43242421 AVAX
              </dd>
            </div>
          </dl>
          <Borrow />
          {/* TODO
              <Payback/> */}
        </div>
      </main>
    </>
  );
};

export default BorrowPaybackPage;
