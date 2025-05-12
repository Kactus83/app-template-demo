import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/services/prisma.service';
import {
  ConnectionHistory,
  AuthenticationMethod,
} from '@prisma/client';

@Injectable()
export class ConnectionHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée une nouvelle entrée d’historique de connexion.
   * @param data Données de la tentative de connexion.
   * @returns L’enregistrement ConnectionHistory créé.
   */
  async create(data: {
    userId: number;
    ipAddress: string;
    userAgent?: string;
    success: boolean;
    method: AuthenticationMethod;
    location?: string;
    meta?: any;
  }): Promise<ConnectionHistory> {
    return this.prisma.connectionHistory.create({
      data: {
        userId: data.userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent ?? null,
        success: data.success,
        method: data.method,
        location: data.location ?? null,
        meta: data.meta ?? null,
        lastActivity: new Date(),
      },
    });
  }

  /**
   * Met à jour la date de dernière activité pour une session existante.
   * @param id Identifiant de l’enregistrement ConnectionHistory.
   * @param lastActivity Nouvelle date de dernière activité.
   * @returns L’enregistrement mis à jour.
   */
  async updateLastActivity(
    id: number,
    lastActivity: Date,
  ): Promise<ConnectionHistory> {
    return this.prisma.connectionHistory.update({
      where: { id },
      data: { lastActivity },
    });
  }

  /**
   * Récupère l’historique de connexion pour un utilisateur donné.
   * @param userId ID de l’utilisateur.
   * @param opts Options de filtre et pagination.
   * @returns Liste des ConnectionHistory correspondants.
   */
  async findByUser(
    userId: number,
    opts?: {
      skip?: number;
      take?: number;
      success?: boolean;
      method?: AuthenticationMethod;
      dateFrom?: Date;
      dateTo?: Date;
    },
  ): Promise<ConnectionHistory[]> {
    const where: any = { userId };
    if (opts?.success !== undefined) where.success = opts.success;
    if (opts?.method) where.method = opts.method;
    if (opts?.dateFrom || opts?.dateTo) {
      where.createdAt = {};
      if (opts.dateFrom) where.createdAt.gte = opts.dateFrom;
      if (opts.dateTo) where.createdAt.lte = opts.dateTo;
    }
    return this.prisma.connectionHistory.findMany({
      where,
      skip: opts?.skip,
      take: opts?.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Supprime toutes les entrées d’historique antérieures à une date donnée.
   * @param date Seules les entrées créées avant cette date seront supprimées.
   */
  async deleteOlderThan(date: Date): Promise<void> {
    await this.prisma.connectionHistory.deleteMany({
      where: { createdAt: { lt: date } },
    });
  }
}
