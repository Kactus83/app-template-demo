// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MultiVault
 * @dev Contrat permettant de gérer plusieurs vaults pour stocker des tokens et/ou des ethers.
 */
contract MultiVault is Ownable, ReentrancyGuard {
    using EnumerableSet for EnumerableSet.AddressSet;

    // Types de vaults
    enum VaultType { None, ETH, Token, Both }

    // Structure d'un Vault
    struct Vault {
        string name; // Nom unique du vault
        VaultType vaultType; // Type de vault (ETH, Token, Both)
        EnumerableSet.AddressSet users; // Ensemble des utilisateurs ayant des fonds dans ce vault
    }

    // Mapping des noms de vaults vers leurs structures
    mapping(string => Vault) private vaults;

    // Mapping des noms de vaults vers les soldes en ETH par utilisateur
    mapping(string => mapping(address => uint256)) private ethBalances;

    // Mapping des noms de vaults vers les soldes en Tokens par utilisateur
    mapping(string => mapping(address => uint256)) private tokenBalances;

    // Adresse du contrat de token utilisé (ex : TokenContract)
    IERC20 public token;

    // Événements
    event VaultCreated(string name, VaultType vaultType);
    event VaultDeleted(string name);
    event ETHDeposited(string vaultName, address indexed user, uint256 amount);
    event TokenDeposited(string vaultName, address indexed user, uint256 amount);
    event ETHWithdrawn(string vaultName, address indexed user, uint256 amount);
    event TokenWithdrawn(string vaultName, address indexed user, uint256 amount);

    /**
     * @dev Constructeur pour initialiser l'adresse du contrat de token.
     * @param _token Adresse du contrat ERC20 utilisé pour les dépôts en tokens.
     */
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Token address cannot be zero");
        token = IERC20(_token);
    }

    /**
     * @dev Fonction pour créer un nouveau vault.
     * @param name Nom unique du vault.
     * @param acceptsETH Indique si le vault accepte les ethers.
     * @param acceptsToken Indique si le vault accepte les tokens.
     *
     * Requirements:
     *
     * - Seul le propriétaire peut appeler cette fonction.
     * - Le nom du vault doit être unique.
     * - Le vault doit accepter au moins un type d'actif (ETH ou Token).
     */
    function createVault(string calldata name, bool acceptsETH, bool acceptsToken) external onlyOwner {
        require(bytes(name).length > 0, "Vault name cannot be empty");
        require(vaults[name].vaultType == VaultType.None, "Vault with this name already exists");
        require(acceptsETH || acceptsToken, "Vault must accept ETH or Token");

        VaultType vt;
        if (acceptsETH && acceptsToken) {
            vt = VaultType.Both;
        } else if (acceptsETH) {
            vt = VaultType.ETH;
        } else {
            vt = VaultType.Token;
        }

        Vault storage vault = vaults[name];
        vault.name = name;
        vault.vaultType = vt;

        emit VaultCreated(name, vt);
    }

    /**
     * @dev Fonction pour supprimer un vault et renvoyer les fonds aux utilisateurs.
     * @param name Nom du vault à supprimer.
     *
     * Requirements:
     *
     * - Seul le propriétaire peut appeler cette fonction.
     * - Le vault doit exister.
     */
    function deleteVault(string calldata name) external onlyOwner nonReentrant {
        Vault storage vault = vaults[name];
        require(vault.vaultType != VaultType.None, "Vault does not exist");

        // Itération sur tous les utilisateurs pour renvoyer leurs fonds
        uint256 userCount = vault.users.length();
        for (uint256 i = 0; i < userCount; i++) {
            address user = vault.users.at(i);

            // Remboursement des ethers si le vault les accepte
            if (vault.vaultType == VaultType.ETH || vault.vaultType == VaultType.Both) {
                uint256 ethAmount = ethBalances[name][user];
                if (ethAmount > 0) {
                    ethBalances[name][user] = 0;
                    (bool sent, ) = user.call{value: ethAmount}("");
                    require(sent, "Failed to send ETH");
                    emit ETHWithdrawn(name, user, ethAmount);
                }
            }

            // Remboursement des tokens si le vault les accepte
            if (vault.vaultType == VaultType.Token || vault.vaultType == VaultType.Both) {
                uint256 tokenAmount = tokenBalances[name][user];
                if (tokenAmount > 0) {
                    tokenBalances[name][user] = 0;
                    bool sent = token.transfer(user, tokenAmount);
                    require(sent, "Token transfer failed");
                    emit TokenWithdrawn(name, user, tokenAmount);
                }
            }

            // Supprimer l'utilisateur de l'ensemble du vault
            vault.users.remove(user);
        }

        // Supprimer le vault
        delete vaults[name];
        emit VaultDeleted(name);
    }

    /**
     * @dev Fonction pour déposer des ethers dans un vault.
     * @param name Nom du vault dans lequel déposer les ethers.
     *
     * Requirements:
     *
     * - Le vault doit exister et accepter les ethers.
     * - L'utilisateur doit envoyer un montant d'ethers supérieur à zéro.
     */
    function depositETH(string calldata name) external payable nonReentrant {
        Vault storage vault = vaults[name];
        require(vault.vaultType == VaultType.ETH || vault.vaultType == VaultType.Both, "Vault does not accept ETH");
        require(msg.value > 0, "Must send ETH to deposit");

        ethBalances[name][msg.sender] += msg.value;
        vault.users.add(msg.sender);

        emit ETHDeposited(name, msg.sender, msg.value);
    }

    /**
     * @dev Fonction pour déposer des tokens dans un vault.
     * @param name Nom du vault dans lequel déposer les tokens.
     * @param amount Montant de tokens à déposer.
     *
     * Requirements:
     *
     * - Le vault doit exister et accepter les tokens.
     * - L'utilisateur doit approuver le contrat pour le montant de tokens à déposer.
     * - L'utilisateur doit déposer un montant de tokens supérieur à zéro.
     */
    function depositToken(string calldata name, uint256 amount) external nonReentrant {
        Vault storage vault = vaults[name];
        require(vault.vaultType == VaultType.Token || vault.vaultType == VaultType.Both, "Vault does not accept Token");
        require(amount > 0, "Must deposit a positive amount");

        // Transférer les tokens de l'utilisateur vers le contrat
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        tokenBalances[name][msg.sender] += amount;
        vault.users.add(msg.sender);

        emit TokenDeposited(name, msg.sender, amount);
    }

    /**
     * @dev Fonction pour retirer des ethers d'un vault.
     * @param name Nom du vault depuis lequel retirer les ethers.
     * @param amount Montant d'ethers à retirer.
     *
     * Requirements:
     *
     * - Le vault doit exister et accepter les ethers.
     * - L'utilisateur doit avoir un solde en ethers suffisant dans le vault.
     */
    function withdrawETH(string calldata name, uint256 amount) external nonReentrant {
        Vault storage vault = vaults[name];
        require(vault.vaultType == VaultType.ETH || vault.vaultType == VaultType.Both, "Vault does not accept ETH");
        require(ethBalances[name][msg.sender] >= amount, "Insufficient ETH balance");

        ethBalances[name][msg.sender] -= amount;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send ETH");

        emit ETHWithdrawn(name, msg.sender, amount);
    }

    /**
     * @dev Fonction pour retirer des tokens d'un vault.
     * @param name Nom du vault depuis lequel retirer les tokens.
     * @param amount Montant de tokens à retirer.
     *
     * Requirements:
     *
     * - Le vault doit exister et accepter les tokens.
     * - L'utilisateur doit avoir un solde en tokens suffisant dans le vault.
     */
    function withdrawToken(string calldata name, uint256 amount) external nonReentrant {
        Vault storage vault = vaults[name];
        require(vault.vaultType == VaultType.Token || vault.vaultType == VaultType.Both, "Vault does not accept Token");
        require(tokenBalances[name][msg.sender] >= amount, "Insufficient Token balance");

        tokenBalances[name][msg.sender] -= amount;

        bool success = token.transfer(msg.sender, amount);
        require(success, "Token transfer failed");

        emit TokenWithdrawn(name, msg.sender, amount);
    }

    /**
     * @dev Fonction pour obtenir le type d'un vault.
     * @param name Nom du vault.
     * @return Type du vault (ETH, Token, Both).
     */
    function getVaultType(string calldata name) external view returns (VaultType) {
        return vaults[name].vaultType;
    }

    /**
     * @dev Fonction pour obtenir le solde en ethers d'un utilisateur dans un vault.
     * @param name Nom du vault.
     * @param user Adresse de l'utilisateur.
     * @return Solde en ethers.
     */
    function getETHBalance(string calldata name, address user) external view returns (uint256) {
        return ethBalances[name][user];
    }

    /**
     * @dev Fonction pour obtenir le solde en tokens d'un utilisateur dans un vault.
     * @param name Nom du vault.
     * @param user Adresse de l'utilisateur.
     * @return Solde en tokens.
     */
    function getTokenBalance(string calldata name, address user) external view returns (uint256) {
        return tokenBalances[name][user];
    }

    /**
     * @dev Fonction pour obtenir la liste des utilisateurs dans un vault.
     * @param name Nom du vault.
     * @return Tableau des adresses des utilisateurs.
     */
    function getUsersInVault(string calldata name) external view returns (address[] memory) {
        Vault storage vault = vaults[name];
        uint256 length = vault.users.length();
        address[] memory users = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            users[i] = vault.users.at(i);
        }
        return users;
    }
    
    // Recevoir des ethers directement dans le contrat (optionnel)
    receive() external payable {
        revert("Use depositETH function to deposit ETH");
    }
}
