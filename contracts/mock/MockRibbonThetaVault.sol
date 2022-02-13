// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockRibbonThetaVault is ERC20, Ownable {
	constructor() ERC20("ETHVAULT", "ETHV") {}

	function pricePerShare() external view returns (uint256) {
		return 1065716367383768781;
	}

	function mint(address receiver, uint256 amount) external onlyOwner {
		_mint(receiver, amount);
	}
}
