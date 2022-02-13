// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract MockOracle {
	int256 price;
	uint8 public decimals = 8;

	constructor(int256 _price) {
		price = _price;
	}

	function setPrice(int256 _price) public {
		price = _price;
	}

	function latestRoundData()
		external
		view
		returns (
			uint80 roundId,
			int256 answer,
			uint256 startedAt,
			uint256 updatedAt,
			uint80 answeredInRound
		)
	{
		roundId = 0;
		answer = price;
		startedAt = 0;
		updatedAt = 0;
		answeredInRound = 0;
	}
}
