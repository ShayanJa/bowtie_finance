// Modified from https://docs.synthetix.io/contracts/source/contracts/rewardsdistributionrecipient
pragma solidity ^0.8.0;

// Inheritance
import {Owned} from "./Owned.sol";

abstract contract RewardsDistributionRecipient is Owned {
    address public rewardsDistribution;

    modifier onlyRewardsDistribution() {
        require(msg.sender == rewardsDistribution, "Caller is not RewardsDistribution contract");
        _;
    }

    function setRewardsDistribution(address _rewardsDistribution) external onlyOwner {
        rewardsDistribution = _rewardsDistribution;
    }
}