//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IRibbonThetaVault} from "./interfaces/IRibbonThetaVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SubVault is Ownable {
  using SafeMath for uint256;
  
  IRibbonThetaVault public stratVault;
  IERC20 public collateral;

  constructor(address _collateral, address _stratVault ) {
    collateral = IERC20(_collateral);
    stratVault = IRibbonThetaVault(_stratVault);
  }
  
  function deposit(uint256 amount) public {
    collateral.transferFrom(msg.sender, address(this), amount);
    collateral.approve(address(stratVault), amount);
    stratVault.deposit(amount);
  }
  
  function getValueInUnderlying() public view returns (uint256){
    (,uint104 amount,) = stratVault.depositReceipts(address(this));
    uint256 accValue = stratVault.accountValueBalance(address(this));
    return  accValue.add(uint256(amount));
  }
  
  function withdraw(uint256 amount) public {
    stratVault.initiateWithdraw(amount);
  }
  
}