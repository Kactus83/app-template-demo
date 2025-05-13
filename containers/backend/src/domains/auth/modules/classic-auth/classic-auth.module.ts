import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { RegisterController } from './controllers/register.controller';
import { PasswordResetController } from './controllers/password-reset.controller';
import { AuthService } from './services/auth.service';
import { RegisterService } from './services/register.service';
import { PasswordResetService } from './services/password-reset.service';
import { PasswordResetTokenRepository } from './repositories/password-reset-token.repository';
import { CommunicationDomain } from '../../../../domains/communication/communication.domain';
import { ClassicAuthMFAService } from './services/classic-auth-mfa.service';
import { CommonModule } from '../../common/common.module';
import { PasswordHistoryRepository } from './repositories/password-history.repository';

@Module({
  imports: [
    CommonModule,
    forwardRef(() => CommunicationDomain),
  ],
  controllers: [
    AuthController,
    RegisterController,
    PasswordResetController,
  ],
  providers: [
    AuthService,
    RegisterService,
    PasswordHistoryRepository,
    PasswordResetService,
    PasswordResetTokenRepository,
    ClassicAuthMFAService,
  ],
  exports: [ClassicAuthMFAService],
})
export class ClassicAuthModule {}
