import { Module, forwardRef } from '@nestjs/common';
import { AuthUserRepository } from './repositories/auth-user.repository';
import { CommunicationDomain } from '../../communication/communication.domain';
import { PrismaService } from '../../../core/services/prisma.service';
import { EmailSenderService } from './services/email-sender.service';
import { AuthMethodsService } from './services/auth-methods.service';
import { EmailVerificationTokenRepository } from './repositories/email-verification-token.repository';
import { AuthSeedService } from './services/auth-seed.service';
import { AuthMethodsHistoryService } from './services/auth-methods-history.service';
import { ConnectionHistoryService } from './services/connection-history.service';
import { AuthMethodsHistoryRepository } from './repositories/auth-methods-history.repository';
import { ConnectionHistoryRepository } from './repositories/connection-history.repository';

@Module({
  imports: [forwardRef(() => CommunicationDomain)],
  providers: [AuthUserRepository, EmailVerificationTokenRepository, AuthMethodsHistoryRepository, ConnectionHistoryRepository, PrismaService, EmailSenderService, AuthMethodsService, AuthSeedService, AuthMethodsHistoryService, ConnectionHistoryService],
  exports: [AuthUserRepository, EmailVerificationTokenRepository, EmailSenderService, AuthMethodsService, AuthMethodsHistoryService, ConnectionHistoryService, AuthSeedService],
})
export class CommonModule {}
