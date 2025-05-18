/**
 * @module UserModule
 * @include user-module.md
 *
 * Ce barrel regroupe les éléments du module "User" du domaine "User Management".
 */
export * from './user.module';
export * from './controllers/user.controller';
export * from './controllers/user-profile.controller';
export * from './controllers/user-preferences.controller';
export * from './services/user.service';
export * from './services/user-profile.service';
export * from './services/user-preferences.service';
export * from './repositories/user.repository';
export * from './repositories/user-profile.repository';
export * from './repositories/user-preferences.repository';
export * from './models/dto/update-user-profile.dto';
export * from './models/dto/user-profile.dto';
export * from './models/dto/update-user-preferences.dto';
export * from './models/dto/user-preferences.dto';
