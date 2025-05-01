import { Injectable, Logger } from '@nestjs/common';
import { EmailChangeTokenRepository } from '../repositories/email-change-token.repository';
import { EmailOAuthAccountRepository } from '../repositories/email-oauth.repository';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';
import { EmailSenderService } from '../../../../../domains/auth/common/services/email-sender.service';
import { generateRandomToken } from '../../../../../domains/auth/common/utils/tokenGenerator';

@Injectable()
export class EmailChangeService {
  private readonly logger = new Logger(EmailChangeService.name);

  constructor(
    private readonly emailChangeRepo: EmailChangeTokenRepository,
    private readonly userRepo: AuthUserRepository,
    private readonly oauthAccountRepo: EmailOAuthAccountRepository,
    private readonly emailService: EmailSenderService,
  ) {}

  /**
   * Demande de changement d'email pour un utilisateur.
   * @param userId Identifiant de l'utilisateur.
   * @param newEmail Nouvel email.
   * @returns Promise.
   * @throws Error si l'utilisateur n'existe pas ou si l'email est déjà utilisé.
   */
  async requestEmailChange(userId: number, newEmail: string): Promise<void> {
    this.logger.log(`Requesting email change for userId: ${userId}, newEmail: ${newEmail}`);
    
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.error(`User not found for userId: ${userId}`);
      throw new Error('User not found');
    }

    if (await this.userRepo.findByEmail(newEmail) || await this.userRepo.findBySecondaryEmail(newEmail)) {
      this.logger.error(`Email already in use: ${newEmail}`);
      throw new Error('Email already in use');
    }

    const token = generateRandomToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 heure

    this.logger.log(`Generated token: ${token}, expiresAt: ${expiresAt}`);

    await this.emailChangeRepo.create({
      userId,
      emailType: 'PRIMARY',
      newEmail,
      token,
      expiresAt,
    });

    this.logger.log(`Email change token created for userId: ${userId}, newEmail: ${newEmail}`);

    await this.emailService.sendEmailChangeConfirmation(user.name, newEmail, token, 'PRIMARY');

    this.logger.log(`Email change confirmation sent to: ${newEmail}`);
  }

  /**
   * Demande de changement d'email secondaire pour un utilisateur.
   * @param userId Identifiant de l'utilisateur.
   * @param newEmail Nouvel email secondaire.
   * @returns Promise.
   * @throws Error si l'utilisateur n'existe pas ou si l'email est déjà utilisé.
   */
  async requestSecondaryEmailChange(userId: number, newEmail: string): Promise<void> {
    this.logger.log(`Requesting secondary email change for userId: ${userId}, newEmail: ${newEmail}`);
    
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.error(`User not found for userId: ${userId}`);
      throw new Error('User not found');
    }

    if (await this.userRepo.findByEmail(newEmail) || await this.userRepo.findBySecondaryEmail(newEmail)) {
      this.logger.error(`Email already in use: ${newEmail}`);
      throw new Error('Email already in use');
    }

    const token = generateRandomToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 heure

    this.logger.log(`Generated token: ${token}, expiresAt: ${expiresAt}`);

    await this.emailChangeRepo.create({
      userId,
      emailType: 'SECONDARY',
      newEmail,
      token,
      expiresAt,
    });

    this.logger.log(`Email change token created for userId: ${userId}, newEmail: ${newEmail}`);

    await this.emailService.sendEmailChangeConfirmation(user.name, newEmail, token, 'SECONDARY');

    this.logger.log(`Email change confirmation sent to: ${newEmail}`);
  }

  /**
   * Confirmation de changement d'email primaire pour un utilisateur.
   * @param token Token de confirmation.
   */
  async confirmEmailChange(token: string): Promise<void> {
    this.logger.log(`Confirming email change with token: ${token}`);

    const emailChangeToken = await this.emailChangeRepo.findByToken(token);
    if (!emailChangeToken) {
      this.logger.error(`Invalid or expired token: ${token}`);
      throw new Error('Invalid or expired token');
    }

    if (emailChangeToken.expiresAt < new Date()) {
      await this.emailChangeRepo.delete(token);
      this.logger.error(`Token has expired: ${token}`);
      throw new Error('Token has expired');
    }

    if (emailChangeToken.emailType !== 'PRIMARY') {
      this.logger.error(`Invalid token type: ${emailChangeToken.emailType}`);
      throw new Error('Invalid token');
    }

    const user = await this.userRepo.findById(emailChangeToken.userId);
    if (!user) {
      this.logger.error(`User not found for userId: ${emailChangeToken.userId}`);
      throw new Error('User not found');
    }

    if (!user.email) {
      this.logger.error(`Email not found for userId: ${emailChangeToken.userId}`);
      throw new Error('Email not found');
    }

    if (user.secondaryEmail) {
      // Supprimer les comptes OAuth liés à l'ancien email
      const oauthAccounts = await this.oauthAccountRepo.findMultipleByUserEmail(emailChangeToken.newEmail);
      for (const oauthAccount of oauthAccounts) {
        await this.oauthAccountRepo.deleteOAuthAccount(oauthAccount.id);
      }
    } else {
      // Mettre à jour l'email secondaire avec l'ancien email
      await this.userRepo.updateSecondaryEmail(emailChangeToken.userId, user.email);
      await this.userRepo.updateEmailVerificationStatus(emailChangeToken.userId, undefined, user.isEmailVerified);
    }

    // Mettre à jour l'email principal de l'utilisateur
    await this.userRepo.updateEmail(emailChangeToken.userId, emailChangeToken.newEmail);

    // Supprimer le token de changement d'email
    await this.emailChangeRepo.delete(token);

    this.logger.log(`Email changed successfully for userId: ${emailChangeToken.userId}`);
  }

  /**
   * Confirmation du changement d'email secondaire pour un utilisateur.
   * @param token Token de confirmation.
   */
  async confirmSecondaryEmailChange(token: string): Promise<void> {
    this.logger.log(`Confirming secondary email change with token: ${token}`);

    const emailChangeToken = await this.emailChangeRepo.findByToken(token);
    if (!emailChangeToken) {
      this.logger.error(`Invalid or expired token: ${token}`);
      throw new Error('Invalid or expired token');
    }

    if (emailChangeToken.expiresAt < new Date()) {
      await this.emailChangeRepo.delete(token);
      this.logger.error(`Token has expired: ${token}`);
      throw new Error('Token has expired');
    }

    if (emailChangeToken.emailType !== 'SECONDARY') {
      this.logger.error(`Invalid token type: ${emailChangeToken.emailType}`);
      throw new Error('Invalid token');
    }

    // Supprimer les comptes OAuth liés à l'ancien email secondaire
    const oauthAccounts = await this.oauthAccountRepo.findMultipleByUserEmail(emailChangeToken.newEmail);
    for (const oauthAccount of oauthAccounts) {
      await this.oauthAccountRepo.deleteOAuthAccount(oauthAccount.id);
    }

    // Mettre à jour l'email secondaire de l'utilisateur
    await this.userRepo.updateSecondaryEmail(emailChangeToken.userId, emailChangeToken.newEmail);

    // Supprimer le token de changement d'email secondaire
    await this.emailChangeRepo.delete(token);

    this.logger.log(`Secondary email changed successfully for userId: ${emailChangeToken.userId}`);
  }
}