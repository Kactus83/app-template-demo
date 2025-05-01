import { Injectable, Logger } from '@nestjs/common';
import { EmailMFARepository } from '../repositories/email-MFA.repository';
import { MFAValidationData } from '../../MFA/models/dto/MFAValidationData';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';
import { EmailSenderService } from '../../../../../domains/auth/common/services/email-sender.service';
import { AuthenticationMethod } from '@prisma/client';
import { AuthMethodService } from '../../MFA/models/abstract/auth-method.service';
import { AuthMethodsService } from '../../../common/services/auth-methods.service';

@Injectable()
export class EmailMFAService extends AuthMethodService {
  private readonly logger = new Logger(EmailMFAService.name);

  constructor(
    private readonly emailMFARepository: EmailMFARepository,
    private readonly userRepository: AuthUserRepository,
    private readonly emailService: EmailSenderService, 
    private readonly authMethodsService: AuthMethodsService,
  ) {
    super(authMethodsService, AuthenticationMethod.EMAIL);
  }

  /**
   * Demande la MFA pour l'email.
   * @param userId ID de l'utilisateur concerné
   */
  async requestMFA(userId: number): Promise<void> {
    this.logger.log(`Requesting MFA for userId: ${userId}`);

    const user = await this.userRepository.findById(userId);
    if (!user || !user.email) {
      this.logger.error(`User or email not found for userId: ${userId}`);
      throw new Error('User or email not found');
    }

    // Générer un nouveau token MFA
    const code = this.generateRandomCode(8);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expire dans 15 minutes

    // Nettoyage des anciens tokens MFA
    await this.emailMFARepository.cleanupOldTokens(userId);

    // Créer un nouveau token MFA
    await this.emailMFARepository.create(userId, code, expiresAt);

    // Envoyer l'email de validation MFA
    await this.emailService.sendEmailMFA(user.name, user.email, code);

    this.logger.log(`MFA email sent to ${user.email}`);
  }

  /**
   * Valide les données reçues pour la MFA (code reçu par email).
   * @param userId ID de l'utilisateur concerné
   * @param code Code reçu
   * @returns True si la validation est réussie, sinon False
   */
  async validateMFA(userId: number, data: MFAValidationData): Promise<boolean> {
    this.logger.log(`Validating MFA for userId: ${userId} with code: ${data.emailCode}`);

    const validToken = await this.emailMFARepository.findValidToken(userId, data.emailCode);
    if (!validToken) {
      this.logger.warn(`Invalid MFA code for userId: ${userId}`);
      return false;
    }

    // Marquer le token comme validé
    await this.emailMFARepository.markTokenAsValidated(validToken.id);

    this.logger.log(`MFA validated for userId: ${userId}`);

    return true;
  }

  /**
   * Génère un code aléatoire de la longueur spécifiée.
   * @param length Longueur du code
   * @returns Le code généré
   */
  private generateRandomCode(length: number): string {
    const randomNumber = Math.random().toString().slice(2, 2 + length);
    return randomNumber;
  }
}