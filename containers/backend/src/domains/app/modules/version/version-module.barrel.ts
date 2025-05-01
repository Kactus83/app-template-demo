/**
 * @module VersionModule
 * @include version-module.md
 *
 * Ce barrel regroupe les éléments du module de version du domaine "App".
 * Il inclut la configuration, les contrôleurs, les middlewares, les modèles,
 * les répertoires et les services relatifs à la gestion de version.
 */
export * from './version.module';
export * from './config/version.config';
export * from './controllers/version.controller';
export * from './middlewares/version-check.middleware';
export * from './models/dto/version.dto';
export * from './models/interfaces/IVersionModule';
export * from './repositories/version.repository';
export * from './services/version.service';
