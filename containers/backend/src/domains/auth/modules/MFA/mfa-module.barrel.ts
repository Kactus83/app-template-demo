/**
 * @module MFAModule
 * @include mfa-module.md
 *
 * Ce barrel regroupe les éléments du module "MFA".
 * Il gère la multi-factor authentication, incluant ses contrôleurs, modèles et services.
 */
export * from './mfa.module';
export * from './controllers/mfa.controller';
export * from './models/abstract/auth-method.service';
export * from './models/dto/MFARequestDto';
export * from './models/dto/MFARequestResponseDto';
export * from './models/dto/MFAValidationData';
export * from './models/dto/MFAValidationResponseDto';
export * from './models/interfaces/IAuthMethodService';
export * from './repositories/mfa.repository';
export * from './services/mfa.service';
export * from './utils/mfa-utils';
