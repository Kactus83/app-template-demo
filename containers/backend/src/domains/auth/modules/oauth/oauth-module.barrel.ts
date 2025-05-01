/**
 * @module OAuthModule
 * @include oauth-module.md
 *
 * Ce barrel regroupe les éléments du module "OAuth".
 * Il gère l'authentification via des fournisseurs externes (Facebook, GitHub, Google, etc.).
 */
export * from './oauth.module';
export * from './controllers/oauth.controller';
export * from './models/dto/oauth.dto';
export * from './models/dto/oauthAccount.dto';
export * from './models/interfaces/github-user-response.interface';
export * from './models/interfaces/oauth-profile.interface';
export * from './models/interfaces/oauth-request.interface';
export * from './models/types/oauth-provider.type';
export * from './repositories/oauth-account.repository';
export * from './repositories/oauth-mfa-token.repository';
export * from './services/oauth-mfa.service';
export * from './services/oauth.service';
export * from './strategies/facebook.strategy';
export * from './strategies/github.strategy';
export * from './strategies/google.strategy';
