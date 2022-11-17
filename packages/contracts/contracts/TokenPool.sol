//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ITokenPool} from "./interfaces/ITokenPool.sol";
import {IAavePool, IAavePoolAddressesProvider} from "./deps/Aave.sol";

/**
 * @title Yieldgate Token Pool
 * @author Sebastian Stammler
 * @notice Users can stake any token on the TokenPool while a designated
 * beneficiary can claim any generated yield. Users can unstake their previously
 * staked tokens at any time. Aave is used as a yield generator.
 * @dev Prior to staking a new token, the AavePool has to be approved as a
 * spender of this contract's token once by calling approvePool with the token
 * address. The alternative constructor contract TokenPoolWithApproval can be
 * used to deploy this contract and approve a list of tokens at the same time.
 */
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

    /*
     * @notice Approves the Aave Pool to spend the given token on behalf of this
     * token pool. Trusting the Aave pool implementation, the maximum allowance
     * is set to save on repeated approve calls.
     * @dev Has to be called once before staking a new token, by any user.
     * A new call would be necessary in the unlikely event that the Aave pool
     * proxy address, returned by the PoolAddressesProvider, changes.
     */
    function approvePool(address token) public {
        require(
            IERC20(token).approve(address(aavePool()), type(uint256).max),
            "AavePool approval failed"
        );
    }

    /**
     * @inheritdoc ITokenPool
     * @dev Prio to calling stake, a respective allowance for the token pool has
     * to be set.
     * When staking a token for the first time, the (infinite) ERC20 allowance
     * for the Aave Pool has to be approved first by calling function
     * approvePool (with any user). stake emits a Staked event on success.
     */
    function stake(
        address token,
        address supporter,
        uint256 amount
    ) public virtual {
        require(amount > 0, "zero amount");

        stakes[token][supporter] += amount;
        totalStake[token] += amount;

        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "token transfer failed"
        );
        // For the next step to succeed, approvePool must have been called once before.
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
     * @dev Emits a Claimed event on success. Only callable by the beneficiary.
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
