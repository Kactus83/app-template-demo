/**
 * @module TokenSaleModule
 * @include token-sale-module.md
 *
 * Ce barrel regroupe les éléments du module en lien avec le contrat "Token Sale" déployé par le conteneur blockchain.
 * Il inclut le module, les contrôleurs, les modèles (DTO) et les services associés.
 */
export * from './token-sale.module';
export * from './controllers/token-sale.controller';
export * from './models/dto/set-rate.dto';
export * from './models/dto/set-token.dto';
export * from './models/dto/withdraw-ETH.dto';
export * from './models/dto/withdraw-tokens.dto';
export * from './services/token-sale.service';
