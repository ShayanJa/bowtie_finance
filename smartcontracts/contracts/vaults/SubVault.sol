// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IRibbonThetaVault} from "../interfaces/IRibbonThetaVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IWETH} from "../interfaces/IWETH.sol";

/// @title SubVault
/// @notice
/// Dedicated vault for each user to simplify accounting and concentrate risk
contract SubVault is Ownable {
    using SafeMath for uint256;

    IRibbonThetaVault public stratVault;
    IERC20 public collateral;
    IWETH public immutable WETH;

    constructor(
        address _collateral,
        address _stratVault,
        address _weth
    ) {
        collateral = IERC20(_collateral);
        stratVault = IRibbonThetaVault(_stratVault);
        WETH = IWETH(_weth);
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

    function withdrawTokens(address recipient, uint256 amount)
        public
        onlyOwner
    {
        if (address(collateral) == address(WETH)) {
            (bool success, ) = recipient.call{value: amount}("");
            require(success, "Transfer failed");
            return;
        }
        collateral.transfer(recipient, amount);
    }

    function withdrawAllCollateral() public onlyOwner {
        uint256 amount = collateral.balanceOf(address(this));
        collateral.transfer(owner(), amount);
    }

    receive() external payable {}
}
