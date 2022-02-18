// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockRibbonThetaVault is ERC20, Ownable {
    IERC20 public asset;
    
    uint256 private mockAccountBalance = 0;
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
    function deposit(uint256 amount) external {
        asset.transferFrom(msg.sender, address(this), amount);
        mockAccountBalance += amount;
    }
    function accountValueBalance(address) external view returns (uint256) {
        return mockAccountBalance;
    }
    
    function depositReceipts(address) external view returns (uint16, uint104, uint128) {
        return (1, uint104(unredeemedShares), uint128(mockAccountBalance));
    }
}
