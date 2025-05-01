import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { UserAuthMethod, AuthenticationMethod } from '@prisma/client';

@Injectable()
export class AuthSettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère les méthodes d'authentification d'un utilisateur, ordonnées par priorité.
   * @param userId ID de l'utilisateur.
   * @returns Tableau des méthodes d'authentification de l'utilisateur.
   */
  async findAuthMethodsByUserId(userId: number): Promise<UserAuthMethod[]> {
    return this.prisma.userAuthMethod.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Ajoute une nouvelle méthode d'authentification pour un utilisateur.
   * @param userId ID de l'utilisateur.
   * @param method Type de la méthode d'authentification.
   * @param methodId ID associé à la méthode (si applicable).
   * @returns La méthode d'authentification créée.
   */
  async addAuthMethod(
    userId: number,
    method: AuthenticationMethod,
    methodId?: number
  ): Promise<UserAuthMethod> {
    const lastOrder = await this.prisma.userAuthMethod.aggregate({
      where: { userId },
      _max: { order: true },
    });

    const newOrder = (lastOrder._max.order ?? 0) + 1;

    return this.prisma.userAuthMethod.create({
      data: {
        userId,
        method,
        methodId: methodId ?? null,
        order: newOrder,
      },
    });
  }

  /**
   * Met à jour une méthode d'authentification existante.
   * @param userId ID de l'utilisateur.
   * @param userAuthMethodId ID de la méthode d'authentification à mettre à jour.
   * @param method Nouveau type de méthode d'authentification.
   * @param methodId Nouveau ID associé à la méthode (si applicable).
   * @param order Nouveau ordre de priorité (si applicable).
   * @returns La méthode d'authentification mise à jour.
   */
  async updateAuthMethod(
    userId: number,
    userAuthMethodId: number,
    method: AuthenticationMethod,
    methodId?: number,
    order?: number
  ): Promise<UserAuthMethod> {
    const authMethod = await this.prisma.userAuthMethod.findUnique({
      where: { id: userAuthMethodId },
    });

    if (!authMethod || authMethod.userId !== userId) {
      throw new Error('Authentication method not found');
    }

    return this.prisma.userAuthMethod.update({
      where: { id: userAuthMethodId },
      data: {
        method,
        methodId: methodId ?? null,
        order: order ?? authMethod.order,
      },
    });
  }

  /**
   * Désactive (supprime) une méthode d'authentification pour un utilisateur.
   * @param userId ID de l'utilisateur.
   * @param userAuthMethodId ID de la méthode d'authentification à désactiver.
   */
  async disableAuthMethod(userId: number, userAuthMethodId: number): Promise<void> {
    const authMethod = await this.prisma.userAuthMethod.findUnique({
      where: { id: userAuthMethodId },
    });

    if (!authMethod || authMethod.userId !== userId) {
      throw new Error('Authentication method not found');
    }

    await this.prisma.userAuthMethod.delete({
      where: { id: userAuthMethodId },
    });
  }
}