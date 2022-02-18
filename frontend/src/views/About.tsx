import React from "react";
import Header from "../components/Header";

const About = () => {
  return (
    <>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mt-10 mx-auto max-w-screen-2xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h2 className="text-6xl font-extrabold text-white sm:text-5xl sm:leading-none md:text-6xl">
                Options Backed Stablecoins
                </h2>
                <p className="py-6 text-slate-50 sm:mt-5 sm:text-2xl sm:max-w-xl sm:mx-auto md:mt-5 md:text-2xl lg:mx-0">
                As capital becomes more fluid, any asset can be used as collateral. Users in Defi have unlocked liquidity by borrowing against spot, interest-bearing, fixed income, and market neutral collateral tokens, but nobody has unlocked liquidity in options. But now, using Bowtie, users can mint USDB against options collateral, unlocking a whole new world of capital efficiency.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default About;
