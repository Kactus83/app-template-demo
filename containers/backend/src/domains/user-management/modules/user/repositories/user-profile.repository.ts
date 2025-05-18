import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { UserProfile } from '@prisma/client';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère le profil d’un user ou null si inexistant.
   */
  async findByUserId(userId: number): Promise<UserProfile | null> {
    return this.prisma.userProfile.findUnique({
      where: { userId },
    });
  }

  /**
   * Crée ou met à jour le profil pour un user.
   */
  async upsert(
    userId: number,
    data: {
      bio?: string;
      twitterUrl?: string;
      linkedInUrl?: string;
      facebookUrl?: string;
      bannerUrl?: string;
    },
  ): Promise<UserProfile> {
    return this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: { ...data },
    });
  }
}
