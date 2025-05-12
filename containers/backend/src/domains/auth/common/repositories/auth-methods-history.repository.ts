import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/services/prisma.service';
import {
  AuthMethodsHistory,
  AuthMethodsHistoryType,
  AuthMethodAction,
  ChangeInitiator,
} from '@prisma/client';

@Injectable()
export class AuthMethodsHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée une entrée d’historique de méthode d’authentification.
   * @param data Données de l’opération sur la méthode d’auth.
   * @returns L’enregistrement AuthMethodsHistory créé.
   */
  async create(data: {
    userId: number;
    type: AuthMethodsHistoryType;
    value: string;
    action: AuthMethodAction;
    performedBy: ChangeInitiator;
    meta?: any;
  }): Promise<AuthMethodsHistory> {
    return this.prisma.authMethodsHistory.create({
      data: {
        userId: data.userId,
        type: data.type,
        value: data.value,
        action: data.action,
        performedBy: data.performedBy,
        meta: data.meta ?? null,
      },
    });
  }

  /**
   * Récupère l’historique des méthodes d’authentification pour un utilisateur.
   * @param userId ID de l’utilisateur.
   * @param opts Options de filtre et pagination.
   * @returns Liste des AuthMethodsHistory correspondants.
   */
  async findByUser(
    userId: number,
    opts?: {
      type?: AuthMethodsHistoryType;
      action?: AuthMethodAction;
      skip?: number;
      take?: number;
      dateFrom?: Date;
      dateTo?: Date;
    },
  ): Promise<AuthMethodsHistory[]> {
    const where: any = { userId };
    if (opts?.type) where.type = opts.type;
    if (opts?.action) where.action = opts.action;
    if (opts?.dateFrom || opts?.dateTo) {
      where.timestamp = {};
      if (opts.dateFrom) where.timestamp.gte = opts.dateFrom;
      if (opts.dateTo) where.timestamp.lte = opts.dateTo;
    }
    return this.prisma.authMethodsHistory.findMany({
      where,
      skip: opts?.skip,
      take: opts?.take,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Supprime tous les historiques de méthodes antérieurs à une date donnée.
   * @param date Seules les entrées créées avant cette date seront supprimées.
   */
  async deleteOlderThan(date: Date): Promise<void> {
    await this.prisma.authMethodsHistory.deleteMany({
      where: { timestamp: { lt: date } },
    });
  }
}
