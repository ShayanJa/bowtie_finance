//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {IRibbonThetaVault} from "./interfaces/IRibbonThetaVault.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IERC20Mintable} from "./interfaces/IERC20Mintable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
	using SafeMath for uint256;

	AggregatorV3Interface public oracle;
	IERC20Mintable public ribbonUSD;
	IRibbonThetaVault public collateral;
	mapping(address => uint256) public balancesOf;
	mapping(address => uint256) public borrowed;
	mapping(address => bool) public allowedStables;
	uint256 public pendingLiquidation;

	uint256 public liquidationFee = 50;
	uint256 public LIQUIDATION_DECIMALS = 4;
	uint256 public collateralizationFactor = 95;

	constructor(
		address _collateral,
		address _ribbonUSD,
		address _oracle
	) public {
		collateral = IRibbonThetaVault(_collateral);
		ribbonUSD = IERC20Mintable(_ribbonUSD);
		oracle = AggregatorV3Interface(_oracle);
	}

	function deposit(uint256 amount) public {
		collateral.transferFrom(msg.sender, address(this), amount);
		balancesOf[msg.sender] = balancesOf[msg.sender].add(amount);
	}

	function withdraw(uint256 amount) public {
		require(
			amount <= balancesOf[msg.sender],
			"Must be less than deposited"
		);
		balancesOf[msg.sender] = balancesOf[msg.sender].sub(amount);
		collateral.transfer(msg.sender, amount);
	}

	function borrow(uint256 amount) public {
		require(amount < maximumBorrowAmount(msg.sender), "Borrowing too much");
		borrowed[msg.sender] = amount;
		ribbonUSD.mint(msg.sender, amount);
	}

	function repay(uint256 amount) public {
		require(
			amount <= borrowed[msg.sender],
			"Amount is greater than borrowed"
		);
		ribbonUSD.burn(msg.sender, amount);
		borrowed[msg.sender] = borrowed[msg.sender].sub(amount);
	}
	
	function repayWithStable(address token, uint256 amount) public {
		require(allowedStables[token]);
		require(
			amount <= borrowed[msg.sender],
			"Amount is greater than borrowed"
		);
		IERC20(token).transferFrom(msg.sender, address(this), amount);
		borrowed[msg.sender] = borrowed[msg.sender].sub(amount);
	}
	
	function mintUsdB(address token, uint256 amount) public{
		require(allowedStables[token]);
		IERC20(token).transferFrom(msg.sender, address(this), amount);
		ribbonUSD.mint(msg.sender, amount);
	}
	
	function burnUsdB(address token, uint256 amount) public{
		require(allowedStables[token]);
		IERC20Mintable(token).transferFrom(address(this), msg.sender, amount);
		ribbonUSD.burn(msg.sender, amount);
	}
	

	function maximumBorrowAmount(address user) public view returns (uint256) {
		return
			getValueOfCollateral(balancesOf[user])
				.mul(collateralizationFactor)
				.div(100);
	}

	function getValueOfCollateral(uint256 amount)
		public
		view
		returns (uint256)
	{
		return
			amount
				.mul(collateral.pricePerShare())
				.div(10**collateral.decimals())
				.mul(getLatestPrice())
				.div(10**oracle.decimals());
	}

	function getLatestPrice() public view returns (uint256) {
		(, int256 price, , , ) = oracle.latestRoundData();
		return uint256(price);
	}

	function liquidate(address user) public returns (bool) {
		require(getValueOfCollateral(balancesOf[user]) < borrowed[user]);
		uint256 fee = balancesOf[user].mul(liquidationFee).div(
			10**LIQUIDATION_DECIMALS
		);
		balancesOf[msg.sender] = balancesOf[msg.sender].add(fee);
		balancesOf[user] = 0;
	}
}
