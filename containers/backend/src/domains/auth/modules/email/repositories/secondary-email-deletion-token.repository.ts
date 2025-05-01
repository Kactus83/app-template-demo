import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { SecondaryEmailDeletionToken } from '@prisma/client';

@Injectable()
export class SecondaryEmailDeletionTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un nouveau token de suppression d'email secondaire pour un utilisateur.
   * @param tokenData Contient les informations du token à créer (userId, token, expiresAt)
   * @returns Le token de suppression d'email secondaire créé
   */
  async create(tokenData: {
    userId: number;
    token: string;
    expiresAt: Date;
  }): Promise<SecondaryEmailDeletionToken> {
    return this.prisma.secondaryEmailDeletionToken.create({
      data: tokenData,
    });
  }

  /**
   * Recherche un token de suppression d'email secondaire dans la base de données par son token.
   * @param token Le token à rechercher
   * @returns Le token de suppression d'email secondaire correspondant ou null s'il n'existe pas
   */
  async findByToken(token: string): Promise<SecondaryEmailDeletionToken | null> {
    return this.prisma.secondaryEmailDeletionToken.findUnique({
      where: { token },
    });
  }

  /**
   * Supprime un token de suppression d'email secondaire de la base de données.
   * @param token Le token à supprimer
   */
  async delete(token: string): Promise<void> {
    await this.prisma.secondaryEmailDeletionToken.delete({
      where: { token },
    });
  }

  /**
   * Supprime tous les tokens de suppression d'email secondaire d'un utilisateur.
   * @param userId L'ID de l'utilisateur
   */
  async deleteByUserId(userId: number): Promise<void> {
    await this.prisma.secondaryEmailDeletionToken.deleteMany({
      where: { userId },
    });
  }
}