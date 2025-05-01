import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { EmailChangeToken } from '@prisma/client';

@Injectable()
export class EmailChangeTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un nouveau token de changement d'email pour un utilisateur.
   * @param tokenData Contient les informations du token à créer (userId, newEmail, token, expiresAt)
   * @returns Le token de changement d'email créé
   */
  async create(tokenData: {
    userId: number;
    emailType: 'PRIMARY' | 'SECONDARY';
    newEmail: string;
    token: string;
    expiresAt: Date;
  }): Promise<EmailChangeToken> {
    return this.prisma.emailChangeToken.create({
      data: tokenData,
    });
  }

  /**
   * Recherche un token de changement d'email dans la base de données par son token.
   * @param token Le token à rechercher
   * @returns Le token de changement d'email correspondant ou null s'il n'existe pas
   */
  async findByToken(token: string): Promise<EmailChangeToken | null> {
    return this.prisma.emailChangeToken.findUnique({
      where: { token },
    });
  }

  /**
   * Supprime un token de changement d'email de la base de données.
   * @param token Le token à supprimer
   */
  async delete(token: string): Promise<void> {
    await this.prisma.emailChangeToken.delete({
      where: { token },
    });
  }
}