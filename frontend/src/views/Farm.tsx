import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const FarmPage = () => {
  return (
    <>
      <Header title="Farms" />
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 bg-blend-multiply">
          <div className="px-4 py-6 sm:px-0">
            <div className="overflow-hidden rounded-3xl bg-gray-800">
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="px-4 py-5 overflow-hidden sm:p-6">
                  <dt className="text-lg font-medium text-white truncate">
                    Volume
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-white">
                    $143M
                  </dd>
                </div>
                <div className="px-4 py-5 rounded-3xl overflow-hidden sm:p-6">
                  <dt className="text-lg font-medium text-white truncate">
                    Staked
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-white">
                    1.43242421 AVAX
                  </dd>
                </div>
                <div className="px-4 py-5 rounded-3xl overflow-hidden sm:p-6">
                  <dt className="text-lg font-medium text-white truncate">
                    APY
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-white">
                    14.5%
                  </dd>
                </div>
              </dl>
              <form>
                <div className="px-4 py-5 bg-gray-800 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <h1 className="pb-2 block text-xl font-medium text-white">
                      Amount
                    </h1>
                    <div className="col-span-2 sm:col-span-2">
                      <input
                        id="token"
                        // onChange={}
                        name="token"
                        autoComplete="token-name"
                        className="h-14 mt-1 block text-white text-2xl font-semibold w-full py-2 px-3 border-gray-300 bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                      <img
                        src="https://s2.coinmarketcap.com/static/img/coins/64x64/8249.png"
                        className="h-10"
                      />
                    </div>
                  </div>
                  <button className="inline-flex mt-5 justify-center py-4 px-8 border-transparent shadow-sm text-xl font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Stake
                  </button>
                  <button className="inline-flex mt-5 mx-2 justify-center py-4 px-8 border-transparent shadow-sm text-xl font-medium rounded-xl text-white bg-indigo-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Unstake
                  </button>
                  <button className="inline-flex mt-5 justify-center py-4 px-8 border-transparent shadow-sm text-xl font-medium rounded-xl text-white bg-indigo-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Claim
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default FarmPage;
