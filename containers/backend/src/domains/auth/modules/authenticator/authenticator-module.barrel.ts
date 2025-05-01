/**
 * @module AuthenticatorModule
 * @include authenticator.module.md
 *
 * Ce barrel regroupe les éléments du module "Authenticator".
 * Il gère l'authentification, y compris la gestion des stratégies MFA.
 */
export * from './authenticator.module';
export * from './controllers/authenticator.controller';
export * from './models/dto/authenticator.dto';
export * from './models/dto/updateAuthenticator.dto';
export * from './repositories/authenticator.repository';
export * from './services/authenticator-mfa.service';
export * from './services/authenticator.service';
