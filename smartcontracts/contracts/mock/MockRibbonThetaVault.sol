// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MockRibbonThetaVault is ERC20, Ownable {
    using SafeMath for uint256;

    IERC20 public asset;

    mapping(address => uint256) public mockAccountBalance;
    mapping(address => uint256) public withdrawls;

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

    constructor(address _asset) ERC20("ETHVAULT", "ETHV") {
        asset = IERC20(_asset);
    }

    function pricePerShare() external pure returns (uint256) {
        return 1065716367383768781;
    }

    function mint(address receiver, uint256 amount) external onlyOwner {
        _mint(receiver, amount);
    }

    function depositFor(uint256 amount, address creditor) public {
        asset.transferFrom(msg.sender, address(this), amount);
        mockAccountBalance[creditor] += amount;
        depositReceipts[creditor] = DepositReceipt({
            round: uint16(1),
            amount: uint104(amount),
            unredeemedShares: uint128(0)
        });
        mockAccountBalance[creditor] = amount;
    }

    function deposit(uint256 amount) public {
        depositFor(amount, msg.sender);
    }

    function accountVaultBalance(address acct) public view returns (uint256) {
        return 0;
    }

    function initiateWithdraw(uint256 numShares) external {
        require(numShares < mockAccountBalance[msg.sender]);
        withdrawls[msg.sender] += numShares; //TODO: fix up
        mockAccountBalance[msg.sender] -= numShares;
    }

    function completeWithdraw() external {
        asset.transfer(msg.sender, shares(msg.sender)); //TODO: fix up
    }

    function shares(address account) public view returns (uint256) {
        return mockAccountBalance[account];
    }

    function withdrawInstantly(uint256 share) external {
        DepositReceipt storage depositReceipt = depositReceipts[msg.sender];
        uint256 receiptAmount = depositReceipt.amount;

        depositReceipt.amount = uint104(receiptAmount.sub(share));
        asset.transfer(msg.sender, share);
    }

    function vaultState()
        external
        pure
        returns (
            uint16,
            uint104,
            uint104,
            uint128,
            uint128
        )
    {
        return (1, 0, 0, 0, 0);
    }
}
