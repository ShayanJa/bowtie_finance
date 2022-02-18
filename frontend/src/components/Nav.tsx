import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/bowtielogo.png";
import { useActiveWeb3, useWeb3Modal } from "../state/application/hooks";
import { ethAddressSubstring } from "../utils";

const Nav = () => {
  const [connectWallet, disconnectWallet] = useWeb3Modal();
  const { address } = useActiveWeb3();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  const links = [
    { text: "Home", to: "/" },
    { text: "Deposit", to: "/deposit" },
    { text: "Withdraw", to: "/withdraw" },
    { text: "Borrow", to: "/borrow" },
    { text: "Payback", to: "/payback" },
    { text: "Portfolio", to: "/portfolio" },
  ];

  const activeClass = "text-white bg-gray-900";
  const inactiveClass = "text-gray-300 hover:text-white hover:bg-gray-700";

  return (
    <nav className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-8 w-full" src={Logo} alt="logo" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {links.map((link, i) => (
                  <Link
                    key={link.text}
                    to={link.to}
                    className={`px-4 py-2 rounded-3xl text-xl font-medium ${
                      location.pathname === link.to
                        ? activeClass
                        : inactiveClass
                    } ${i > 0 && "ml-4"}`}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0 order-last">
              <button
                // type="submit"
                onClick={!address ? connectWallet : disconnectWallet}
                className="inline-flex justify-center ml-5 py-2 px-6 border-transparent shadow-sm text-xl font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {address ? ethAddressSubstring(address) : "Connect Wallet"}
              </button>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
            >
              {/* Menu open: "hidden", Menu closed: "block" */}
              <svg
                className="block h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Menu open: "block", Menu closed: "hidden" */}
              <svg
                className="hidden h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
