import { Module, forwardRef } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { AuthDomain } from '../../../../domains/auth/auth.domain';
import { ServiceAccountsManagementController } from './controllers/service-accounts-management.controller';
import { ServiceAccountAuthController } from './controllers/service-account-auth.controller';
import { ServiceAccountsManagementService } from './services/service-accounts-management.service';
import { ServiceAccountAuthService } from './services/service-account-auth.service';
import { UserServiceAccountRepository } from './repositories/user-service-account.repository';

/**
 * Module des Service Accounts.
 * Regroupe la gestion (CRUD, rotation) et l’authentification (client_credentials).
 * @category Domains/Auth
 */
@Module({
  imports: [
    CommonModule,
    forwardRef(() => AuthDomain),
  ],
  controllers: [
    ServiceAccountsManagementController,
    ServiceAccountAuthController,
  ],
  providers: [
    UserServiceAccountRepository,
    ServiceAccountsManagementService,
    ServiceAccountAuthService,
  ],
  exports: [
    ServiceAccountsManagementService,
    ServiceAccountAuthService,
  ],
})
export class ServicesAccountsModule {}