/**
 * @module MultivaultModule
 * @include multivault-module.md
 *
 * Ce barrel regroupe les éléments du module en lien avec le contrat "Multivault" déployé par le conteneur blockchain.
 * Il inclut le module, les contrôleurs, les modèles (DTO) et les services associés.
 */
export * from './multivault.module';
export * from './controllers/multivault.controller';
export * from './models/dto/createVault.dto';
export * from './models/dto/deleteVault.dto';
export * from './services/multivault.service';
