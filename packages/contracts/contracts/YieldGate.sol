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

    function supporterStaked(address supporter, address beneficiary) public view returns (uint256) {
        BeneficiaryPool bpool = beneficiaryPools[beneficiary];
        if (address(bpool) == address(0)) {
            return 0;
        }
        return bpool.supporters(supporter);
    }
}

contract BeneficiaryPool {
    event Staked(address indexed beneficiary, address indexed supporter, uint256 amount);
    event Unstaked(address indexed beneficiary, address indexed supporter, uint256 amount);
    event Claimed(address indexed beneficiary, uint256 amount);

    YieldGate public gate;
    address public beneficiary;

    // supporter => amount
    mapping(address => uint256) public supporters;
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
    }

    // Stakes the sent ether on behalf of the provided supporter. The supporter
    // is usually msg.sender if staking on the transaction sender's behalf.
    function stake(address supporter) public payable {
        uint256 amount = msg.value;
        supporters[supporter] += amount;
        totalStake += amount;

        gate.wethgw().depositETH{value: amount}(gate.aavePool(), address(this), 0);
        emit Staked(beneficiary, supporter, amount);
    }

    // Unstakes all previously staked ether by the calling supporter.
    // The beneficiary keeps all generated yield.
    function unstake() public returns (uint256) {
        address supporter = msg.sender;
        uint256 amount = supporters[supporter];
        require(amount > 0, "no supporter");

        supporters[supporter] = 0;
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
}
