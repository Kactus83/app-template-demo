import { Injectable } from '@nestjs/common';
import { MFAToken, SecureAction, AuthenticationMethod } from '@prisma/client';
import { PrismaService } from '../../../../../core/services/prisma.service';

/**
 * Repository pour gérer les tokens MFA.
 */
@Injectable()
export class MFARepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un nouveau token MFA.
   */
  async create(
    userId: number,
    token: string,
    action: SecureAction,
    stepsRequired: AuthenticationMethod[],
    expiresAt: Date
  ): Promise<MFAToken> {
    return this.prisma.mFAToken.create({
      data: {
        userId,
        token,
        action,
        stepsRequired,
        stepsValidated: [],
        expiresAt,
      },
    });
  }

  /**
   * Recherche un token MFA valide par token.
   */
  async findValidToken(token: string): Promise<MFAToken | null> {
    return this.prisma.mFAToken.findFirst({
      where: {
        token,
        expiresAt: { gte: new Date() },
        used: false,
      },
    });
  }

  /**
   * Recherche un token MFA par ID d'utilisateur.
   */
  async findTokenByUserId(userId: number): Promise<MFAToken | null> {
    return this.prisma.mFAToken.findFirst({
      where: {
        userId,
        expiresAt: { gte: new Date() },
        used: false,
      },
    });
  }

  /**
   * Met à jour les étapes validées du token MFA.
   */
  async updateStepsValidated(tokenId: string, stepsValidated: AuthenticationMethod[]): Promise<void> {
    await this.prisma.mFAToken.update({
      where: { id: tokenId },
      data: { stepsValidated },
    });
  }

  /**
   * Marque le token MFA comme utilisé.
   */
  async markAsUsed(tokenId: string): Promise<void> {
    await this.prisma.mFAToken.update({
      where: { id: tokenId },
      data: { used: true },
    });
  }

  /**
   * Supprime tous les tokens MFA pour un utilisateur.
   */
  async cleanupTokens(userId: number): Promise<void> {
    await this.prisma.mFAToken.deleteMany({
      where: { userId },
    });
  }
}
