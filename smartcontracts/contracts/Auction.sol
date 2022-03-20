// SPDX-License-Identifier: MIT
pragma solidity =0.8.4;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title BowTie
/// @notice
/// Auction off Bowties to fulfill to help payback bad debt
/// WIP
contract Auction {
  uint256 public debt;
  address public bowtie;
  address public liquidator;
  uint256 public startTime;
  
  constructor(uint256 _debt, address _bowtie, address _liquidator) {
    debt = _debt;
    bowtie = _bowtie;
    liquidator = _liquidator;
  }
}