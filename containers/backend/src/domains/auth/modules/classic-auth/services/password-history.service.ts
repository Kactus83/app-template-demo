import { Injectable } from '@nestjs/common';
import { PasswordHistoryRepository } from '../repositories/password-history.repository';
import { ChangeInitiator, PasswordChangeReason } from '@prisma/client';
import { IRequestMetadata } from '../../../../../core/models/interfaces/request-metadata.interface';

/**
 * Service dédié à l’enregistrement de l’historique des changements de mot de passe.
 */
@Injectable()
export class PasswordHistoryService {
  constructor(
    private readonly passwordHistoryRepo: PasswordHistoryRepository,
  ) {}

  /**
   * Enregistre dans la table PasswordHistory le hash du mot de passe **avant** sa mise à jour.
   *
   * @param userId       ID de l’utilisateur concerné
   * @param oldPassword  Hash avant mise à jour
   * @param metadata     Métadonnées de la requête (IP, user-agent, timestamp…)
   * @param initiator    Qui a déclenché le changement (SELF, ADMIN)
   * @param reason       Motif du changement (RESET_TOKEN, SELF_SERVICE, ADMIN_RESET)
   */
  async recordPasswordChange(
    userId: number,
    oldPassword: string,
    metadata: IRequestMetadata,
    initiator: ChangeInitiator,
    reason: PasswordChangeReason,
  ) {
    await this.passwordHistoryRepo.create({
      userId,
      password: oldPassword,
      changedBy: initiator,
      reason,
      ipAddress: metadata.network.ipAddress,
      meta: {
        userAgent: metadata.network.userAgent,
        timestamp: metadata.timestamp.toISOString(),
      },
    });
  }
}
