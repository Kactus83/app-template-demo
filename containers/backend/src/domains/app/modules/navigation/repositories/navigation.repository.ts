import { Injectable } from '@nestjs/common';
import { Navigation, NavigationType } from '@prisma/client';
import { PrismaService } from '../../../../../core/services/prisma.service';

@Injectable()
export class NavigationRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère la navigation par type (USER ou ADMIN)
   * @param type NavigationType enum
   * @returns Objet Navigation ou null
   */
  async getNavigationByType(type: NavigationType): Promise<Navigation | null> {
    return this.prisma.navigation.findUnique({
      where: { type },
    });
  }

  /**
   * Crée une nouvelle navigation
   * @param data Données de navigation partielle
   * @returns Objet Navigation créé
   */
  async createNavigation(data: {
    type: NavigationType;
    compact: any;
    default: any;
    futuristic: any;
    horizontal: any;
  }): Promise<Navigation> {
    return this.prisma.navigation.create({
      data,
    });
  }

  /**
   * Met à jour la navigation par type
   * @param type NavigationType enum
   * @param data Données de navigation partielle
   * @returns Objet Navigation mis à jour
   */
  async updateNavigation(
    type: NavigationType,
    data: Partial<{
      compact: any;
      default: any;
      futuristic: any;
      horizontal: any;
    }>
  ): Promise<Navigation> {
    return this.prisma.navigation.update({
      where: { type },
      data,
    });
  }
}