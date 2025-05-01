/**
 * @module ClassicAuthModule
 * @include classic-auth-module.md
 *
 * Ce barrel regroupe les éléments du module "Classic Auth".
 * Il gère l'authentification traditionnelle, l'inscription et la réinitialisation de mot de passe.
 */
export * from './classic-auth.module';
export * from './controllers/auth.controller';
export * from './controllers/password-reset.controller';
export * from './controllers/register.controller';
export * from './models/dto/addClassicAuth.dto';
export * from './models/dto/login.dto';
export * from './models/dto/passwordReset.dto';
export * from './models/dto/register.dto';
export * from './models/dto/request-password-reset.dto';
export * from './repositories/password-reset-token.repository';
export * from './services/auth.service';
export * from './services/classic-auth-mfa.service';
export * from './services/password-reset.service';
export * from './services/register.service';
