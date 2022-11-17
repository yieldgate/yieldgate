//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/**
 * @title Yieldgate Token Pool Interface
 * @author Sebastian Stammler <seb@yieldgate.xyz>
 */
interface ITokenPool {
    /**
     * @notice Staked is emitted on every successful stake.
     * @param token Address of staked ERC20 token.
     * @param supporter Addrses of staker.
     * @param amount Amount that got staked.
     */
    event Staked(address indexed token, address indexed supporter, uint256 amount);

    /**
     * @notice Unstaked is cool
     * @param token Address of unstaked ERC20 token.
     * @param supporter Addrses of unstaker.
     * @param amount Amount that got unstaked.
     */
    event Unstaked(address indexed token, address indexed supporter, uint256 amount);

    /**
     * @notice Claimed is emitted on every successful claim.
     * @param token Address of claimed ERC20 token.
     * @param amount Amount that got claimed.
     */
    event Claimed(address indexed token, uint256 amount);

    /**
     * @notice Stakes given amount of token on behalf of the provided supporter.
     * @dev Prio to calling stake, a respective allowance for the token pool has
     *   to be set. On success, the implementation must emit a Staked event.
     * @param token Address of ERC20 token to stake.
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
     * @param token Address of ERC20 token to unstake.
     * @return Returns the unstaked amount.
     */
    function unstake(address token) external returns (uint256);

    /**
     * @notice Sends the accrued yield to the beneficiary of this pool.
     * @dev The implementation should enforce some access control to this
     *   function, e.g., only let it be callable by the beneficiary. It must
     *   emit a Claimed event on success.
     * @param token Address of ERC20 token to claim.
     * @return Returns the claimed amount of yield.
     */
    function claim(address token) external returns (uint256);

    /**
     * @notice Queries the claimable yield for the given ERC20 token.
     * @param token Address of ERC20 token to query.
     * @return Returns the claimable yield.
     */
    function claimable(address token) external view returns (uint256);

    /**
     * @notice Queries the total staked amount for the given ERC20 token.
     * @param token Address of ERC20 token to query.
     * @return Returns the total staked amount.
     */
    function staked(address token) external view returns (uint256);
}
