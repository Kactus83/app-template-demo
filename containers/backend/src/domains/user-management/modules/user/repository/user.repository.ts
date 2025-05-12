import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { UserWithRelations } from '../../../../../core/models/types/userWithRelations.type';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Trouve un utilisateur par son ID.
   * @param id Identifiant de l'utilisateur.
   * @returns L'utilisateur avec ses relations ou null s'il n'existe pas.
   */
  async findById(id: number): Promise<UserWithRelations | null> {
    return this.prisma.user.findUnique({
      where: { id },
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

  /**
   * Met à jour un utilisateur.
   * @param id ID de l'utilisateur à mettre à jour.
   * @param userData Données de mise à jour.
   * @returns L'utilisateur mis à jour avec ses relations ou null s'il n'existe pas.
   */
  async update(id: number, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<UserWithRelations | null> {
    return this.prisma.user.update({
      where: { id },
      data: userData,
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