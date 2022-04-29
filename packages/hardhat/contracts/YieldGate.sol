//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IWETHGateway} from "./deps/Aave.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract YieldGate {
    event Staked(address indexed beneficiary, address indexed supporter, uint256 amount);
    event Unstaked(address indexed beneficiary, address indexed supporter, uint256 amount);
    event Claimed(address indexed beneficiary, uint256 amount);

    address immutable beneficiaryPoolLib;
    address immutable public pool;
    IWETHGateway immutable public wethgw;
    IERC20 immutable public token;

    // beneficiary => BeneficiaryPool
    mapping(address => BeneficiaryPool) public beneficiaryPools;

    constructor(
        address _pool,
        address wethGateway,
        address aWETH
    ) {
        pool = _pool;
        wethgw = IWETHGateway(wethGateway);
        token = IERC20(aWETH);

        BeneficiaryPool bp = new BeneficiaryPool();
        // init it so no one else can (RIP Parity Multisig)
        bp.init(address(this), msg.sender);
        beneficiaryPoolLib = address(bp);
    }

    function stake(address beneficiary) public payable {
        address bpool = getOrDeployPool(beneficiary);
        uint256 amount = msg.value;
        BeneficiaryPool(bpool).stake{value: amount}(msg.sender);
        emit Staked(beneficiary, msg.sender, amount);
    }

    function unstake(address beneficiary) public {
        address bpool = getOrDeployPool(beneficiary);
        uint256 amount = BeneficiaryPool(bpool).unstake(msg.sender);
        emit Unstaked(beneficiary, msg.sender, amount);
    }

    function claim() public {
        uint256 amount = beneficiaryPools[msg.sender].claim();
        emit Claimed(msg.sender, amount);
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
        bpool.init(address(this), beneficiary);
        beneficiaryPools[beneficiary] = bpool;
        return address(bpool);
    }

    // claimable returns the total earned ether by the provided beneficiary.
    // It is the accrued interest on all staked ether.
    // It can be withdrawn by the beneficiary with claim.
    function claimable(address beneficiary) public view returns (uint256) {
        BeneficiaryPool bpool = beneficiaryPools[beneficiary];
        if (address(bpool) == address(0)) {
            return 0;
        }
        return bpool.claimable();
    }

    // staked returns the total staked ether on behalf of the beneficiary.
    function staked(address beneficiary) public view returns (uint256) {
        BeneficiaryPool bpool = beneficiaryPools[beneficiary];
        if (address(bpool) == address(0)) {
            return 0;
        }
        return bpool.staked();
    }

    function supporterStaked(address supporter, address beneficiary)
        public
        view
        returns (uint256)
    {
        BeneficiaryPool bpool = beneficiaryPools[beneficiary];
        if (address(bpool) == address(0)) {
            return 0;
        }
        return bpool.supporters(supporter);
    }
}

contract BeneficiaryPool {
    YieldGate gate;
    address beneficiary;

    // supporter => amount
    mapping(address => uint256) public supporters;
    // total staked amount
    uint256 internal totalStake;

    modifier onlyGate() {
        require(msg.sender == address(gate), "only YieldGate");
        _;
    }

    function init(
        address _gate,
        address _beneficiary
    ) public {
        require(beneficiary == address(0), "already initialized");

        gate = YieldGate(_gate);
        beneficiary = _beneficiary;
    }

    // Stakes the sent ether, registering the caller as a supporter.
    function stake(address supporter) public payable onlyGate returns (uint256) {
        uint256 amount = msg.value;
        supporters[supporter] += amount;
        totalStake += amount;

        gate.wethgw().depositETH{value: amount}(gate.pool(), address(this), 0);
        return amount;
    }

    // Unstakes all previously staked ether by the calling supporter.
    // The beneficiary keeps all generated yield.
    function unstake(address supporter) public onlyGate returns (uint256) {
        uint256 amount = supporters[supporter];
        supporters[supporter] = 0;
        totalStake -= amount;

        withdraw(amount, supporter);
        return amount;
    }

    // claim sends the accrued interest to the beneficiary of this pool. The
    // stake remains at the yield pool and continues generating yield.
    function claim() public onlyGate returns (uint256) {
        uint256 amount = claimable();
        withdraw(amount, beneficiary);
        return amount;
    }

    function withdraw(uint256 amount, address receiver) internal {
        require(
            gate.token().approve(address(gate.wethgw()), amount),
            "ethgw approval failed"
        );
        gate.wethgw().withdrawETH(gate.pool(), amount, receiver);
    }

    // claimable returns the total earned ether by the provided beneficiary.
    // It is the accrued interest on all staked ether.
    // It can be withdrawn by the beneficiary with claim.
    function claimable() public view returns (uint256) {
        return gate.token().balanceOf(address(this)) - staked();
    }

    // staked returns the total staked ether by this beneficiary pool.
    function staked() public view returns (uint256) {
        return totalStake;
    }
}
