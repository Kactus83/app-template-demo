import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { OAuthMFAToken } from '@prisma/client';

@Injectable()
export class OAuthMFATokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un nouveau token MFA OAuth.
   */
  async createOAuthMfaToken(
    userId: number,
    provider: string,
    providerId: string,
    token: string,
    expiresAt: Date
  ): Promise<OAuthMFAToken> {
    return this.prisma.oAuthMFAToken.create({
      data: {
        userId,
        provider,
        providerId,
        token,
        expiresAt,
        hasBeenValidated: false,
      },
    });
  }

  /**
   * Trouve un token MFA OAuth par token et fournisseur.
   */
  async findByTokenAndProvider(token: string, provider: string): Promise<OAuthMFAToken | null> {
    return this.prisma.oAuthMFAToken.findFirst({
      where: {
        token,
        provider,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
  }

  /**
   * Trouve tous les tokens MFA OAuth pour un utilisateur.
   */
  async findAllByUserId(userId: number): Promise<OAuthMFAToken[]> {
    return this.prisma.oAuthMFAToken.findMany({
      where: {
        userId,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
  }

  /**
   * Supprime tous les tokens MFA OAuth pour un utilisateur.
   */
  async deleteAllByUserId(userId: number): Promise<void> {
    await this.prisma.oAuthMFAToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  /**
   * Supprime un token MFA OAuth spécifique.
   */
  async deleteByToken(token: string): Promise<void> {
    await this.prisma.oAuthMFAToken.delete({
      where: { token },
    });
  }

  /**
   * Trouve un token MFA OAuth par userId, provider et providerId.
   */
  async findByUserProviderAndProviderId(
    userId: number,
    provider: string,
    providerId: string
  ): Promise<OAuthMFAToken | null> {
    return this.prisma.oAuthMFAToken.findFirst({
      where: {
        userId,
        provider,
        providerId,
        expiresAt: { gte: new Date() },
        hasBeenValidated: false,
      },
    });
  }

  /**
   * Met à jour un token MFA OAuth pour le marquer comme validé.
   */
  async updateTokenAsValidated(token: string): Promise<void> {
    await this.prisma.oAuthMFAToken.update({
      where: { token },
      data: { hasBeenValidated: true },
    });
  }
}