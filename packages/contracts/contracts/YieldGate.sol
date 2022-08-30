//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IWETHGateway} from "./deps/Aave.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract YieldGate {
    event PoolDeployed(address indexed beneficiary, address indexed deployer, address pool);

    address private immutable beneficiaryPoolLib;
    address public immutable aavePool;
    IWETHGateway public immutable wethgw;
    IERC20 public immutable token;

    // beneficiary => BeneficiaryPool
    mapping(address => BeneficiaryPool) public beneficiaryPools;

    constructor(
        address _pool,
        address wethGateway,
        address aWETH
    ) {
        aavePool = _pool;
        wethgw = IWETHGateway(wethGateway);
        token = IERC20(aWETH);

        BeneficiaryPool bp = new BeneficiaryPool();
        // init it so no one else can (RIP Parity Multisig)
        bp.init(address(this), msg.sender);
        beneficiaryPoolLib = address(bp);
    }

    function deployPool(address beneficiary) external returns (address) {
        BeneficiaryPool bpool = BeneficiaryPool(Clones.clone(beneficiaryPoolLib));
        bpool.init(address(this), beneficiary);
        beneficiaryPools[beneficiary] = bpool;

        emit PoolDeployed(beneficiary, msg.sender, address(bpool));
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

    // returns the total staked ether by the supporter and the timeout until
    // which the stake is locked.
    function supporterStaked(address supporter, address beneficiary)
        public
        view
        returns (uint256, uint256)
    {
        BeneficiaryPool bpool = beneficiaryPools[beneficiary];
        if (address(bpool) == address(0)) {
            return (0, 0);
        }
        return (bpool.stakes(supporter), bpool.lockTimeout(supporter));
    }
}

contract BeneficiaryPool {
    event Staked(
        address indexed beneficiary,
        address indexed supporter,
        uint256 amount,
        uint256 lockTimeout
    );
    event Unstaked(address indexed beneficiary, address indexed supporter, uint256 amount);
    event Claimed(address indexed beneficiary, uint256 amount);
    event ParametersChanged(address indexed beneficiary, uint256 minAmount, uint256 minDuration);

    YieldGate public gate;
    address public beneficiary;

    // Minimum required amount to stake.
    uint256 public minAmount;
    // Minimum required staking duration (in seconds).
    uint256 public minDuration;
    // Records when a supporter is allowed to unstake again. This has the added
    // benefit that future changes to the duration do not affect current stakes.
    mapping(address => uint256) internal lockTimeouts;

    // supporter => amount
    mapping(address => uint256) public stakes;
    // total staked amount
    uint256 internal totalStake;

    modifier onlyBeneficiary() {
        require(msg.sender == beneficiary, "only beneficiary");
        _;
    }

    // Initializes this contract's parameters after deployment. This is called
    // by the pool factory, i.e. the Yieldgate main contract, right after
    // deployment. Can only be called once.
    function init(address _gate, address _beneficiary) public {
        require(address(gate) == address(0), "already initialized");

        gate = YieldGate(_gate);
        beneficiary = _beneficiary;

        emitParametersChanged(0, 0);
    }

    // To save gas, add individual parameter setters.

    function setMinAmount(uint256 _minAmount) external onlyBeneficiary {
        minAmount = _minAmount;
        emitParametersChanged(_minAmount, minDuration);
    }

    function setMinDuration(uint256 _minDuration) external onlyBeneficiary {
        minDuration = _minDuration;
        emitParametersChanged(minAmount, _minDuration);
    }

    function setParameters(uint256 _minAmount, uint256 _minDuration) external onlyBeneficiary {
        minAmount = _minAmount;
        minDuration = _minDuration;
        emitParametersChanged(_minAmount, _minDuration);
    }

    function emitParametersChanged(uint256 _minAmount, uint256 _minDuration) internal {
        emit ParametersChanged(beneficiary, _minAmount, _minDuration);
    }

    // Stakes the sent ether on behalf of the provided supporter. The supporter
    // is usually msg.sender if staking on the transaction sender's behalf.
    // The staking timeout is reset on each call, so prior stake is re-locked.
    function stake(address supporter) public payable {
        uint256 amount = msg.value;
        require(amount > 0 && stakes[supporter] + amount >= minAmount, "amount too low");

        stakes[supporter] += amount;
        totalStake += amount;
        uint256 timeout = 0;
        if (minDuration > 0) {
            timeout = block.timestamp + minDuration;
        }
        lockTimeouts[supporter] = timeout;

        gate.wethgw().depositETH{value: amount}(gate.aavePool(), address(this), 0);
        emit Staked(beneficiary, supporter, amount, timeout);
    }

    // Unstakes all previously staked ether by the calling supporter.
    // The beneficiary keeps all generated yield.
    // If a minimum staking duration was set by the beneficiary at the time of
    // staking, it is checked that the timeout has elapsed.
    function unstake() public returns (uint256) {
        address supporter = msg.sender;
        require(block.timestamp >= lockTimeout(supporter), "stake still locked");

        uint256 amount = stakes[supporter];
        require(amount > 0, "no supporter");

        stakes[supporter] = 0;
        totalStake -= amount;

        withdraw(amount, supporter);
        emit Unstaked(beneficiary, supporter, amount);
        return amount;
    }

    // claim sends the accrued interest to the beneficiary of this pool. Staked
    // ether remains at the yield pool and continues generating yield.
    function claim() public onlyBeneficiary returns (uint256) {
        uint256 amount = claimable();
        withdraw(amount, beneficiary);
        emit Claimed(beneficiary, amount);
        return amount;
    }

    function withdraw(uint256 amount, address receiver) internal {
        require(gate.token().approve(address(gate.wethgw()), amount), "ethgw approval failed");
        gate.wethgw().withdrawETH(gate.aavePool(), amount, receiver);
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

    // lockTimeout returns the effective timeout until when a supporter's stake
    // is locked. If the minDuration is 0 it is always 0, possibly disregarding
    // an old lock from prior staking when minDuration was > 0.
    function lockTimeout(address supporter) public view returns (uint256) {
        // Set timeout to 0 if minDuration == 0 because a supporter could then
        // trivially reset their lock timeout by staking and then immediately
        // unstaking anyways.
        if (minDuration == 0) {
            return 0;
        }
        return lockTimeouts[supporter];
    }
}
