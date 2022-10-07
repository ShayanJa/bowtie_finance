// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IERC20Mintable} from "../interfaces/IERC20Mintable.sol";
import {IRibbonThetaVault} from "../interfaces/IRibbonThetaVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SubVault} from "./SubVault.sol";
import {BaseVault} from "./base/Vault.sol";
import {BowTie} from "../BowTie.sol";
import {IStakingRewards} from "../interfaces/IStakingRewards.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

/// @title Vault
/// @notice
/// Uses BaseVault.sol
/// - To simplify accounting, ribbon subvaults are created
/// - Subvaults are owned by the Vault unless auctioned off then they are owned by the buyer
contract Vault is BaseVault {
    using SafeMath for uint256;

    IRibbonThetaVault public stratVault;
    BowTie public bowtie;
    IStakingRewards public bowtieStaking;

    mapping(address => SubVault) public subVaults;
    Auction[] public auctions;
    uint256 public numAuctions = 0;
    address public USDC;

    uint256 public DISCOUNTED_DEBT_FEE = 500;
    uint256 public LP_PERCENT = 0;
    uint256 public INSURANCE_PERCENT = 10000;
    uint256 public CUTOFF = 11000;

    struct Auction {
        address liquidator;
        uint256 debt;
        uint256 price;
        SubVault subVault;
    }

    constructor(
        address _collateral,
        address _usdB,
        address _oracle,
        address _stakingRewards,
        address _weth,
        address _bowtie,
        address _bowtieStaking,
        address _stratVault,
        address _usdc,
        address _swapRouter
    )
        BaseVault(
            _collateral,
            _usdB,
            _oracle,
            _stakingRewards,
            _weth,
            _usdc,
            _swapRouter
        )
    {
        stratVault = IRibbonThetaVault(_stratVault);
        bowtie = BowTie(_bowtie);
        bowtieStaking = IStakingRewards(_bowtieStaking);
        USDC = _usdc;
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
            vault = new SubVault(
                address(collateral),
                address(stratVault),
                address(WETH)
            );
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
        uint256 price = debt
            .mul((10**FEE_DECIMALS).add(DISCOUNTED_DEBT_FEE))
            .div(10**FEE_DECIMALS);

        Auction memory auction = Auction(msg.sender, debt, price, subVault);
        auctions.push(auction);
        numAuctions += 1;
        borrowed[user] = 0;

        uint256 shares = stratVault.shares(address(subVault));
        subVault.initiateWithdraw(shares);

        subVaults[user] = SubVault(payable(address(0)));

        emit Liquidated(user, msg.sender, debt);
    }

    /// @notice Withdraw tokens from subvault
    /// @param amount Amount of Collaterall to withdraw from subvault
    function withdraw(uint256 amount) public virtual override {
        withdrawInstantly(amount);
    }

    function withdrawInstantly(uint256 amount) public {
        require(amount <= balanceOf(msg.sender), "Must be less than deposited");

        SubVault subVault = SubVault(subVaults[msg.sender]);
        uint256 val = subVault.getValueInUnderlying();

        require(
            borrowed[msg.sender] <=
                getValueOfCollateral(val.sub(amount))
                    .mul(COLATERALIZATION_FACTOR)
                    .div(FEE_DECIMALS),
            "Too low of collateral"
        );

        subVault.withdrawInstantly(amount);
        _withdrawTokens(amount);
    }

    /// @notice Initiates withdraw of the collateral from ribbon
    /// If the collateral is being used in an option it will be processed
    /// by ribbon at option expiry
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
    /// @param amount Amount of Collaterall to withdraw from subvault
    function _withdrawTokens(uint256 amount) internal {
        SubVault subVault = subVaults[msg.sender];
        subVault.withdrawTokens(msg.sender, amount);
    }

    function completeWithdraw() public {
        subVaults[msg.sender].completeWithdraw();
    }

    /// @notice Buys the auctioned off options collateral
    /// @dev Sender should have enough usdb
    /// @param auctionId Name of the variable to set
    function buyDebt(uint256 auctionId) public {
        Auction memory auction = auctions[auctionId];
        uint256 underlying = auction.subVault.getValueInUnderlying();
        uint256 curValue = getValueOfCollateral(underlying);

        uint256 discountedCollateral = auction.price;

        require(curValue > discountedCollateral, "Collateral Value too low");

        auctions[auctionId] = auctions[auctions.length - 1];
        auctions.pop();
        numAuctions -= 1;

        usdB.transferFrom(msg.sender, address(this), discountedCollateral);
        uint256 insuranceFee = auction.debt.mul(INSURANCE_PERCENT).div(
            10**FEE_DECIMALS
        );
        usdB.transfer(address(bowtieStaking), insuranceFee);
        bowtieStaking.notifyRewardAmount(insuranceFee);

        auction.subVault.transferOwnership(msg.sender);
    }

    /// @notice TODO: Sell all bad debt
    /// @dev Should be called by
    function rolloverBadDebt() public onlyOwner {
        for (uint256 i = 0; i < auctions.length; i++) {
            //todo Sell all bonds
            Auction memory auction = auctions[i];
            //Get Collateral from Ribbon Deposit

            uint256 bal = collateral.balanceOf(address(auction.subVault));
            auction.subVault.completeWithdraw();
            auction.subVault.withdrawAllCollateral();
            swapExactInputSingle(bal);

            // Swap the assets in the auctions
            // ISwapper : function ()
        }
    }

    receive() external payable {}
}
