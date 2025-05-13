import { Injectable, Logger } from '@nestjs/common';
import {
  AuthenticationMethod,
  ConnectionHistory,
} from '@prisma/client';
import { ConnectionHistoryRepository } from '../repositories/connection-history.repository';

@Injectable()
export class ConnectionHistoryService {
  private readonly logger = new Logger(ConnectionHistoryService.name);

  constructor(private readonly repo: ConnectionHistoryRepository) {}

  /**
   * Enregistre une nouvelle tentative de connexion (réussie ou échouée).
   * @param userId ID de l’utilisateur
   * @param method Méthode d’authentification utilisée
   * @param success Indique si la tentative a réussi
   * @param ipAddress Adresse IP du client
   * @param userAgent User-Agent du client (optionnel)
   * @param location Localisation géographique (optionnel)
   * @param meta Métadonnées additionnelles (optionnel)
   * @returns L’enregistrement créé
   */
  async recordAttempt(params: {
    userId: number;
    method: AuthenticationMethod;
    success: boolean;
    ipAddress: string;
    userAgent?: string;
    location?: string;
    meta?: any;
  }): Promise<ConnectionHistory> {
    this.logger.log(
      `Record attempt for user ${params.userId}: ` +
      `method=${params.method} success=${params.success}`
    );
    return this.repo.create({
      userId: params.userId,
      method: params.method,
      success: params.success,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      location: params.location,
      meta: params.meta,
    });
  }

  /**
   * Met à jour la date de dernière activité d’une session.
   * @param historyId ID de l’entrée ConnectionHistory
   * @param lastActivity Nouvel horodatage de dernière activité
   * @returns L’enregistrement mis à jour
   */
  async touchSession(historyId: number, lastActivity: Date = new Date()): Promise<ConnectionHistory> {
    this.logger.log(`Update lastActivity for history ${historyId}`);
    return this.repo.updateLastActivity(historyId, lastActivity);
  }

  /**
   * Récupère l’historique de connexion d’un utilisateur.
   * @param userId ID de l’utilisateur
   * @param opts Options de filtre et pagination
   */
  async getHistory(
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
    this.logger.log(`Fetching connection history for user ${userId}`);
    return this.repo.findByUser(userId, opts);
  }

  /**
   * Supprime toutes les entrées d’historique antérieures à une date donnée.
   * @param date Seules les entrées créées avant cette date seront supprimées
   */
  async pruneOlderThan(date: Date): Promise<void> {
    this.logger.log(`Pruning connection history older than ${date.toISOString()}`);
    await this.repo.deleteOlderThan(date);
  }
}