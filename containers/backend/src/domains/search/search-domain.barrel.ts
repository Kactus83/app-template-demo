/**
 * @module SearchDomain
 * @include search-domain.md
 *
 * Ce barrel regroupe l'ensemble des éléments du domaine "Search".
 * Ce domaine gère les fonctionnalités de recherche, incluant le module commun et le module de recherche utilisateur.
 */
export * from './search.domain';

// Réexport du module commun de recherche
export * from './common/search-common.module';

// Réexport du barrel du module de recherche utilisateur
export * from './modules/user-search/user-search-module.barrel';
