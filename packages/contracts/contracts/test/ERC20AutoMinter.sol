// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20AutoMinter
 * @author Sebastian Stammler
 * @notice This token automatically mints new token when approvals are set or
 * transfers are made, up to a specified maximum.
 * Anyone can also mint token to themselves using function mintMe or to anyone
 * else using function mint.
 * @dev Only the contract owner can reset the max. mint amount.
 */
abstract contract ERC20AutoMinter is ERC20, Ownable {
    uint256 public maxMint;

    constructor(uint256 _maxMint) {
        maxMint = _maxMint;
    }

    function setMaxMint(uint256 _maxMint) external onlyOwner {
        maxMint = _maxMint;
    }

    // approve auto-mints up to maxMint token to the caller
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        mintMe(amount);
        return ERC20.approve(spender, amount);
    }

    // transfer auto-mints up to maxMint token to the caller
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        mintMe(amount);
        return ERC20.transfer(to, amount);
    }

    // anyone can mint themselves up to maxMint token
    function mintMe(uint256 amount) public returns (uint256) {
        return mint(_msgSender(), amount);
    }

    // anyone can mint anyone else up to maxMint token
    function mint(address account, uint256 amount) public returns (uint256) {
        uint256 mintAmount = maxAmount(amount);
        _mint(account, mintAmount);
        return mintAmount;
    }

    function maxAmount(uint256 amount) internal view returns (uint256) {
        return amount > maxMint ? maxMint : amount;
    }
}

contract SFETestUSD is ERC20AutoMinter {
    constructor(uint256 maxMint)
        ERC20AutoMinter(maxMint)
        ERC20("Stake for Earth Testnet USD", "SFE")
    {} // solhint-disable-line no-empty-blocks

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
