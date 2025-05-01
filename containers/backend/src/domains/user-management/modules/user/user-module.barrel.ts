/**
 * @module UserModule
 * @include user-module.md
 *
 * Ce barrel regroupe les éléments du module "User" du domaine "User Management".
 * Il inclut les contrôleurs, les modèles, les répertoires et les services
 * relatifs à la gestion des utilisateurs.
 */
export * from './user.module';
export * from './controllers/user.controller';
export * from './models/dto/user-update.dto';
export * from './repository/user.repository';
export * from './services/user.service';
