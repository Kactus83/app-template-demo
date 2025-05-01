/**
 * @module Application
 * @include README.md
 *
 * Ce fichier central regroupe les éléments principaux de l'application.
 * Il inclut le point d'entrée, le module principal, le module Core et l'ensemble des domaines fonctionnels.
 */

// Point d'entrée de l'application
export * from './main';
export * from './app.module';

// Core du backend
export * from './core/core-module.barrel';

// Réexport des domaines
export * from './domains/app/app-domain.barrel';
export * from './domains/communication/communication-domain.barrel';
export * from './domains/search/search-domain.barrel';
export * from './domains/user-management/user-management-domain.barrel';
export * from './domains/auth/auth-domain.barrel';
export * from './domains/web3/web3-domain.barrel';