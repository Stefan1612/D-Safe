// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//
contract DTweetToken is ERC20, ReentrancyGuard {
    constructor() ERC20("D-Tweet-Token", "DTT") {}
}
