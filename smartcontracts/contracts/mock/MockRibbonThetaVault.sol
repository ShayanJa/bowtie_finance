// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IWETH} from "../interfaces/IWETH.sol";

contract MockRibbonThetaVault is ERC20, Ownable {
    using SafeMath for uint256;

    IERC20 public asset;
    IWETH public immutable WETH;

    mapping(address => uint256) public withdrawls;

    uint16 public round = 1;

    struct DepositReceipt {
        // Maximum of 65535 rounds. Assuming 1 round is 7 days, maximum is 1256 years.
        uint16 round;
        // Deposit amount, max 20,282,409,603,651 or 20 trillion ETH deposit
        uint104 amount;
        // Unredeemed shares balance
        uint128 unredeemedShares;
    }

    struct VaultState {
        // 32 byte slot 1
        //  Current round number. `round` represents the number of `period`s elapsed.
        uint16 round;
        // Amount that is currently locked for selling options
        uint104 lockedAmount;
        // Amount that was locked for selling options in the previous round
        // used for calculating performance fee deduction
        uint104 lastLockedAmount;
        // 32 byte slot 2
        // Stores the total tally of how much of `asset` there is
        // to be used to mint rTHETA tokens
        uint128 totalPending;
        // Amount locked for scheduled withdrawals;
        uint128 queuedWithdrawShares;
    }

    mapping(address => DepositReceipt) public depositReceipts;
    uint104 private unredeemedShares = 0;

    constructor(address _asset, address _weth) ERC20("ETHVAULT", "ETHV") {
        asset = IERC20(_asset);
        WETH = IWETH(_weth);
    }

    function pricePerShare() external pure returns (uint256) {
        return 1000000000000000000;
    }

    function mint(address receiver, uint256 amount) external onlyOwner {
        _mint(receiver, amount);
    }

    function depositFor(uint256 amount, address creditor) public {
        DepositReceipt storage reciept = depositReceipts[creditor];
        reciept.unredeemedShares = reciept.amount;
        reciept.round = round;

        asset.transferFrom(msg.sender, address(this), amount);
        reciept.amount = uint104(amount);
    }

    function deposit(uint256 amount) public {
        depositFor(amount, msg.sender);
    }

    function accountVaultBalance(address acct) public view returns (uint256) {
        DepositReceipt storage reciept = depositReceipts[acct];

        return reciept.unredeemedShares + withdrawls[acct];
    }

    function initiateWithdraw(uint256 numShares) external {
        // Not exactly how it works, there is a redeem function which
        // transfers unreedemedshares to redeemed shares first
        DepositReceipt storage reciept = depositReceipts[msg.sender];
        withdrawls[msg.sender] += numShares; //TODO: fix up

        reciept.unredeemedShares += uint104(reciept.amount);
        require(numShares <= reciept.unredeemedShares, "shares must be less");
        reciept.unredeemedShares -= uint128(numShares);

        reciept.amount = 0;
    }

    function completeWithdraw() external {
        asset.transfer(msg.sender, withdrawls[msg.sender]); //TODO: fix up
        withdrawls[msg.sender] = 0;
    }

    function shares(address account) public view returns (uint256) {
        DepositReceipt memory depositReceipt = depositReceipts[account];

        return depositReceipt.unredeemedShares;
    }

    function withdrawInstantly(uint256 share) external {
        DepositReceipt storage depositReceipt = depositReceipts[msg.sender];
        uint256 receiptAmount = depositReceipt.amount;

        depositReceipt.amount = uint104(receiptAmount.sub(share));
        if (address(asset) == address(WETH)) {
            IWETH(WETH).withdraw(share);
            (bool success, ) = msg.sender.call{value: share}("");
            require(success, "Transfer failed");
            return;
        }
        asset.transfer(msg.sender, share);
    }

    function vaultState()
        external
        view
        returns (
            uint16,
            uint104,
            uint104,
            uint128,
            uint128
        )
    {
        return (round, 0, 0, 0, 0);
    }

    receive() external payable {}
}
