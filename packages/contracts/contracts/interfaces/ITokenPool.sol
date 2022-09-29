//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/**
 * @title Yieldgate Token Pool Interface
 * @author Sebastian Stammler <seb@yieldgate.xyz>
 */
interface ITokenPool {
    event Staked(address indexed token, address indexed supporter, uint256 amount);
    event Unstaked(address indexed token, address indexed supporter, uint256 amount);
    event Claimed(address indexed token, uint256 amount);

    /**
     * @notice Stakes given amount of token on behalf of the provided supporter.
     * @dev Prio to calling stake, a respective allowance for the token pool has
     *   to be set. On success, the implementation must emit a Staked event.
     * @param token The ERC20 token to stake.
     * @param supporter The supporter on whose behalf the token is staked.
     * @param amount The amount of token to stake.
     */
    function stake(
        address token,
        address supporter,
        uint256 amount
    ) external;

    /**
     * @notice Unstakes all previously staked token by the calling supporter.
     *   The beneficiary keeps all generated yield.
     * @dev On success, the implementation must emit an Unstaked event.
     * @param token The ERC20 token to stake.
     * @return Returns the unstaked amount.
     */
    function unstake(address token) external returns (uint256);

    /**
     * @notice Sends the accrued yield to the beneficiary of this pool.
     * @dev The implementation should enforce some access control to this
     *   function, e.g., only let it be callable by the beneficiary. It must
     *   emit a Claimed event on success.
     */
    function claim(address token) external returns (uint256);
}
