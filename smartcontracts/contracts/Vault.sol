//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IERC20Mintable} from "./interfaces/IERC20Mintable.sol";
import {IRibbonThetaVault} from "./interfaces/IRibbonThetaVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// import {
//     ReentrancyGuardUpgradeable
// } from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {IWETH} from "./interfaces/IWETH.sol";
import {SubVault} from './SubVault.sol';

contract Vault is Ownable {
    using SafeMath for uint256;

    AggregatorV3Interface public oracle;
    IERC20Mintable public usdB;
    IERC20 public collateral;
    IERC20Mintable public rewardToken;
    IRibbonThetaVault public stratVault;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public sharesOf;
    mapping(address => uint256) public borrowed;
    mapping(address => bool) public allowedStables;
    mapping(address => address) private subVaults;

    uint256 public constant LIQUIDATION_FEE = 500;
    uint256 public constant DEPOSIT_FEE = 100;
    uint256 public constant COLATERALIZATION_FACTOR = 9500;
    uint256 public constant FEE_DECIMALS = 4;
    address public immutable WETH;

    constructor(
        address _collateral,
        address _usdB,
        address _oracle,
        address _stratVault,
        address _WETH
    ) {
        usdB = IERC20Mintable(_usdB);
        oracle = AggregatorV3Interface(_oracle);
        WETH = _WETH;
        stratVault = IRibbonThetaVault(_stratVault);
        collateral = IERC20(_collateral);
    }
    
    function depositETH() public payable{
        require(msg.value > 0, "!value");
        IWETH(WETH).deposit{value: msg.value}();
        _deposit(msg.value);
    }
    
    function deposit(uint256 amount) public {
        require(amount > 0, "!value");
        collateral.transferFrom(msg.sender, address(this), amount);
        _deposit(amount);
    }
    
    function _deposit(uint256 amount) internal {
        balanceOf[msg.sender] = balanceOf[msg.sender].add(amount);
        address vault = subVaults[msg.sender];
        if(vault == address(0)) {
            vault = address(new SubVault(address(collateral), address(stratVault)));
            subVaults[msg.sender] = vault;
        }
        collateral.approve(address(vault), amount);
        SubVault(vault).deposit(amount);
    }
  
    function withdraw(uint256 amount) public {
        require(
            amount <= balanceOf[msg.sender],
            "Must be less than deposited"
        );
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(amount);
        // stratVault.deposit(msg.sender, amount);
    }

    function borrow(uint256 amount) public {
        require(amount < maximumBorrowAmount(msg.sender), "Borrowing too much");
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
    }

    function addStableToken(address token) public onlyOwner {
        allowedStables[token] = true;
    }

    function removeStableToken(address token) public onlyOwner {
        allowedStables[token] = true;
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

    function mintUsdB(address token, uint256 amount) public {
        require(allowedStables[token]);
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        usdB.mint(msg.sender, amount);
    }

    function burnUsdB(address token, uint256 amount) public {
        require(allowedStables[token]);
        IERC20Mintable(token).transferFrom(address(this), msg.sender, amount);
        usdB.burn(msg.sender, amount);
    }

    function maximumBorrowAmount(address user) public view returns (uint256) {
        uint256 val = SubVault(subVaults[user]).getValueInUnderlying();
        return
            getValueOfCollateral(val)
                .mul(COLATERALIZATION_FACTOR)
                .div(FEE_DECIMALS);
    }

    function getValueOfCollateral(uint256 amount)
        public
        view
        returns (uint256)
    {
        return
            amount
                .mul(getLatestPrice())
                .div(10**oracle.decimals());
    }

    function getLatestPrice() public view returns (uint256) {
        (, int256 price, , , ) = oracle.latestRoundData();
        return uint256(price);
    }

    function liquidate(address user) public returns (bool) {
        require(getValueOfCollateral(SubVault(subVaults[user]).getValueInUnderlying()) < borrowed[user]);
        uint256 fee = balanceOf[user].mul(LIQUIDATION_FEE).div(
            10**FEE_DECIMALS
        );
        
        balanceOf[msg.sender] = balanceOf[msg.sender].add(fee);
        balanceOf[user] = 0;
    }
}
