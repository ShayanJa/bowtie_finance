// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IERC20Mintable} from "./interfaces/IERC20Mintable.sol";
import {IRibbonThetaVault} from "./interfaces/IRibbonThetaVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SubVault} from "./SubVault.sol";
import {BaseVault} from "./base/Vault.sol";

/// @title Vault
/// @notice
/// Uses BaseVault.sol
/// - To simplify accounting, ribbon subvaults are created
/// - Subvaults are owned by the Vault unless auctioned off then they are owned by the buyer
contract Vault is BaseVault {
    using SafeMath for uint256;

    IRibbonThetaVault public stratVault;

    mapping(address => SubVault) public subVaults;
    Auction[] public auctions;
    uint256 public numAuctions = 0;

    uint256 public constant DISCOUNTED_DEBT_FEE = 500;

    struct Auction {
        address liquidator;
        uint256 debt;
        SubVault subvault;
    }

    constructor(
        address _collateral,
        address _usdB,
        address _oracle,
        address _stakingRewards,
        address _weth,
        address _stratVault
    ) BaseVault(_collateral, _usdB, _oracle, _stakingRewards, _weth) {
        stratVault = IRibbonThetaVault(_stratVault);
    }

    function balanceOf(address addr) public view override returns (uint256) {
        if (address(subVaults[addr]) != address(0)) {
            return subVaults[addr].getValueInUnderlying();
        }
        return 0;
    }

    function _deposit(uint256 amount) internal virtual override {
        SubVault vault = subVaults[msg.sender];
        if (address(vault) == address(0)) {
            vault = new SubVault(address(collateral), address(stratVault));
            subVaults[msg.sender] = vault;
        }
        collateral.approve(address(stratVault), amount);
        stratVault.depositFor(amount, address(vault));
    }

    function maximumBorrowAmount(address user)
        public
        view
        override
        returns (uint256)
    {
        require(
            address(subVaults[user]) != address(0),
            "Vault must be owned by someone"
        );
        uint256 val = SubVault(subVaults[user]).getValueInUnderlying();
        return
            getValueOfCollateral(val).mul(COLATERALIZATION_FACTOR).div(
                10**FEE_DECIMALS
            );
    }

    function getValueOfCollateral(uint256 amount)
        public
        view
        override
        returns (uint256)
    {
        return amount.mul(getLatestPrice()).div(10**oracle.decimals());
    }

    function liquidate(address user) public override {
        SubVault subVault = SubVault(subVaults[user]);
        uint256 val = subVault.getValueInUnderlying();
        require(
            getValueOfCollateral(val).mul(COLATERALIZATION_FACTOR).div(
                10**FEE_DECIMALS
            ) < borrowed[user],
            "Collateral too High"
        );
        uint256 debt = borrowed[user];
        uint256 value = subVault.getValueInUnderlying();
        uint256 fee = getValueOfCollateral(value).mul(LIQUIDATION_FEE).div(
            10**FEE_DECIMALS
        );
        Auction memory auction = Auction(msg.sender, debt, subVault);
        auctions.push(auction);
        numAuctions += 1;
        borrowed[user] = 0;

        subVault.initiateMaxWithdraw();

        subVaults[user] = SubVault(address(0));

        emit Liquidated(user, msg.sender, debt);
    }

    function withdraw(uint256 amount) public virtual override {
        require(amount <= balanceOf(msg.sender), "Must be less than deposited");
        initiateWithdraw(amount);
    }

    /// @notice Initiates withdraw of the collateral from ribbon
    /// @param amount Amount of Collateral to withdraw from subvault
    function initiateWithdraw(uint256 amount) public {
        uint256 val = SubVault(subVaults[msg.sender]).getValueInUnderlying();
        require(
            borrowed[msg.sender] <=
                getValueOfCollateral(val.sub(amount))
                    .mul(COLATERALIZATION_FACTOR)
                    .div(FEE_DECIMALS),
            "Too low of collateral"
        );
        SubVault(subVaults[msg.sender]).initiateWithdraw(amount);
    }

    /// @notice Withdraw tokens from subvault
    /// @param token Token to withdraw from subvault
    /// @param amount Amount of Collaterall to withdraw from subvault
    function withdrawTokens(address token, uint256 amount) public onlyOwner {
        SubVault subVault = subVaults[msg.sender];
        subVault.withdrawTokens(token, amount);
        IERC20(token).transfer(owner(), amount);
    }

    /// @notice Buys the auctioned off options collateral
    /// @dev Sender should have enough usdb
    /// @param auctionId Name of the variable to set
    function buyDebt(uint256 auctionId) public {
        Auction memory auction = auctions[auctionId];
        SubVault subVault = auction.subvault;
        uint256 val = subVault.getValueInUnderlying();

        uint256 discountedCollateral = val
            .mul((10**FEE_DECIMALS).sub(DISCOUNTED_DEBT_FEE))
            .div(10**FEE_DECIMALS);
        usdB.transferFrom(msg.sender, address(this), discountedCollateral);
        subVault.transferOwnership(msg.sender);
        auctions[auctionId] = auctions[auctions.length - 1];
        auctions.pop();
        numAuctions -= 1;
    }
}
