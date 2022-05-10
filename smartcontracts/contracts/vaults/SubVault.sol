// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IRibbonThetaVault} from "../interfaces/IRibbonThetaVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title SubVault
/// @notice
/// Dedicated vault for each user to simplify accounting and concentrate risk
contract SubVault is Ownable {
    using SafeMath for uint256;

    IRibbonThetaVault public stratVault;
    IERC20 public collateral;

    constructor(address _collateral, address _stratVault) {
        collateral = IERC20(_collateral);
        stratVault = IRibbonThetaVault(_stratVault);
    }

    function deposit(uint256 amount) public onlyOwner {
        collateral.transferFrom(msg.sender, address(this), amount);
        collateral.approve(address(stratVault), amount);
        stratVault.deposit(amount);
    }

    /*
    / Ribbon interactions
     */
    function getValueInUnderlying() public view returns (uint256) {
        (uint16 curRound, , , , ) = stratVault.vaultState();
        (uint16 round, uint104 amount, ) = stratVault.depositReceipts(
            address(this)
        );
        uint256 accValue = stratVault.accountVaultBalance(address(this));
        if (curRound > round) {
            return accValue;
        } else {
            return accValue.add(uint256(amount));
        }
    }

    function initiateWithdraw(uint256 amount) public onlyOwner {
        stratVault.initiateWithdraw(amount);
    }

    function withdrawInstantly(uint256 amount) public onlyOwner {
        stratVault.withdrawInstantly(amount);
    }

    function completeWithdraw() public onlyOwner {
        stratVault.completeWithdraw();
    }

    function withdrawTokens(uint256 amount) public onlyOwner {
        collateral.transfer(owner(), amount);
    }

    function withdrawAllCollateral() public onlyOwner {
        uint256 amount = collateral.balanceOf(address(this));
        collateral.transfer(owner(), amount);
    }
}
