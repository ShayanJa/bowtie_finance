import React from 'react'
import { Link } from 'react-router-dom';
import Header from "../components/Header";
const auctionList = [
  { id:'1', Selling: 'SHB', Buying: 'DAI', Status: 'Ended', Type: 'Public', Participation:'No',Network:'Mainnet', End_date:'01/02/2022'},
  { id:'2', Selling: 'XSA', Buying: 'USDT', Status: 'Ended', Type: 'Public', Participation:'No',Network:'Mainnet', End_date:'01/02/2022'},
  { id:'3', Selling: 'OHM', Buying: 'wETH', Status: 'Ended', Type: 'Public', Participation:'No',Network:'Mainnet', End_date:'01/02/2022'}
]

function AuctionPage() {
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
                    Buying
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
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
                {auctionList.map((auction) => (
                  <tr key={auction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-m font-medium text-white">{auction.Selling}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-m text-white">{auction.Buying}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auction.Status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auction.Type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auction.Participation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auction.Network}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auction.End_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={"/auction"} className="text-gray-300 hover:text-purple-300">
                        Start
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
  )
}

export default AuctionPage