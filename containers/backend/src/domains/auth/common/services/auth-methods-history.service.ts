import { Injectable } from '@nestjs/common';
import { AuthMethodsHistoryRepository } from '../repositories/auth-methods-history.repository';
import {
  AuthMethodsHistoryType,
  AuthMethodAction,
  ChangeInitiator,
} from '@prisma/client';

/**
 * Service dédié à l’historisation des opérations sur les méthodes d’authentification
 * (ajout, suppression d’email, téléphone, wallet, etc.).
 */
@Injectable()
export class AuthMethodsHistoryService {
  constructor(
    private readonly historyRepo: AuthMethodsHistoryRepository,
  ) {}

  /**
   * Enregistre l’ajout d’une méthode d’authentification pour un utilisateur.
   *
   * @param userId     ID de l’utilisateur
   * @param type       Type de la méthode (EMAIL, PHONE, WALLET)
   * @param value      Valeur associée (adresse email, numéro de téléphone, adresse de wallet)
   * @param performedBy Qui a effectué l’opération (SELF ou ADMIN)
   * @param meta       Données additionnelles facultatives (e.g. provider pour OAuth)
   */
  async recordAddition(
    userId: number,
    type: AuthMethodsHistoryType,
    value: string,
    performedBy: ChangeInitiator,
    meta?: Record<string, any>,
  ) {
    await this.historyRepo.create({
      userId,
      type,
      value,
      action: AuthMethodAction.ADDED,
      performedBy,
      meta,
    });
  }

  /**
   * Enregistre la suppression d’une méthode d’authentification pour un utilisateur.
   *
   * @param userId     ID de l’utilisateur
   * @param type       Type de la méthode (EMAIL, PHONE, WALLET)
   * @param value      Valeur associée supprimée
   * @param performedBy Qui a effectué l’opération (SELF ou ADMIN)
   * @param meta       Données additionnelles facultatives
   */
  async recordRemoval(
    userId: number,
    type: AuthMethodsHistoryType,
    value: string,
    performedBy: ChangeInitiator,
    meta?: Record<string, any>,
  ) {
    await this.historyRepo.create({
      userId,
      type,
      value,
      action: AuthMethodAction.REMOVED,
      performedBy,
      meta,
    });
  }

  /**
   * Récupère l’historique des méthodes d’authentification d’un utilisateur.
   *
   * @param userId ID de l’utilisateur
   * @param opts   Options de filtre et pagination
   * @returns      Liste paginée d’entrées d’historique
   */
  async getHistory(
    userId: number,
    opts?: {
      type?: AuthMethodsHistoryType;
      action?: AuthMethodAction;
      skip?: number;
      take?: number;
      dateFrom?: Date;
      dateTo?: Date;
    },
  ) {
    return this.historyRepo.findByUser(userId, opts);
  }

  /**
   * Supprime les entrées d’historique antérieures à une date donnée.
   *
   * @param date Seules les entrées créées avant cette date seront supprimées
   */
  async purgeOlderThan(date: Date): Promise<void> {
    await this.historyRepo.deleteOlderThan(date);
  }
}
