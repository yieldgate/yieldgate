//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract YieldGate {

    mapping(address => uint) stakes;

    constructor() {
        console.log("Deploying YieldGate");
    }

    function stake(address beneficiary) public payable {
        console.log("Staking %s for %s", msg.value, beneficiary);
        stakes[beneficiary] += msg.value;
    }

    function unstake(address beneficiary) public {
        uint value = stakes[beneficiary];
        console.log("Unstaking %s for %s", value, beneficiary);
        stakes[beneficiary] = 0;
    }

    function claim() public view {
        console.log("Claiming for %s", msg.sender);
    }
}
