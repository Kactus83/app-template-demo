import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { Prisma, OAuthAccount } from '@prisma/client';

@Injectable()
export class OAuthAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Trouve un compte OAuth par fournisseur et identifiant du fournisseur.
   */
  async findByProviderAndProviderId(provider: string, providerId: string): Promise<OAuthAccount | null> {
    return this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    });
  }

  /**
   * Trouve tous les comptes OAuth d'un utilisateur.
   */
  async findAllByUserId(userId: number): Promise<OAuthAccount[]> {
    return this.prisma.oAuthAccount.findMany({
      where: {
        userId,
      },
    });
  }

  /**
   * Trouve un compte OAuth par ID.
   */
  async findById(id: number): Promise<OAuthAccount | null> {
    return this.prisma.oAuthAccount.findUnique({
      where: { id },
    });
  }

  /**
   * Trouve des comptes OAuth par email d'utilisateur.
   */
  async findMultipleByUserEmail(email: string): Promise<OAuthAccount[]> {
    return this.prisma.oAuthAccount.findMany({
      where: {
        user: {
          OR: [
            { email },
            { secondaryEmail: email },
          ],
        },
      },
    });
  }

  /**
   * Crée un nouveau compte OAuth.
   */
  async createOAuthAccount(oauthData: Prisma.OAuthAccountCreateInput): Promise<OAuthAccount> {
    return this.prisma.oAuthAccount.create({
      data: oauthData,
    });
  }

  /**
   * Met à jour un compte OAuth.
   */
  async updateOAuthAccount(id: number, updateData: Prisma.OAuthAccountUpdateInput): Promise<OAuthAccount> {
    return this.prisma.oAuthAccount.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Supprime un compte OAuth.
   */
  async deleteOAuthAccount(id: number): Promise<void> {
    await this.prisma.oAuthAccount.delete({
      where: { id },
    });
  }
}