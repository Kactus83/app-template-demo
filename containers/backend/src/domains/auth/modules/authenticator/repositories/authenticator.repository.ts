import { Injectable } from '@nestjs/common';
import { Authenticator } from '@prisma/client';
import { PrismaService } from '../../../../../core/services/prisma.service';

/**
 * Repository pour gérer les authenticators des utilisateurs.
 */
@Injectable()
export class AuthenticatorRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Trouve un authenticator par l'ID de l'utilisateur.
   * @param userId ID de l'utilisateur.
   * @returns L'authenticator ou null s'il n'existe pas.
   */
  async findByUserId(userId: number): Promise<Authenticator | null> {
    return this.prisma.authenticator.findUnique({
      where: { userId },
    });
  }

  /**
   * Crée un nouvel authenticator pour un utilisateur.
   * @param userId ID de l'utilisateur.
   * @param secret Clé secrète TOTP.
   * @param qrCodeUrl URL du QR code à scanner.
   * @returns L'authenticator créé.
   */
  async create(userId: number, secret: string, qrCodeUrl: string): Promise<Authenticator> {
    return this.prisma.authenticator.create({
      data: {
        userId,
        secret,
        enabled: false,
        qrCodeURL: qrCodeUrl,
      },
    });
  }

  /**
   * Active l'authenticator pour un utilisateur.
   * @param userId ID de l'utilisateur.
   * @returns L'authenticator mis à jour.
   */
  async enable(userId: number): Promise<Authenticator> {
    return this.prisma.authenticator.update({
      where: { userId },
      data: { enabled: true },
    });
  }

  /**
   * Désactive l'authenticator pour un utilisateur.
   * @param userId ID de l'utilisateur.
   * @returns L'authenticator mis à jour.
   */
  async disable(userId: number): Promise<Authenticator> {
    return this.prisma.authenticator.update({
      where: { userId },
      data: { enabled: false },
    });
  }

  /**
   * Met à jour le secret de l'authenticator pour un utilisateur.
   * @param userId ID de l'utilisateur.
   * @param secret Nouveau secret TOTP.
   * @returns L'authenticator mis à jour.
   */
  async updateSecret(userId: number, secret: string): Promise<Authenticator> {
    return this.prisma.authenticator.update({
      where: { userId },
      data: { secret },
    });
  }

  /**
   * Supprime l'authenticator d'un utilisateur.
   * @param userId ID de l'utilisateur.
   * @returns L'authenticator supprimé.
   */
  async delete(userId: number): Promise<Authenticator> {
    return this.prisma.authenticator.delete({
      where: { userId },
    });
  }
}
