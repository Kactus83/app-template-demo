/**
 * @module UserManagementDomain
 * @include user-management-domain.md
 *
 * Ce barrel regroupe l'ensemble des éléments du domaine "User Management".
 * Ce domaine gère la gestion des utilisateurs ainsi que la gestion des raccourcis utilisateur.
 */
export * from './user-management.domain';

// Réexport des barrels des modules du domaine User Management
export * from './modules/user/user-module.barrel';
export * from './modules/user-shortcuts/user-shortcuts-module.barrel';
