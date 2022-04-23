//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";

import {IAToken} from "@aave/core-v3/contracts/interfaces/IAToken.sol";
import {IWETHGateway} from "@aave/periphery-v3/contracts/misc/interfaces/IWETHGateway.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract YieldGate {
    address beneficiaryPoolLib;
    address pool;
    address wethgw;
    address token;

    // beneficiary => BeneficiaryPool
    mapping(address => BeneficiaryPool) public beneficiaryPools;

    constructor(address _pool, address wethGateway, address aWETH) {
        console.log(
            "Deploying YieldGate with pool %s, wETHgw %s, token %s",
            _pool,
            wethGateway,
            aWETH
        );
        pool = _pool;
        wethgw = wethGateway;
        token = aWETH;

        beneficiaryPoolLib = address(new BeneficiaryPool());
    }

    function stake(address beneficiary) public payable {
        address bpool = getOrDeployPool(beneficiary);
        BeneficiaryPool(bpool).stake(msg.sender);
    }

    function unstake(address beneficiary) public {
        address bpool = getOrDeployPool(beneficiary);
        BeneficiaryPool(bpool).unstake(payable(msg.sender));
    }

    function getOrDeployPool(address beneficiary) public returns (address) {
        address bpool = address(beneficiaryPools[beneficiary]);
        if (bpool != address(0)) {
            return bpool;
        }
        return deployPool(beneficiary);
    }

    function deployPool(address beneficiary) internal returns (address) {
        BeneficiaryPool bpool = BeneficiaryPool(
            Clones.clone(beneficiaryPoolLib)
        );
        bpool.init(pool, wethgw, token, beneficiary);
        beneficiaryPools[beneficiary] = bpool;
        return address(bpool);
    }

    // earned returns the total earned ether by the provided beneficiary.
    // It is the accrued interest on all staked ether.
    // It can be withdrawn by the beneficiary with claim.
    function earned(address beneficiary) public view returns (uint256) {
        return beneficiaryPools[beneficiary].earned();
    }

    // staked returns the total staked ether on behalf of the beneficiary.
    function staked(address beneficiary) public view returns (uint256) {
        return beneficiaryPools[beneficiary].staked();
    }
}

contract BeneficiaryPool {
    address pool;
    IWETHGateway wethgw;
    IAToken token;
    address beneficiary;

    // supporter => amount
    mapping(address => uint256) public supporters;

    function init(
        address _pool,
        address _wethgw,
        address _token,
        address _beneficiary
    ) public {
        require(beneficiary == address(0), "already initialized");

        console.log(
            "Deploying BeneficiaryPool with pool %s, wETHgw %s for %s",
            _pool,
            _wethgw,
            _beneficiary
        );

        pool = _pool;
        wethgw = IWETHGateway(_wethgw);
        token = IAToken(_token);
        beneficiary = _beneficiary;
    }

    // Stakes the sent ether, registering the caller as a supporter.
    function stake(address supporter) public payable {
        console.log("Staking %s for %s", msg.value, beneficiary);

        supporters[supporter] += msg.value;

        wethgw.depositETH(pool, address(this), 0);
    }

    // Unstakes all previously staked ether by the calling supporter.
    // The beneficiary keeps all generated yield.
    function unstake(address payable supporter) public {
        uint256 sstake = supporters[supporter];
        console.log("Unstaking %s for %s", sstake, beneficiary);
        supporters[supporter] = 0;

        require(token.approve(address(wethgw), sstake), "ethgw approval failed");
        wethgw.withdrawETH(pool, sstake, supporter);
    }

    // claim sends the accrued interest to the beneficiary of this pool. The
    // stake remains at the yield pool and continues generating yield.
    function claim() public view {
        console.log("Claiming for %s", msg.sender);
    }

    // earned returns the total earned ether by the provided beneficiary.
    // It is the accrued interest on all staked ether.
    // It can be withdrawn by the beneficiary with claim.
    function earned() public view returns (uint256) {
        return token.balanceOf(address(this)) - staked();
    }

    // staked returns the total staked ether by this beneficiary pool.
    function staked() public view returns (uint256) {
        return token.scaledBalanceOf(address(this));
    }
}
