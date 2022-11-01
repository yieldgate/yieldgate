//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ITokenPool} from "./interfaces/ITokenPool.sol";
import {IAavePool, IAavePoolAddressesProvider} from "./deps/Aave.sol";

contract TokenPool is ITokenPool {
    /*
     * @notice Provider of AAVE protocol contract instance addresses. This
     *   address is fixed for a particular market.
     * @dev Since the actual AAVE Pool address is subject to change, AAVE
     *   advices to always read the pool address from the PoolAddressesProvider.
     */
    IAavePoolAddressesProvider public immutable aavePoolAddressesProvider;

    /*
     * @notice address of beneficiary that can claim generated yield.
     */
    address public immutable beneficiary;

    /*
     * @notice Amount staked by token and by user.
     * @dev Mapping format is token address -> user -> amount.
     */
    mapping(address => mapping(address => uint256)) public stakes;

    // Total stake, by token address.
    mapping(address => uint256) internal totalStake;

    modifier onlyBeneficiary() {
        require(msg.sender == beneficiary, "only beneficiary");
        _;
    }

    constructor(address _aavePoolAddressesProvider, address _beneficiary) {
        aavePoolAddressesProvider = IAavePoolAddressesProvider(_aavePoolAddressesProvider);
        beneficiary = _beneficiary;
    }

    /// @inheritdoc ITokenPool
    function stake(
        address token,
        address supporter,
        uint256 amount
    ) public virtual {
        require(amount > 0, "zero amount");

        stakes[token][supporter] += amount;
        totalStake[token] += amount;

        aavePool().supply(token, amount, address(this), 0);

        emit Staked(token, supporter, amount);
    }

    /// @inheritdoc ITokenPool
    function unstake(address token) public virtual returns (uint256) {
        address supporter = msg.sender;
        uint256 amount = stakes[token][supporter];
        require(amount > 0, "no supporter");

        stakes[token][supporter] = 0;
        totalStake[token] -= amount;

        withdraw(token, amount, supporter);

        emit Unstaked(token, supporter, amount);
        return amount;
    }

    /**
     * @inheritdoc ITokenPool
     * @dev Emits a Claimed event on success.
     */
    function claim(address token) public virtual onlyBeneficiary returns (uint256) {
        uint256 amount = claimable(token);
        withdraw(token, amount, beneficiary);

        emit Claimed(token, amount);
        return amount;
    }

    function withdraw(
        address token,
        uint256 amount,
        address receiver
    ) internal {
        aavePool().withdraw(token, amount, receiver);
    }

    /// @inheritdoc ITokenPool
    function claimable(address token) public view returns (uint256) {
        IERC20 aToken = IERC20(aavePool().getReserveData(token).aTokenAddress);
        return aToken.balanceOf(address(this)) - staked(token);
    }

    /// @inheritdoc ITokenPool
    function staked(address token) public view returns (uint256) {
        return totalStake[token];
    }

    function aavePool() internal view returns (IAavePool) {
        return IAavePool(aavePoolAddressesProvider.getPool());
    }
}
