// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IRibbonThetaVault} from "./interfaces/IRibbonThetaVault.sol";
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

    function initiateMaxWithdraw() public onlyOwner {
        uint256 shares = stratVault.shares(msg.sender);
        stratVault.initiateWithdraw(shares);
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(amount > 0, "!amount");
        initiateWithdraw(amount);
    }

    function withdrawAll() public {
        (, uint104 amount, uint128 unredeemedShares) = stratVault
            .depositReceipts(msg.sender);
        if (amount > 0) {
            stratVault.withdrawInstantly(amount);
        }
        if (unredeemedShares > 0) {
            initiateMaxWithdraw();
        }
    }

    function withdrawTokens(uint256 amount) public onlyOwner {
        collateral.transfer(owner(), amount);
    }
}
