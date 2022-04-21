pragma solidity =0.8.4;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Work in progress, not ready for use

abstract contract Governance {
    uint256 public DISCOUNTED_DEBT_FEE = 500;
    uint256 public LP_PERCENT = 0;
    uint256 public INSURANCE_PERCENT = 10000;

    function set_DISCOUNTED_DEBT_FEE(uint256 _fee) public {
        DISCOUNTED_DEBT_FEE = _fee;
    }

    function set_LP_PERCENT(uint256 _fee) public {
        DISCOUNTED_DEBT_FEE = _fee;
    }

    function set_INSURANCE_PERCENT(uint256 _fee) public {
        INSURANCE_PERCENT = _fee;
    }
}
