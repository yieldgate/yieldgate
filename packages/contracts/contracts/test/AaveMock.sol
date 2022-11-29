// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import {IAavePoolAddressesProvider, IAavePool, AaveDataTypes} from "../deps/Aave.sol";

/**
 * @title AavePool and aToken mock for testnets
 * @author Sebastian Stammler
 * @notice AaveMock mocks the Aave Pool, PoolAddressesProvider and also is the
 * aToken for a single external ERC20 reference token.
 * @dev Reference token deposited into this contract with function `supply`
 * yields an emulated linear return until a specified doubling time, from which
 * point on it stays the same until another action changes the token balance
 * again, either in- or decreasing it.
 * The AaveMock is also the aToken of the reference token.
 */
contract AaveMock is IAavePool, IAavePoolAddressesProvider, ERC20, Ownable {
    using SafeERC20 for IERC20Metadata;
    using Math for uint256;

    IERC20Metadata public immutable rToken;
    uint256 public doublingDuration;

    mapping(address => uint256) private lastBalanceUpdate; // account -> timestamp

    modifier onlyRToken(address token) {
        require(token == address(rToken), "only rToken allowed");
        _;
    }

    constructor(address _rToken, uint256 _doublingDuration)
        ERC20("Stake for Earth Testnet aToken", "aSFE")
    {
        rToken = IERC20Metadata(_rToken);
        doublingDuration = _doublingDuration;
    }

    function decimals() public view override returns (uint8) {
        return rToken.decimals();
    }

    function getPool() external view returns (address) {
        return address(this);
    }

    function setDoublingDuration(uint256 _doublingDuration) external onlyOwner {
        doublingDuration = _doublingDuration;
    }

    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 /* referralCode */
    ) external onlyRToken(asset) {
        rToken.safeTransferFrom(msg.sender, address(this), amount);
        updateBalance(onBehalfOf);
        _mint(onBehalfOf, amount);
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external onlyRToken(asset) returns (uint256) {
        address account = msg.sender;
        if (amount == type(uint256).max) {
            amount = balanceOf(account);
        }
        updateBalance(account);
        _burn(account, amount);
        // TODO: only works if target token is minted after balance update
        rToken.safeTransfer(to, amount);
        return amount;
    }

    function updateBalance(address account) internal {
        uint256 balance = ERC20.balanceOf(account);
        lastBalanceUpdate[account] = block.timestamp;
        if (balance == 0) return; // initial update

        uint256 newBalance = balanceOf(account);
        _mint(account, newBalance - balance);
    }

    // Let balanceOf peek into the future, so that claimable() works
    function balanceOf(address account) public view virtual override returns (uint256) {
        uint256 lastUpdate = lastBalanceUpdate[account];
        uint256 balance = ERC20.balanceOf(account);
        uint256 diff = block.timestamp - lastUpdate;
        if (lastUpdate == 0 || balance == 0 || diff == 0) return balance;

        if (diff > doublingDuration) {
            diff = doublingDuration;
        }

        return balance.mulDiv(doublingDuration + diff, doublingDuration);
    }

    function getReserveData(address asset)
        external
        view
        onlyRToken(asset)
        returns (AaveDataTypes.ReserveData memory data)
    {
        data.aTokenAddress = address(this);
        return data;
    }
}
