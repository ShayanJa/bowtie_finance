// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IRibbonThetaVault} from "../../interfaces/IRibbonThetaVault.sol";
import {IStakingRewards} from "../../interfaces/IStakingRewards.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IERC20Mintable} from "../../interfaces/IERC20Mintable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IWETH} from "../../interfaces/IWETH.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

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
    ISwapRouter public immutable swapRouter;
    address public usdc;

    mapping(address => uint256) private _balanceOf;
    mapping(address => uint256) public borrowed;

    uint256 public constant LIQUIDATION_FEE = 100;
    uint256 public constant DEPOSIT_FEE = 100;
    uint256 public constant COLATERALIZATION_FACTOR = 8000;
    uint256 public constant FEE_DECIMALS = 4;

    uint24 public constant poolFee = 3000;

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
        address _weth,
        address _usdc,
        address _swapRouter
    ) {
        collateral = IERC20(_collateral);
        usdB = IERC20Mintable(_usdB);
        oracle = AggregatorV3Interface(_oracle);
        stakingRewards = IStakingRewards(_stakingRewards);
        WETH = IWETH(_weth);
        swapRouter = ISwapRouter(_swapRouter);
        usdc = _usdc;
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

    /// @notice swapExactInputSingle swaps a fixed amount of DAI for a maximum possible amount of WETH9
    /// using the DAI/WETH9 0.3% pool by calling `exactInputSingle` in the swap router.
    /// @dev The calling address must approve this contract to spend at least `amountIn` worth of its DAI for this function to succeed.
    /// @param amountIn The exact amount of DAI that will be swapped for WETH9.
    /// @return amountOut The amount of WETH9 received.
    function swapExactInputSingle(uint256 amountIn)
        public
        onlyOwner
        returns (uint256 amountOut)
    {
        // Approve the router to spend DAI.
        TransferHelper.safeApprove(
            address(WETH),
            address(swapRouter),
            amountIn
        );

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: address(WETH),
                tokenOut: usdc,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    /// @notice swapExactOutputSingle swaps a minimum possible amount of DAI for a fixed amount of WETH.
    /// @dev The calling address must approve this contract to spend its DAI for this function to succeed. As the amount of input DAI is variable,
    /// the calling address will need to approve for a slightly higher amount, anticipating some variance.
    /// @param amountOut The exact amount of WETH9 to receive from the swap.
    /// @param amountInMaximum The amount of DAI we are willing to spend to receive the specified amount of WETH9.
    /// @return amountIn The amount of DAI actually spent in the swap.
    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum)
        external
        returns (uint256 amountIn)
    {
        // Transfer the specified amount of DAI to this contract.
        TransferHelper.safeTransferFrom(
            address(WETH),
            msg.sender,
            address(this),
            amountInMaximum
        );

        // Approve the router to spend the specifed `amountInMaximum` of DAI.
        // In production, you should choose the maximum amount to spend based on oracles or other data sources to acheive a better swap.
        TransferHelper.safeApprove(
            address(WETH),
            address(swapRouter),
            amountInMaximum
        );

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: address(WETH),
                tokenOut: usdc,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
        amountIn = swapRouter.exactOutputSingle(params);

        // For exact output swaps, the amountInMaximum may not have all been spent.
        // If the actual amount spent (amountIn) is less than the specified maximum amount, we must refund the msg.sender and approve the swapRouter to spend 0.
        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(usdc, address(swapRouter), 0);
            TransferHelper.safeTransfer(
                usdc,
                msg.sender,
                amountInMaximum - amountIn
            );
        }
    }
}
