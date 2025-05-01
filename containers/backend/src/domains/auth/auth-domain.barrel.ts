/**
 * @module AuthDomain
 * @include auth-domain.md
 *
 * Ce barrel regroupe l'ensemble des éléments du domaine "Auth".
 * Il gère l'authentification et la sécurité, incluant :
 * - Les fonctionnalités communes (modules, services, utilitaires)
 * - Les modules dédiés aux différentes stratégies d'authentification.
 *
 * Les modules internes sont réexportés via leurs barrels respectifs.
 */
export * from './auth.domain';

// Éléments communs
export * from './common/auth-common-module.barrel';

// Modules
export * from './modules/auth-settings/auth-settings-module.barrel';
export * from './modules/authenticator/authenticator-module.barrel';
export * from './modules/classic-auth/classic-auth-module.barrel';
export * from './modules/email/email-module.barrel';
export * from './modules/MFA/mfa-module.barrel';
export * from './modules/oauth/oauth-module.barrel';
export * from './modules/phone/phone-module.barrel';
export * from './modules/web3/web3-module.barrel';
