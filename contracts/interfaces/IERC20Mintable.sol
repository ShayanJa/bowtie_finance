// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20Mintable is IERC20 {
	function mint(address receiver, uint256 amount) external;

	function burn(address receiver, uint256 amount) external;
}
