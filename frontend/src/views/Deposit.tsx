import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useActiveWeb3 } from "../state/application/hooks";
import { useVault } from "../hooks/vault";

const Deposit = () => {
  const [allowance, approve, deposit] = useVault();
  const [amount, setAmount] = useState("0");
  const { balance } = useActiveWeb3();

  const handleInput = (event: any) => {
    event.preventDefault();
    setAmount(event.target.value);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if(isAllowed){
      async () => await deposit(amount)
    }
      async () => await approve()
  }
  const [isAllowed, setIsAllowed] = useState(false);
  useEffect(() => {
    const setup = async () => {
      const allowed = await allowance();
      setIsAllowed(allowed);
    };
    setup();
  });
  return (
    <>
      <h2 className="mt-10 text-xl leading-6 font-medium text-white">Deposit</h2>
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 bg-blend-multiply">
        <div>
      
    </div>

          <div className="px-4 py-6 sm:px-0">
            <form onSubmit={handleSubmit}>
              <div className="overflow-hidden rounded-3xl">
                <div className="px-4 py-5 bg-gray-800 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="pb-2 block text-xl font-medium text-white"
                      >
                        Amount: {balance}
                      </label>
                      <input
                        id="token"
                        name="token"
                        onChange={handleInput}
                        autoComplete="token-name"
                        className="h-14 mt-1 block text-white text-2xl font-semibold w-full py-2 px-3 border-gray-300 bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block pb-2 text-xl font-medium text-white"
                      >
                        Token
                      </label>
                      <select
                        id="token"
                        name="token"
                        autoComplete="token-name"
                        className="h-14 mt-1 block text-white text-xl font-semibold w-full py-2 px-3 border-gray-300 bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option>AVAX</option>
                        <option>BTC</option>
                        <option>ONE</option>
                      </select>
                    </div>
                  </div>
                  <button
                  type="submit"
                    className="inline-flex mt-5 justify-center py-4 px-8 border-transparent shadow-sm text-xl font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isAllowed ? "Deposit" : "Approve"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Deposit;
