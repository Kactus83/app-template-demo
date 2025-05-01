/**
 * @module Web3Module
 * @include web3-module.md
 *
 * Ce barrel regroupe les éléments du module "Web3" du domaine Auth.
 * Il gère les fonctionnalités d'authentification par Web3 et l'interaction avec la blockchain.
 */
export * from './web3.module';
export * from './controllers/web3-auth.controller';
export * from './models/dto/web3-account.dto';
export * from './models/dto/web3-wallet-signature.dto';
export * from './repositories/nonce.repository';
export * from './repositories/web3-account.repository';
export * from './services/web3-auth.service';
export * from './services/web3-mfa.service';
export * from './utils/web3-auth.utils';
