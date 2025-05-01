// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TokenContract.sol";

contract NFTContract is ERC1155Supply, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => uint256) public maxSupply;
    TokenContract public tokenContract;

    constructor(string memory uri, address _tokenContractAddress) ERC1155(uri) Ownable(msg.sender) {
        tokenContract = TokenContract(_tokenContractAddress);
    }

    function createToken(uint256 _maxSupply, bytes memory data)
        external
        onlyOwner
        returns (uint256)
    {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        maxSupply[tokenId] = _maxSupply;
        emit URI(uri(tokenId), tokenId);
        return tokenId;
    }

    function mint(address to, uint256 tokenId, uint256 amount, bytes memory data)
        external
        onlyOwner
    {
        require(totalSupply(tokenId) + amount <= maxSupply[tokenId], "Exceeds max supply");
        _mint(to, tokenId, amount, data);
    }

    function purchaseToken(uint256 tokenId, uint256 amount, uint256 pricePerToken)
        external
    {
        require(totalSupply(tokenId) + amount <= maxSupply[tokenId], "Exceeds max supply");

        uint256 totalPrice = pricePerToken * amount;
        require(tokenContract.balanceOf(msg.sender) >= totalPrice, "Insufficient balance");
        require(tokenContract.allowance(msg.sender, address(this)) >= totalPrice, "Allowance too low");

        // Transférer les tokens du client vers le propriétaire du contrat
        tokenContract.transferFrom(msg.sender, owner(), totalPrice);

        _mint(msg.sender, tokenId, amount, "");
    }

    // Override supportsInterface
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
