import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/services/prisma.service';
import { EmailVerificationToken, EmailType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmailVerificationTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createToken(userId: number, emailType: EmailType): Promise<EmailVerificationToken> {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000); // Token valid for 1 hour

    return this.prisma.emailVerificationToken.create({
      data: {
        userId,
        emailType,
        token,
        expiresAt,
      },
    });
  }

  /**
   * Crée un nouveau token de vérification d'email.
   * @param tokenData Contient les informations du token à créer (userId, emailType, token, expiresAt)
   * @returns Le token de vérification d'email créé
   */
  async create(tokenData: {
    userId: number;
    emailType: EmailType;
    token: string;
    expiresAt: Date;
  }): Promise<EmailVerificationToken> {
    return this.prisma.emailVerificationToken.create({
      data: tokenData,
    });
  }

  /**
   * Recherche un token de vérification d'email dans la base de données par son token.
   * @param token Le token à rechercher
   * @returns Le token de vérification d'email correspondant ou null s'il n'existe pas
   */
  async findByToken(token: string): Promise<EmailVerificationToken | null> {
    return this.prisma.emailVerificationToken.findUnique({
      where: { token },
    });
  }

  /**
   * Supprime un token de vérification d'email de la base de données.
   * @param token Le token à supprimer
   */
  async delete(token: string): Promise<void> {
    await this.prisma.emailVerificationToken.delete({
      where: { token },
    });
  }

  /**
   * Supprime tous les tokens de vérification d'un type d'email pour un utilisateur.
   * @param userId ID de l'utilisateur
   * @param emailType Type d'email (PRIMARY ou SECONDARY)
   */
  async deleteByUserIdAndEmailType(userId: number, emailType: EmailType): Promise<void> {
    await this.prisma.emailVerificationToken.deleteMany({
      where: {
        userId,
        emailType,
      },
    });
  }
}