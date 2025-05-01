import { Module, forwardRef } from '@nestjs/common';
import { EmailController } from './controllers/email.controller';
import { EmailChangeController } from './controllers/email-change.controller';
import { EmailVerificationController } from './controllers/email-verification.controller';
import { EmailService } from './services/email.service';
import { EmailChangeService } from './services/email-change.service';
import { EmailMFAService } from './services/email-MFA.service';
import { EmailChangeTokenRepository } from './repositories/email-change-token.repository';
import { EmailVerificationTokenRepository } from '../../common/repositories/email-verification-token.repository';
import { SecondaryEmailDeletionTokenRepository } from './repositories/secondary-email-deletion-token.repository';
import { EmailOAuthAccountRepository } from './repositories/email-oauth.repository';
import { EmailMFARepository } from './repositories/email-MFA.repository';
import { EmailVerificationService } from './services/email-verification.service';
import { CommonModule } from '../../common/common.module';

/**
 * @module EmailModule
 * @description Module gérant l'envoi, la vérification et la gestion des emails.
 *
 * Ce module centralise les controllers et services liés aux opérations sur les emails :
 * - Vérification d'email (EmailVerificationController)
 * - Changement d'email (EmailChangeController)
 * - Gestion des emails secondaires (EmailController)
 *
 * Il importe le CommonModule afin d'utiliser les fonctionnalités communes.
 */
@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  controllers: [
    EmailController,
    EmailChangeController,
    EmailVerificationController,
  ],
  providers: [
    EmailService,
    EmailVerificationService,
    EmailChangeService,
    EmailMFAService,
    EmailChangeTokenRepository,
    EmailVerificationTokenRepository,
    SecondaryEmailDeletionTokenRepository,
    EmailOAuthAccountRepository,
    EmailMFARepository,
  ],
  exports: [
    EmailMFAService,
  ],
})
export class EmailModule {
  constructor() {
    console.log('EmailModule loaded');
  }
}
