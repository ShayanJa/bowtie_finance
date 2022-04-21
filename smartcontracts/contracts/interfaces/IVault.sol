// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVault {
    
    function deposit(uint256 amount) external;

    function withdraw(uint256 amount) external returns (uint256);

    function borrow(uint256 amount) external returns (uint256);

    function repay(uint256 amount) external returns (uint256);

    function liquidate(address user) external returns (uint256);
    
    function getValueOfCollateral(uint256 amount) external view returns (uint256);
    
    function getLatestPrice() external view returns (uint256);
}
