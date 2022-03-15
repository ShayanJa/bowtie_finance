import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/bowtielogo.png";
import { useChainId } from "../state/application/hooks";
import { ChainId } from "../constants";

const ValidChain = (props: any) => {
  const [chainId] = useChainId();
  console.log(chainId);
  if (chainId in ChainId) {
    return <div>{props.children}</div>;
  } else {
    return (
      <div className="text-3xl font-bold leading-tight text-white">
        Unsupported chain
      </div>
    );
  }
};

export default ValidChain;
