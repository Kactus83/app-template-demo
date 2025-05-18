import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { UserPreferences } from '@prisma/client';

@Injectable()
export class UserPreferencesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère les préférences d’un user ou null si inexistantes.
   */
  async findByUserId(userId: number): Promise<UserPreferences | null> {
    return this.prisma.userPreferences.findUnique({
      where: { userId },
    });
  }

  /**
   * Crée ou met à jour les préférences pour un user.
   */
  async upsert(
    userId: number,
    data: { locale?: string; timezone?: string; theme?: string },
  ): Promise<UserPreferences> {
    return this.prisma.userPreferences.upsert({
      where: { userId },
      create: { userId, ...data },
      update: { ...data },
    });
  }
}
