// SPDX-License-Identifier: MIT
pragma solidity =0.8.4;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IRibbonThetaVault is IERC20 {
    function currentOption() external view returns (address);

    function nextOption() external view returns (address);

    function optionAuctionID() external view returns (uint256);

    function pricePerShare() external view returns (uint256);

    function decimals() external view returns (uint256);
    
    function depositETH() external payable;
    
    function deposit(uint256 amount) external;
    
    function depositFor(uint256 amount, address creditor) external;
    
    function initiateWithdraw(uint256 numShares) external;
    
    function shares(address account) external view returns (uint256);
    
    function depositReceipts(address) external view returns (uint16, uint104, uint128);
    
    function accountVaultBalance(address) external view returns (uint256);
}

