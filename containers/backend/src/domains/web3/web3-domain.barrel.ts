/**
 * @module Web3Domain
 * @include web3.domain.md
 *
 * Ce barrel regroupe l'ensemble des éléments du domaine "Web3".
 * Il gère l'interaction avec la blockchain, incluant l'authentification,
 * la gestion des contrats intelligents et d'autres opérations spécifiques.
 */
export * from './web3.domain';

// Éléments communs
export * from './common/web3-common-module.barrel';

// Types générés dynamiquement par le conteneur blockchain avant deploiement
export * from './modules/dynamic/dynamic-module.barrel';

// Modules d'interraction avec les contracts déployés
export * from './modules/multivault/multivault-module.barrel';
export * from './modules/nft/nft-module.barrel';
export * from './modules/token/token-module.barrel';
export * from './modules/token-sale/token-sale-module.barrel';
