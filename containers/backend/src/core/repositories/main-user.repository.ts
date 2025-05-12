import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { UserWithRelations } from '../models/types/userWithRelations.type';

/**
 * Repository principal pour les opérations liées aux utilisateurs.
 * @category Core
 * @category Repositories
 */
@Injectable()
export class MainUserRepository {
  private readonly logger = new Logger(MainUserRepository.name);
  constructor(private readonly prisma: PrismaService) {
    this.logger.log('MainUserRepository loaded');
  }

  /**
   * Recherche un utilisateur avec les relations spécifiées par son ID.
   * @param userId ID de l'utilisateur
   * @returns L'utilisateur avec ses relations ou null si non trouvé
   */
  async findUserById(userId: number): Promise<UserWithRelations | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        web3Accounts: true,
        oauthAccounts: true,
        authenticator: true,
        phones: true,
        userAuthMethods: true,
        MFATokens: true,
        emailMFAToken: true,
        MFANonces: true,
        notifications: true,
        messages: true,
        oauthMFATokens: true,
        connectionHistories: true,
        passwordHistories: true,
        authMethodsHistories: true,
      },
    });
  }
}