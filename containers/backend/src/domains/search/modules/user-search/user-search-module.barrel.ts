/**
 * @module UserSearchModule
 * @include user-search-module.md
 *
 * Ce barrel regroupe les éléments du module de recherche utilisateur du domaine "Search".
 * Il inclut les contrôleurs, les modèles, les interfaces, les répertoires et les services
 * relatifs à la recherche d'utilisateurs.
 */
export * from './user-search.module';
export * from './controllers/user-search.controller';
export * from './models/dto/user-search.dto';
export * from './repositories/user-search.repository';
export * from './services/user-search.service';
