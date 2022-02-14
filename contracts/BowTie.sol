// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BowTie is ERC20, Ownable {
    constructor() ERC20("BowTie", "TIE") {}

    function mint(address receiver, uint256 amount) public onlyOwner {
        _mint(receiver, amount);
    }

    function burn(address receiver, uint256 amount) public onlyOwner {
        _burn(receiver, amount);
    }
}
