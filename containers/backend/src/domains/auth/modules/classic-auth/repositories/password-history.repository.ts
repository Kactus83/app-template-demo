import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import {
  PasswordHistory,
  ChangeInitiator,
  PasswordChangeReason,
} from '@prisma/client';

@Injectable()
export class PasswordHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée une entrée d’historique de mot de passe.
   * @param data Données du changement de mot de passe.
   * @returns L’enregistrement PasswordHistory créé.
   */
  async create(data: {
    userId: number;
    password: string;
    changedBy: ChangeInitiator;
    reason: PasswordChangeReason;
    ipAddress?: string;
    meta?: any;
  }): Promise<PasswordHistory> {
    return this.prisma.passwordHistory.create({
      data: {
        userId: data.userId,
        password: data.password,
        changedBy: data.changedBy,
        reason: data.reason,
        ipAddress: data.ipAddress ?? null,
        meta: data.meta ?? null,
      },
    });
  }

  /**
   * Récupère l’historique des mots de passe pour un utilisateur.
   * @param userId ID de l’utilisateur.
   * @param opts Options de filtre et pagination.
   * @returns Liste des PasswordHistory correspondants.
   */
  async findByUser(
    userId: number,
    opts?: {
      skip?: number;
      take?: number;
      dateFrom?: Date;
      dateTo?: Date;
    },
  ): Promise<PasswordHistory[]> {
    const where: any = { userId };
    if (opts?.dateFrom || opts?.dateTo) {
      where.timestamp = {};
      if (opts.dateFrom) where.timestamp.gte = opts.dateFrom;
      if (opts.dateTo) where.timestamp.lte = opts.dateTo;
    }
    return this.prisma.passwordHistory.findMany({
      where,
      skip: opts?.skip,
      take: opts?.take,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Supprime tous les historiques de mot de passe antérieurs à une date donnée.
   * @param date Seules les entrées créées avant cette date seront supprimées.
   */
  async deleteOlderThan(date: Date): Promise<void> {
    await this.prisma.passwordHistory.deleteMany({
      where: { timestamp: { lt: date } },
    });
  }
}
