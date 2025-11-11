// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrippyCoin is ERC20, Ownable {
    uint256 public constant TOTAL_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    
    constructor() ERC20("TrippyCoin", "TRIPPY") Ownable(msg.sender) {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}