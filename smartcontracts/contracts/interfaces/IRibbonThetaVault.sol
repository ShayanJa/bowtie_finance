// SPDX-License-Identifier: MIT
pragma solidity =0.8.4;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IRibbonThetaVault is IERC20 {
    function currentOption() external view returns (address);

    function nextOption() external view returns (address);

    function optionAuctionID() external view returns (uint256);

    function pricePerShare() external view returns (uint256);

    function decimals() external view returns (uint256);
}
