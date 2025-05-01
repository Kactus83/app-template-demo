/**
 * @module TokenModule
 * @include token-module.md
 *
 * Ce barrel regroupe les éléments du module en lien avec le contract "Token" déployé par le conteneur blockchain.
 * Il inclut le module, les contrôleurs, les modèles (DTO) et les services associés.
 */
export * from './token.module';
export * from './controllers/token.controller';
export * from './models/dto/set-max-supply.dto';
export * from './services/token.service';
