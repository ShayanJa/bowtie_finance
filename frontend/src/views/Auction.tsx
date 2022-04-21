import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useAuctions, Auction } from "../hooks/auction";
import { ethAddressSubstring } from "../utils";
import { utils } from "ethers";
import { useUSDB } from "../hooks/usdb";

const auctionList = [
  {
    id: "1",
    Selling: "SHB",
    Buying: "DAI",
    Status: "Ended",
    Type: "Public",
    Participation: "No",
    Network: "Mainnet",
    End_date: "01/02/2022",
  },
  {
    id: "2",
    Selling: "XSA",
    Buying: "USDT",
    Status: "Ended",
    Type: "Public",
    Participation: "No",
    Network: "Mainnet",
    End_date: "01/02/2022",
  },
  {
    id: "3",
    Selling: "OHM",
    Buying: "wETH",
    Status: "Ended",
    Type: "Public",
    Participation: "No",
    Network: "Mainnet",
    End_date: "01/02/2022",
  },
];

function AuctionPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [getAuctions, buyDebt] = useAuctions();
  const [bal, allowance, approve] = useUSDB();

  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const setup = async () => {
      const allowed = await allowance();
      setIsAllowed(allowed);
      setAuctions(await getAuctions());
    };
    setup();
  }, [getAuctions]);

  return (
    <>
      <Header title="Auction" />
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 bg-blend-multiply">
          <div className="flex flex-col px-4 py-6 sm:px-0">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden  rounded-lg">
                  <table className="min-w-full rounded-lg">
                    <thead className="bg-gray-600">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Selling
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Underlying
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Price
                        </th>
                        {/* <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Type
                        </th> */}
                        {/* <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Participation
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Network
                        </th> */}
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Current Value
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          End Date
                        </th>

                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Start</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {auctions.map((auction, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-m font-medium text-white">
                            {ethAddressSubstring(auction.subVault)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-m font-medium text-white">
                            {utils.formatEther(auction.underlying)} ETH
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-m font-medium text-white">
                            {utils.formatEther(auction.price)} USDB
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-m font-medium text-white">
                            {parseFloat(utils.formatEther(auction.val)).toFixed(
                              2
                            )}{" "}
                            USDB
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-m font-medium text-white">
                            {new Date(
                              auction.expiry.toNumber() * 1000
                            ).toLocaleString()}{" "}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-m font-medium text-white">
                            {utils.formatEther(auction.debt)} USDB
                          </td> */}

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={"/auction"}
                              onClick={() =>
                                isAllowed ? buyDebt(idx) : approve()
                              }
                              className="text-gray-300 hover:text-purple-300"
                            >
                              {isAllowed ? "Buy" : "Approve"}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AuctionPage;
