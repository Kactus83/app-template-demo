/**
 * @module AuthCommonModule
 * @include auth-common.module.md
 *
 * Ce barrel regroupe les éléments communs du domaine Auth :
 * - Le module commun
 * - Les modèles (DTO et types)
 * - Le repository pour l'utilisateur
 * - Les services d'authentification et d'envoi d'email
 * - Les utilitaires (ex. tokenGenerator)
 */
export * from './common.module';
export * from './models/dto/login-response.dto';
export * from './models/types/secureAction.types';
export * from './repositories/auth-user.repository';
export * from './services/auth-methods.service';
export * from './services/email-sender.service';
export * from './utils/tokenGenerator';
