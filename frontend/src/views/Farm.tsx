import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useStakingRewards } from "../hooks/stake";
import { useToken } from "../hooks/token";

const FarmPage = () => {
  const [allowance, approve, totalStaked, stake, unstake, getBalance, reward] =
    useStakingRewards();
  const [getCollateralBalance] = useToken();
  const [amount, setAmount] = useState("0");
  const [balance, setBalance] = useState("0");
  const [total, setTotal] = useState("0");
  const [isAllowed, setIsAllowed] = useState(false);
  const [colBal, setColBal] = useState("0");
  const [apy, setAPY] = useState("0");

  const handleInput = (event: any) => {
    event.preventDefault();
    setAmount(event.target.value);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isAllowed) {
      async () => await stake(amount);
    }
    async () => await approve();
  };
  useEffect(() => {
    const setup = async () => {
      const allowed = await allowance();
      setIsAllowed(allowed);
      setBalance(await getBalance());
      setTotal(await totalStaked());
      setColBal(await getBalance());
      setAPY(await reward());
    };
    setup();
  }, [allowance, getBalance, totalStaked, getCollateralBalance]);

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
                    Total Staked
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-white">
                    {total}
                  </dd>
                </div>
                <div className="px-4 py-5 rounded-3xl overflow-hidden sm:p-6">
                  <dt className="text-lg font-medium text-white truncate">
                    My Stake
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-white">
                    {balance}
                  </dd>
                </div>
                <div className="px-4 py-5 rounded-3xl overflow-hidden sm:p-6">
                  <dt className="text-lg font-medium text-white truncate">
                    APY
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-white">
                    {apy}
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
                        onChange={handleInput}
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
                    <div className="pb-2 block text-xl font-medium text-white">
                      {/* TODO */}
                      Balance: {colBal}
                    </div>
                  </div>
                  <div
                    onClick={isAllowed ? () => stake(amount) : () => approve()}
                    className="inline-flex mt-5 justify-center py-4 px-8 border-transparent shadow-sm text-xl font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isAllowed ? "Stake" : "Approve"}
                  </div>
                  <div
                    onClick={
                      isAllowed ? () => unstake(amount) : () => approve()
                    }
                    className="inline-flex mt-5 mx-2 justify-center py-4 px-8 border-transparent shadow-sm text-xl font-medium rounded-xl text-white bg-indigo-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Unstake
                  </div>
                  <div className="inline-flex mt-5 justify-center py-4 px-8 border-transparent shadow-sm text-xl font-medium rounded-xl text-white bg-indigo-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Claim
                  </div>
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
