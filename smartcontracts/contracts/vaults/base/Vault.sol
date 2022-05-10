// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IRibbonThetaVault} from "../../interfaces/IRibbonThetaVault.sol";
import {IStakingRewards} from "../../interfaces/IStakingRewards.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IERC20Mintable} from "../../interfaces/IERC20Mintable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IWETH} from "../../interfaces/IWETH.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/// @title BaseVault
/// @notice
/// Typical cdp vault which handls deposit/withdraw/liquidation/repayment
contract BaseVault is Ownable {
    using SafeMath for uint256;

    AggregatorV3Interface public oracle;
    IERC20Mintable public usdB;
    IERC20 public collateral;
    IStakingRewards public stakingRewards;
    IWETH public immutable WETH;

    mapping(address => uint256) private _balanceOf;
    mapping(address => uint256) public borrowed;

    uint256 public constant LIQUIDATION_FEE = 100;
    uint256 public constant DEPOSIT_FEE = 100;
    uint256 public constant COLATERALIZATION_FACTOR = 8000;
    uint256 public constant FEE_DECIMALS = 4;

    /// ======== Events ======== ///
    event Liquidated(address user, address liquidator, uint256 debt);
    event Deposited(address user, uint256 amount);
    event Withdraw(address user, uint256 amount);
    event Repayed(address user, uint256 amount);

    constructor(
        address _collateral,
        address _usdB,
        address _oracle,
        address _stakingRewards,
        address _weth
    ) {
        collateral = IERC20(_collateral);
        usdB = IERC20Mintable(_usdB);
        oracle = AggregatorV3Interface(_oracle);
        stakingRewards = IStakingRewards(_stakingRewards);
        WETH = IWETH(_weth);
    }

    function balanceOf(address addr) public view virtual returns (uint256) {
        return _balanceOf[addr];
    }

    function deposit(uint256 amount) public virtual {
        collateral.transferFrom(msg.sender, address(this), amount);
        _deposit(amount);
    }

    function depositETH() public payable virtual {
        require(msg.value > 0, "!value");
        IWETH(WETH).deposit{value: msg.value}();
        _deposit(msg.value);
    }

    function _deposit(uint256 amount) internal virtual {
        uint256 fee = amount.mul(DEPOSIT_FEE).div(10**FEE_DECIMALS);
        _balanceOf[msg.sender] = _balanceOf[msg.sender].add(amount.sub(fee));
        collateral.transfer(address(stakingRewards), fee);
        stakingRewards.notifyRewardAmount(fee);
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) public virtual {
        require(
            amount <= _balanceOf[msg.sender],
            "Must be less than deposited"
        );
        require(
            borrowed[msg.sender] <=
                getValueOfCollateral(_balanceOf[msg.sender].sub(amount))
                    .mul(COLATERALIZATION_FACTOR)
                    .div(10**FEE_DECIMALS),
            "Too low of collateral"
        );
        _balanceOf[msg.sender] = _balanceOf[msg.sender].sub(amount);
        collateral.transfer(msg.sender, amount);
    }

    function borrow(uint256 amount) public virtual {
        require(
            borrowed[msg.sender].add(amount) < maximumBorrowAmount(msg.sender),
            "Borrowing too much"
        );
        borrowed[msg.sender] = borrowed[msg.sender].add(amount);
        usdB.mint(msg.sender, amount);
    }

    function repay(uint256 amount) public {
        require(
            amount <= borrowed[msg.sender],
            "Amount is greater than borrowed"
        );
        usdB.burn(msg.sender, amount);
        borrowed[msg.sender] = borrowed[msg.sender].sub(amount);
        emit Repayed(msg.sender, amount);
    }

    function maximumBorrowAmount(address user)
        public
        view
        virtual
        returns (uint256)
    {
        return
            getValueOfCollateral(_balanceOf[user])
                .mul(COLATERALIZATION_FACTOR)
                .div(10**FEE_DECIMALS);
    }

    function getValueOfCollateral(uint256 amount)
        public
        view
        virtual
        returns (uint256)
    {
        return amount.mul(getLatestPrice()).div(10**oracle.decimals());
    }

    function getLatestPrice() public view returns (uint256) {
        (, int256 price, , , ) = oracle.latestRoundData();
        return uint256(price);
    }

    function liquidate(address user) public virtual {
        require(
            getValueOfCollateral(_balanceOf[user]) < borrowed[user],
            "Collateral Value Too High"
        );
        uint256 fee = _balanceOf[user].mul(LIQUIDATION_FEE).div(
            10**FEE_DECIMALS
        );
        uint256 debt = _balanceOf[user];
        _balanceOf[user] = 0;
        _balanceOf[msg.sender] = _balanceOf[msg.sender].add(fee);
        emit Liquidated(user, msg.sender, debt);
    }
}
