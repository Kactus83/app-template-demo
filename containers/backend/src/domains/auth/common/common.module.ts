import { Module, forwardRef } from '@nestjs/common';
import { AuthUserRepository } from './repositories/auth-user.repository';
import { CommunicationDomain } from '../../communication/communication.domain';
import { PrismaService } from '../../../core/services/prisma.service';
import { EmailSenderService } from './services/email-sender.service';
import { AuthMethodsService } from './services/auth-methods.service';
import { EmailVerificationTokenRepository } from './repositories/email-verification-token.repository';
import { AuthSeedService } from './services/auth-seed.service';

@Module({
  imports: [forwardRef(() => CommunicationDomain)],
  providers: [AuthUserRepository, EmailVerificationTokenRepository, PrismaService, EmailSenderService, AuthMethodsService, AuthSeedService],
  exports: [AuthUserRepository, EmailVerificationTokenRepository, EmailSenderService, AuthMethodsService],
})
export class CommonModule {}
