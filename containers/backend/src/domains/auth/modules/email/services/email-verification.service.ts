import { Injectable, Logger , HttpException, HttpStatus } from '@nestjs/common';
import { EmailVerificationTokenRepository } from '../../../common/repositories/email-verification-token.repository';

import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);

  constructor(
    private readonly emailVerificationRepo: EmailVerificationTokenRepository,
    private readonly userRepo: AuthUserRepository,
  ) {}

  /**
   * Vérifie et valide un token de vérification d'email.
   * @param token Le token de vérification à valider.
   */
  async verifyEmail(token: string): Promise<void> {
    if (!token || typeof token !== 'string') {
      throw new HttpException(
        { message: 'Verification token is required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const emailVerificationToken = await this.emailVerificationRepo.findByToken(token);
    if (!emailVerificationToken) {
      this.logger.warn(`Invalid or expired verification token: ${token}`);
      throw new HttpException(
        { message: 'Invalid or expired token' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (emailVerificationToken.expiresAt < new Date()) {
      await this.emailVerificationRepo.delete(token);
      this.logger.warn(`Expired verification token: ${token}`);
      throw new HttpException(
        { message: 'Token has expired' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (emailVerificationToken.emailType === 'PRIMARY') {
      await this.userRepo.updateEmailVerificationStatus(
        emailVerificationToken.userId,
        true,
        undefined,
      );
    } else if (emailVerificationToken.emailType === 'SECONDARY') {
      await this.userRepo.updateEmailVerificationStatus(
        emailVerificationToken.userId,
        undefined,
        true,
      );
    }

    await this.emailVerificationRepo.delete(token);

    this.logger.log(`Email verified successfully for user ID: ${emailVerificationToken.userId}`);
  }
}