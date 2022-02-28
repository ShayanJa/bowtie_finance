// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockRibbonThetaVault is ERC20, Ownable {
    IERC20 public asset;
    
    mapping(address => uint256) public mockAccountBalance;
    
    struct DepositReceipt {
        // Maximum of 65535 rounds. Assuming 1 round is 7 days, maximum is 1256 years.
        uint16 round;
        // Deposit amount, max 20,282,409,603,651 or 20 trillion ETH deposit
        uint104 amount;
        // Unredeemed shares balance
        uint128 unredeemedShares;
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
    }
    function deposit(uint256 amount) public {
        depositFor(amount, msg.sender);
    }
    
    function accountVaultBalance(address) external view returns (uint256) {
        return mockAccountBalance[msg.sender];
    }
    
    
}
