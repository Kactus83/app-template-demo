// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSale is Ownable {
    IERC20 public token;
    uint256 public rate; // Nombre de tokens par ETH

    event TokensPurchased(address indexed buyer, uint256 amountOfETH, uint256 amountOfTokens);

    constructor(uint256 _rate) Ownable(msg.sender) {
        require(_rate > 0, "Rate must be greater than zero");
        rate = _rate;
    }

    // Fonction pour définir l'adresse du contrat TokenContract, callable uniquement par le propriétaire
    function setToken(address _token) external onlyOwner {
        require(address(token) == address(0), "Token already set");
        require(_token != address(0), "Token address cannot be zero");
        token = IERC20(_token);
    }

    // Fonction payable pour acheter des tokens
    receive() external payable {
        buyTokens();
    }

    function buyTokens() public payable {
        require(address(token) != address(0), "Token not set");
        uint256 ethAmount = msg.value;
        uint256 tokenAmount = ethAmount * rate;

        require(token.balanceOf(address(this)) >= tokenAmount, "Not enough tokens in the reserve");

        // Transférer les tokens à l'acheteur
        bool sent = token.transfer(msg.sender, tokenAmount);
        require(sent, "Token transfer failed");

        emit TokensPurchased(msg.sender, ethAmount, tokenAmount);
    }

    // Fonction pour retirer les fonds ETH collectés
    function withdrawETH(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Not enough ETH balance");
        (bool sent, ) = owner().call{value: amount}("");
        require(sent, "Failed to withdraw ETH");
    }

    // Fonction pour ajuster le taux de vente
    function setRate(uint256 _rate) external onlyOwner {
        require(_rate > 0, "Rate must be greater than zero");
        rate = _rate;
    }

    // Fonction pour retirer les tokens en réserve
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(address(token) != address(0), "Token not set");
        require(token.balanceOf(address(this)) >= amount, "Not enough tokens to withdraw");
        bool sent = token.transfer(owner(), amount);
        require(sent, "Token transfer failed");
    }
}
