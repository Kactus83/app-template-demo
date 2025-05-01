# Contrats Solidity pour la Plateforme

Ce projet comprend plusieurs contrats Solidity utilisés pour la plateforme, notamment pour la gestion de jetons, de NFTs et de gouvernance.

## Contrats

### 1. Auth.sol

**Description :**

Le contrat `Auth` est un contrat d'autorisation simple qui définit une adresse `backendAddress` autorisée à exécuter certaines fonctions protégées.

**Fonctionnalités :**

- Stocke l'adresse du backend autorisé.
- Fournit le modificateur `onlyBackend` pour restreindre l'accès aux fonctions sensibles.
- Permet de mettre à jour l'adresse du backend via `updateBackendAddress`.

---

### 2. GovernanceToken.sol

**Description :**

Le `GovernanceToken` est un jeton ERC20 utilisé pour la gouvernance de la plateforme. Il représente des parts dans la société et est utilisé pour voter sur des propositions.

**Fonctionnalités :**

- Hérite de `ERC20`, `ERC20Burnable`, `ERC20Votes`, et `Auth`.
- A une quantité maximale (`maxSupply`) fixée lors du déploiement.
- Frappe initiale de tous les jetons au `backendAddress`.
- Fonction `distributeTokens` pour distribuer des jetons depuis le backend.
- Implémente les fonctions requises pour gérer l'héritage multiple (`_afterTokenTransfer`, `_mint`, `_burn`, `_update`).

---

### 3. GovernanceContract.sol

**Description :**

Le `GovernanceContract` est le contrat de gouvernance qui permet aux détenteurs du `GovernanceToken` de voter sur des propositions.

**Fonctionnalités :**

- Hérite de `Governor`, `GovernorCountingSimple`, et `GovernorVotes`.
- Définit les paramètres de vote tels que `votingDelay`, `votingPeriod`, et `quorum`.
- Utilise le `GovernanceToken` comme jeton de vote.

---

### 4. TokenContract.sol

**Description :**

Le `TokenContract` est le jeton ERC20 utilisé comme monnaie sur la plateforme.

**Fonctionnalités :**

- Hérite de `ERC20` et `Auth`.
- A une quantité maximale (`maxSupply`) fixée lors du déploiement.
- Frappe initiale de tous les jetons au `backendAddress`.
- Fonction `mint` protégée par `onlyBackend` pour frapper de nouveaux jetons dans la limite du `maxSupply`.

---

### 5. NFTContract.sol

**Description :**

Le `NFTContract` est un contrat ERC1155 qui gère des NFTs multiples, pouvant être uniques ou en éditions multiples.

**Fonctionnalités :**

- Hérite de `ERC1155` et `Auth`.
- Permet de créer de nouveaux types de NFTs avec une quantité maximale via `createToken`.
- Fonction `mint` protégée par `onlyBackend` pour frapper des NFTs.
- Fonction `purchaseToken` pour permettre aux utilisateurs d'acheter des NFTs en utilisant le `TokenContract`.

---

## Dépendances

- **Solidity** ^0.8.27
- **OpenZeppelin Contracts** ^5.0.2
- **Hardhat** ^2.22.12
- **Ethers.js** ^6.13.3
- **TypeScript** ^5.6.2
- **TS-Node** ^10.9.2
- **Dotenv** ^16.4.5

---

## Instructions

### 1. Installation des Dépendances

Assurez-vous d'avoir Node.js et npm installés. Ensuite, installez les dépendances du projet :

```bash
npm install
