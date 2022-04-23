//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";

import {IAToken} from "@aave/core-v3/contracts/interfaces/IAToken.sol";
import {IWETHGateway} from "@aave/periphery-v3/contracts/misc/interfaces/IWETHGateway.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract YieldGate {

    address beneficiaryPoolLib;
    address pool;
    address token;

    // beneficiary => BeneficiaryPool
    mapping(address => BeneficiaryPool) public beneficiaryPools;

    constructor(address wethGateway, address aWETH) {
        console.log("Deploying YieldGate with pool %s and token %s", wethGateway, aWETH);
        pool = wethGateway;
        token = aWETH;

        beneficiaryPoolLib = address(new BeneficiaryPool());
    }

    function getOrDeployPool(address beneficiary) public returns (address) {
        address bpool = address(beneficiaryPools[beneficiary]);
        if (bpool != address(0)) {
            return bpool;
        }
        return deployPool(beneficiary);
    }

    function deployPool(address beneficiary) internal returns (address) {
        BeneficiaryPool bpool = BeneficiaryPool(Clones.clone(beneficiaryPoolLib));
        bpool.init(pool, token, beneficiary);
        beneficiaryPools[beneficiary] = bpool;
        return address(bpool);
    }

    // earned returns the total earned ether by the provided beneficiary.
    // It is the accrued interest on all staked ether.
    // It can be withdrawn by the beneficiary with claim.
    function earned(address beneficiary) public view returns (uint) {
        return beneficiaryPools[beneficiary].earned();
    }

    // staked returns the total staked ether on behalf of the beneficiary.
    function staked(address beneficiary) public view returns (uint) {
        return beneficiaryPools[beneficiary].staked();
    }
}

contract BeneficiaryPool {
    IWETHGateway pool;
    IAToken token;
    address beneficiary;

    // supporter => amount
    mapping(address => uint) public supporters;

    function init(address _pool, address _token, address _beneficiary) public {
        require(beneficiary == address(0), "already initialized");

        console.log("Deploying BeneficiaryPool with pool %s and token %s for %s",
                    _pool, _token, _beneficiary);

        pool = IWETHGateway(_pool);
        token = IAToken(_token);
        beneficiary = _beneficiary;
    }

    // Stakes the sent ether, registering the caller as a supporter.
    function stake() public payable {
        console.log("Staking %s for %s", msg.value, beneficiary);

        supporters[msg.sender] += msg.value;
    }

    // Unstakes all previously staked ether by the calling supporter.
    // The beneficiary keeps all generated yield.
    function unstake() public {
        uint sstake = supporters[msg.sender];
        console.log("Unstaking %s for %s", sstake, beneficiary);
        supporters[msg.sender] = 0;
        // TODO:
        // * withdraw base stake from pool to caller
    }

    // claim sends the accrued interest to the beneficiary of this pool. The
    // stake remains at the yield pool and continues generating yield.
    function claim() public view {
        console.log("Claiming for %s", msg.sender);
    }

    // earned returns the total earned ether by the provided beneficiary.
    // It is the accrued interest on all staked ether.
    // It can be withdrawn by the beneficiary with claim.
    function earned() public view returns (uint) {
        uint c = 0; // TODO: read from aToken
        console.log("Earned by %s: %s", beneficiary, c);
        return c;
    }

    // staked returns the total staked ether by this pool.
    function staked() public view returns (uint) {
        uint s = 0; // TODO: read from aToken
        console.log("Total staked for %s: %s", beneficiary, s);
        return s;
    }
}
