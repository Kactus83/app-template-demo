/**
 * @module PhoneModule
 * @include phone-module.md
 *
 * Ce barrel regroupe les éléments du module "Phone".
 * Il gère l'authentification par téléphone et les opérations associées.
 */
export * from './phone.module';
export * from './controllers/phone.controller';
export * from './models/dto/add-phone.dto';
export * from './models/dto/phone.dto';
export * from './models/dto/update-phone.dto';
export * from './models/dto/verify-phone.dto';
export * from './repositories/phone.repository';
export * from './services/phone-mfa.service';
export * from './services/phone.service';
