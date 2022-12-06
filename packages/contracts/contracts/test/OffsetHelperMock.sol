// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import {IToucanOffsetHelper} from "../deps/Toucan.sol";

/**
 * @title Toucan OffsetHelper mock
 * @author Sebastian Stammler
 * @notice Mocks offsetting by any token by transferring the token to this
 * contract and then emitting a mock Redeemed event.
 * @dev The contract owner can set rates for individual tokens with setRate. If
 * no rate is set, a default rate of 1 will be used.
 * The Redeemed event will have two TCO2 entries, which the TCO2 addresses being
 * the provided pool token address +1 and +2.
 */
contract OffsetHelperMock is IToucanOffsetHelper, Ownable {
    using SafeERC20 for IERC20Metadata;
    using Math for uint256;

    struct Rate {
        uint256 mult;
        uint256 denom;
    }

    mapping(address => Rate) internal rates;

    function setRate(
        address token,
        uint256 rateMult,
        uint256 rateDenom
    ) external onlyOwner {
        rates[token] = Rate({mult: rateMult, denom: rateDenom});
    }

    function autoOffsetExactInToken(
        address _fromToken,
        uint256 _amountToSwap,
        address _poolToken
    ) external returns (address[] memory tco2s, uint256[] memory amounts) {
        IERC20Metadata(_fromToken).safeTransferFrom(msg.sender, address(this), _amountToSwap);
        uint256 amount = calculateExpectedPoolTokenForToken(_fromToken, _amountToSwap, _poolToken);
        (tco2s, amounts) = mockTCO2s(_poolToken, amount);
        emit Redeemed(msg.sender, _poolToken, tco2s, amounts);
    }

    function calculateExpectedPoolTokenForToken(
        address _fromToken,
        uint256 _fromAmount,
        address /* _toToken ignored */
    ) public view returns (uint256) {
        Rate memory rate = rates[_fromToken];
        if (rate.mult == 0) {
            // if no rate set, default rate is 1/1
            return _fromAmount;
        }
        return _fromAmount.mulDiv(rate.mult, rate.denom);
    }

    function mockTCO2s(address tokenBase, uint256 amount)
        internal
        pure
        returns (address[] memory tco2s, uint256[] memory amounts)
    {
        (tco2s, amounts) = (new address[](2), new uint256[](2));
        uint160 base = uint160(tokenBase);
        tco2s[0] = address(base + 1);
        tco2s[1] = address(base + 2);
        uint256 half = amount / 2;
        amounts[0] = half;
        amounts[1] = amount - half;
    }
}
