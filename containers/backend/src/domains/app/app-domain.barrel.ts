/**
 * @module AppDomain
 * @include app-domain.md
 *
 * Ce barrel regroupe l'ensemble des éléments du domaine "App".
 * Ce domaine couvre les fonctionnalités de base de l'application, incluant le cœur de métier,
 * la gestion de la navigation et la gestion de la version.
 *
 * @remarks
 * Les modules internes sont réexportés via leurs barrels respectifs.
 */
export * from './app.domain';
export * from './app.service';
export * from './IAppDomain';

// Réexport des barrels des modules du domaine App
export * from './modules/navigation/navigation-module.barrel';
export * from './modules/version/version-module.barrel';
