import { Module, forwardRef } from '@nestjs/common';
import { AuthenticatorController } from './controllers/authenticator.controller';
import { AuthenticatorService } from './services/authenticator.service';
import { AuthenticatorRepository } from './repositories/authenticator.repository';
import { AuthenticatorMFAService } from './services/authenticator-mfa.service';
import { CommonModule } from '../../common/common.module';
import { CommunicationDomain } from '../../../../domains/communication/communication.domain';

@Module({
  imports: [forwardRef(() => CommonModule), CommunicationDomain],
  controllers: [AuthenticatorController],
  providers: [AuthenticatorService, AuthenticatorRepository, AuthenticatorMFAService],
  exports: [AuthenticatorMFAService],
})
export class AuthenticatorModule {}