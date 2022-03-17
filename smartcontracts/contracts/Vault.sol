//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IERC20Mintable} from "./interfaces/IERC20Mintable.sol";
import {IRibbonThetaVault} from "./interfaces/IRibbonThetaVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SubVault} from "./SubVault.sol";
import {BaseVault} from "./base/Vault.sol";

contract Vault is BaseVault {
    using SafeMath for uint256;

    IRibbonThetaVault public stratVault;

    mapping(address => SubVault) public subVaults;
    mapping(address => uint256) public owedLiquidations;
    SubVault[] public ownedSubvaults;
    uint256 public numOwnedSubvaults = 0;

    uint256 public constant DISCOUNTED_DEBT_FEE = 500;

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
                FEE_DECIMALS
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
                FEE_DECIMALS
            ) < borrowed[user],
            "Collateral too High"
        );
        uint256 value = subVault.getValueInUnderlying();
        uint256 fee = getValueOfCollateral(value).mul(LIQUIDATION_FEE).div(
            10**FEE_DECIMALS
        );
        borrowed[user] = 0;

        owedLiquidations[msg.sender] = owedLiquidations[msg.sender].add(fee);
        ownedSubvaults.push(subVault);
        subVaults[user] = SubVault(address(0));
        numOwnedSubvaults += 1;
    }

    function withdraw(uint256 amount) public override {
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

    function withdrawTokens(address token, uint256 amount) public onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }

    function buyDebt(address _subVault) public {
        SubVault subVault = SubVault(_subVault);
        uint256 val = subVault.getValueInUnderlying();

        uint256 discountedCollateral = val.mul(DISCOUNTED_DEBT_FEE).div(
            10**FEE_DECIMALS
        );
        collateral.transferFrom(
            msg.sender,
            address(this),
            discountedCollateral
        );
        subVaults[msg.sender] = subVault;
    }
}
