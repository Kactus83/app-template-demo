import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { EmailMFAToken } from '@prisma/client';

@Injectable()
export class EmailMFARepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un nouveau token MFA pour l'email.
   * @param userId L'ID de l'utilisateur
   * @param code Le code généré
   * @param expiresAt La date d'expiration du token
   * @returns Le token MFA créé
   */
  async create(userId: number, code: string, expiresAt: Date): Promise<EmailMFAToken> {
    return this.prisma.emailMFAToken.create({
      data: {
        userId,
        code,
        expiresAt,
      },
    });
  }

  /**
   * Recherche un token MFA valide pour l'email.
   * @param userId L'ID de l'utilisateur
   * @param code Le code reçu
   * @returns Le token MFA s'il existe et est valide
   */
  async findValidToken(userId: number, code: string): Promise<EmailMFAToken | null> {
    return this.prisma.emailMFAToken.findFirst({
      where: {
        userId,
        code,
        expiresAt: {
          gte: new Date(),
        },
        validated: false,
      },
    });
  }

  /**
   * Valide un token MFA en le marquant comme utilisé.
   * @param tokenId L'ID du token à valider
   */
  async markTokenAsValidated(tokenId: number): Promise<void> {
    await this.prisma.emailMFAToken.update({
      where: { id: tokenId },
      data: { validated: true },
    });
  }

  /**
   * Supprime tous les tokens pour un utilisateur.
   * @param userId L'ID de l'utilisateur
   */
  async cleanupOldTokens(userId: number): Promise<void> {
    await this.prisma.emailMFAToken.deleteMany({
      where: {
        userId,
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}