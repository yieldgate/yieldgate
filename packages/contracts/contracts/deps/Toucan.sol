// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IToucanOffsetHelper {
    /**
     * @notice Emitted upon successful redemption of TCO2 tokens from a Toucan
     * pool token such as BCT or NCT.
     *
     * @param who The sender of the transaction
     * @param poolToken The address of the Toucan pool token used in the
     * redemption, for example, NCT or BCT
     * @param tco2s An array of the TCO2 addresses that were redeemed
     * @param amounts An array of the amounts of each TCO2 that were redeemed
     */
    event Redeemed(address who, address poolToken, address[] tco2s, uint256[] amounts);

    /**
     * @notice Retire carbon credits using the lowest quality (oldest) TCO2
     * tokens available from the specified Toucan token pool by sending ERC20
     * tokens (USDC, WETH, WMATIC). All provided token is consumed for
     * offsetting.
     *
     * This function:
     * 1. Swaps the ERC20 token sent to the contract for the specified pool token.
     * 2. Redeems the pool token for the poorest quality TCO2 tokens available.
     * 3. Retires the TCO2 tokens.
     *
     * Note: The client must approve the ERC20 token that is sent to the contract.
     *
     * @dev When automatically redeeming pool tokens for the lowest quality
     * TCO2s there are no fees and you receive exactly 1 TCO2 token for 1 pool
     * token.
     *
     * @param _fromToken The address of the ERC20 token that the user sends
     * (must be one of USDC, WETH, WMATIC)
     * @param _amountToSwap The amount of ERC20 token to swap into Toucan pool
     * token. Full amount will be used for offsetting.
     * @param _poolToken The address of the Toucan pool token that the
     * user wants to use, for example, NCT or BCT
     *
     * @return tco2s An array of the TCO2 addresses that were redeemed
     * @return amounts An array of the amounts of each TCO2 that were redeemed
     */
    function autoOffsetExactInToken(
        address _fromToken,
        uint256 _amountToSwap,
        address _poolToken
    ) external returns (address[] memory tco2s, uint256[] memory amounts);
}
