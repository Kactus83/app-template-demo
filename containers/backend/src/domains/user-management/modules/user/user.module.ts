import { Module, forwardRef } from '@nestjs/common';
import { CommunicationDomain } from '../../../../domains/communication/communication.domain';

import { UserController } from './controllers/user.controller';
import { UserProfileController } from './controllers/user-profile.controller';
import { UserPreferencesController } from './controllers/user-preferences.controller';

import { UserService } from './services/user.service';
import { UserProfileService } from './services/user-profile.service';
import { UserPreferencesService } from './services/user-preferences.service';

import { UserRepository } from './repositories/user.repository';
import { UserProfileRepository } from './repositories/user-profile.repository';
import { UserPreferencesRepository } from './repositories/user-preferences.repository';

/**
 * Module principal pour la gestion des utilisateurs.
 * - Auth / session (via UserController existant)
 * - Profil public  (/users/me/profile)
 * - Préférences    (/users/me/preferences)
 * @category User Management
 */
@Module({
  imports: [
    forwardRef(() => CommunicationDomain),
  ],
  controllers: [
    UserController,
    UserProfileController,
    UserPreferencesController,
  ],
  providers: [
    UserService,
    UserProfileService,
    UserPreferencesService,
    UserRepository,
    UserProfileRepository,
    UserPreferencesRepository,
  ],
  exports: [
    UserService,
    UserProfileService,
    UserPreferencesService,
  ],
})
export class UserModule {}
