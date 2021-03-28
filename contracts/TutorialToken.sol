// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TutorialToken is ERC20 {
  constructor() public ERC20("TutorialToken", "TT") {
  _setupDecimals(2);
  _mint(msg.sender, 12000);
  }
}
