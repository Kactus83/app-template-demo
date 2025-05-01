/**
 * @module EmailModule
 * @include email-module.md
 *
 * Ce barrel regroupe les éléments du module "Email".
 * Il gère les opérations liées aux emails (changement, vérification, et gestion des tokens).
 */
export * from './email.module';
export * from './controllers/email-change.controller';
export * from './controllers/email-verification.controller';
export * from './controllers/email.controller';
export * from './models/dto/addSecondaryEmail.dto';
export * from './models/dto/change-email.dto';
export * from './models/dto/confirm-email-change.dto';
export * from './models/dto/confirm-secondary-email-deletion.dto';
export * from './models/dto/email-validation-token.dto';
export * from './repositories/email-change-token.repository';
export * from './repositories/email-MFA.repository';
export * from './repositories/email-oauth.repository';
export * from './repositories/secondary-email-deletion-token.repository';
export * from './services/email-change.service';
export * from './services/email-MFA.service';
export * from './services/email-verification.service';
export * from './services/email.service';
