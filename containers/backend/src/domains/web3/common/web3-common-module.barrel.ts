/**
 * @module Web3CommonModule
 * @include web3-common.module.md
 *
 * Ce barrel regroupe les éléments communs du domaine "Web3" servant à gérer l'interaction avec la blockchain,
 * en dehors des modules dynamiques. Il inclut le module commun, ses contrôleurs, répertoires et services associés.
 */
export * from './web3-common.module';
export * from './controllers/contract.controller';
export * from './repositories/contract.repository';
export * from './repositories/web3-user.repository';
export * from './services/contract.service';
export * from './services/web3.service';
