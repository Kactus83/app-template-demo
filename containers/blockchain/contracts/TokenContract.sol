// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenContract
 * @dev ERC20 Token with minting capabilities, ownership control, and max supply management.
 */
contract TokenContract is ERC20, Ownable {
    uint256 public maxSupply;
    uint256 public lastMaxSupplyChanged;

    /**
     * @dev Emitted when `maxSupply` is updated.
     * @param oldMaxSupply The previous maximum supply.
     * @param newMaxSupply The new maximum supply.
     * @param timestamp The timestamp when the max supply was updated.
     */
    event MaxSupplyUpdated(uint256 oldMaxSupply, uint256 newMaxSupply, uint256 timestamp);

    /**
     * @dev Sets the values for {name}, {symbol}, {maxSupply}, and mints the initial supply to `initialHolder`.
     *
     * Requirements:
     *
     * - `initialHolder` cannot be the zero address.
     * - `initialSupply` must not exceed `maxSupply`.
     *
     * @param initialSupply The initial token supply to mint.
     * @param initialHolder The address to receive the initial supply (TokenSale contract).
     */
    constructor(uint256 initialSupply, address initialHolder) ERC20("PlatformToken", "PTKN") Ownable(msg.sender) {
        require(initialHolder != address(0), "Initial holder cannot be zero address");
        maxSupply = initialSupply;
        lastMaxSupplyChanged = block.timestamp;
        _mint(initialHolder, initialSupply); // Mint initial supply to TokenSale
    }

    /**
     * @dev Mints `amount` tokens to `to`.
     *
     * Requirements:
     *
     * - Caller must be the owner.
     * - Total supply after minting must not exceed `maxSupply`.
     *
     * @param to The address to mint tokens to.
     * @param amount The number of tokens to mint.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }

    /**
     * @dev Updates the `maxSupply` to `newMaxSupply`.
     *
     * Requirements:
     *
     * - Caller must be the owner.
     * - `newMaxSupply` must be greater than or equal to the current `totalSupply`.
     *
     * @param newMaxSupply The new maximum supply of tokens.
     */
    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply >= totalSupply(), "New max supply must be >= total supply");
        uint256 oldMaxSupply = maxSupply;
        maxSupply = newMaxSupply;
        lastMaxSupplyChanged = block.timestamp;
        emit MaxSupplyUpdated(oldMaxSupply, newMaxSupply, block.timestamp);
    }

    /**
     * @dev Returns the timestamp when `maxSupply` was last updated.
     *
     * @return The timestamp of the last `maxSupply` update.
     */
    function getLastMaxSupplyChanged() external view returns (uint256) {
        return lastMaxSupplyChanged;
    }
}
