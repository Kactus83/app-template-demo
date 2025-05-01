import { Injectable, Logger } from '@nestjs/common';
import { UserWithRelations } from '../../../../../core/models/types/userWithRelations.type';
import { EmailVerificationTokenRepository } from '../../../common/repositories/email-verification-token.repository';
import { SecondaryEmailDeletionTokenRepository } from '../repositories/secondary-email-deletion-token.repository';
import { EmailOAuthAccountRepository } from '../repositories/email-oauth.repository';
import { EmailSenderService } from '../../../../../domains/auth/common/services/email-sender.service';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly emailVerificationRepo: EmailVerificationTokenRepository,
    private readonly secondaryEmailDeletionTokenRepo: SecondaryEmailDeletionTokenRepository,
    private readonly oauthAccountRepo: EmailOAuthAccountRepository,
    private readonly emailService: EmailSenderService,
  ) {}

  /**
   * Ajoute un email secondaire à un utilisateur existant.
   * @param userId ID de l'utilisateur.
   * @param secondaryEmail Email secondaire à ajouter.
   * @returns L'utilisateur mis à jour.
   */
  async addSecondaryEmail(userId: number, secondaryEmail: string): Promise<UserWithRelations> {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.authUserRepository.findById(userId);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Vérifier si l'utilisateur a déjà un email secondaire
    if (existingUser.secondaryEmail) {
      throw new Error('Secondary email is already set. Please use the change function.');
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existingUserByEmail = await this.authUserRepository.findByEmail(secondaryEmail);
    const existingUserBySecondaryEmail = await this.authUserRepository.findBySecondaryEmail(secondaryEmail);
    if (
      (existingUserByEmail && existingUserByEmail.id !== userId) ||
      (existingUserBySecondaryEmail && existingUserBySecondaryEmail.id !== userId)
    ) {
      throw new Error('The email is already in use by another account.');
    }

    // Vérifier que l'email secondaire est différent de l'email principal de l'utilisateur
    if (existingUser.email === secondaryEmail) {
      throw new Error('Secondary email must be different from the primary email.');
    }

    // Mettre à jour l'utilisateur avec le nouvel email secondaire
    const updatedUser = await this.authUserRepository.update(userId, {
      secondaryEmail: secondaryEmail,
      isSecondaryEmailVerified: false,
    });

    if (!updatedUser) {
      throw new Error('Failed to update user with secondary email.');
    }

    // Générer et envoyer le token de vérification pour l'email secondaire
    const secondaryToken = this.generateRandomToken();
    const secondaryExpiresAt = new Date(Date.now() + 3600000); // 1 heure

    // Supprimer les anciens tokens de vérification pour l'email secondaire
    await this.emailVerificationRepo.deleteByUserIdAndEmailType(userId, 'SECONDARY');

    await this.emailVerificationRepo.create({
      userId: userId,
      emailType: 'SECONDARY',
      token: secondaryToken,
      expiresAt: secondaryExpiresAt,
    });

    await this.emailService.sendEmailVerification(existingUser.name, secondaryEmail, secondaryToken, 'SECONDARY');

    this.logger.log(`Secondary email added for user: ${updatedUser.email}`);

    return updatedUser;
  }

  /**
   * Supprime l'email secondaire d'un utilisateur.
   * @param userId ID de l'utilisateur.
   * @returns L'utilisateur mis à jour.
   */
  async deleteSecondaryEmail(userId: number): Promise<UserWithRelations> {
    const user = await this.authUserRepository.findById(userId);
    if (!user) {
      this.logger.error(`User not found: ${userId}`);
      throw new Error('User not found');
    }

    if (!user.secondaryEmail) {
      this.logger.error(`No secondary email found for user: ${userId}`);
      throw new Error('No secondary email found');
    }

    // Supprimer l'ancien token de suppression de l'email secondaire s'il existe
    await this.secondaryEmailDeletionTokenRepo.deleteByUserId(userId);

    // Envoyer un email de confirmation de suppression de l'email secondaire
    const token = this.generateRandomToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 heure

    await this.secondaryEmailDeletionTokenRepo.create({
      userId: userId,
      token: token,
      expiresAt: expiresAt,
    });

    await this.emailService.sendSecondaryEmailDeletionConfirmation(user.name, user.secondaryEmail, token);

    this.logger.log(`Secondary email deletion confirmation sent to ${user.secondaryEmail}`);

    return user;
  }

  /**
   * Confirme la suppression de l'email secondaire d'un utilisateur.
   * @param token Token de suppression de l'email secondaire.
   */
  async confirmSecondaryEmailDeletion(token: string): Promise<void> {
    const tokenData = await this.secondaryEmailDeletionTokenRepo.findByToken(token);
    if (!tokenData) {
      this.logger.error(`Invalid or expired token: ${token}`);
      throw new Error('Invalid or expired token');
    }

    const userId = tokenData.userId;

    // Supprimer les comptes OAuth associés à l'email secondaire
    const email = await this.authUserRepository.findById(userId).then((user: UserWithRelations | null) => user?.secondaryEmail);
    if (!email) {
      this.logger.error(`User not found or secondary email not set for userId: ${userId}`);
      throw new Error('User not found or secondary email not set');
    }
    
    const oauthAccounts = await this.oauthAccountRepo.findMultipleByUserEmail(email);
    for (const account of oauthAccounts) {
      await this.oauthAccountRepo.deleteOAuthAccount(account.id);
    }

    // Supprimer l'email secondaire de l'utilisateur
    await this.authUserRepository.update(userId, {
      secondaryEmail: null,
      isSecondaryEmailVerified: false,
    });

    // Supprimer le token de suppression de l'email secondaire
    await this.secondaryEmailDeletionTokenRepo.delete(token);

    this.logger.log(`Secondary email deleted for user: ${userId}`);
  }

  /**
   * Génère un token aléatoire sécurisé.
   * @returns Le token généré.
   */
  private generateRandomToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}