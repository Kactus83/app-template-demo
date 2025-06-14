import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import {
  UserServiceAccount,
  ServiceAccountScope,
  ScopeTarget,
  ScopePermission,
} from '@prisma/client';

@Injectable()
export class UserServiceAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un nouveau compte de service rattaché à un utilisateur.
   * @param data Données de création.
   * @returns Le compte de service créé.
   */
  async create(data: {
    userId: number;
    name: string;
    clientSecretHash: string;
    validFrom?: Date;
    validTo?: Date | null;
    allowedIps?: string[];
  }): Promise<UserServiceAccount> {
    return this.prisma.userServiceAccount.create({
      data: {
        userId: data.userId,
        name: data.name,
        clientSecret: data.clientSecretHash,
        validFrom: data.validFrom ?? undefined,
        validTo: data.validTo ?? null,
        allowedIps: data.allowedIps ?? [],
      },
    });
  }

  /**
   * Récupère un compte de service par son identifiant interne.
   * @param id UUID du compte de service.
   * @returns Le compte de service, ou exception si non trouvé.
   */
  async findById(id: string): Promise<UserServiceAccount> {
    const account = await this.prisma.userServiceAccount.findUnique({ where: { id } });
    if (!account) {
      throw new NotFoundException(`UserServiceAccount with id="${id}" not found`);
    }
    return account;
  }

  /**
   * Récupère un compte de service par son clientId public.
   * @param clientId Identifiant public.
   * @returns Le compte de service, ou exception si non trouvé.
   */
  async findByClientId(clientId: string): Promise<UserServiceAccount> {
    const account = await this.prisma.userServiceAccount.findUnique({ where: { clientId } });
    if (!account) {
      throw new NotFoundException(`UserServiceAccount with clientId="${clientId}" not found`);
    }
    return account;
  }

  /**
   * Liste tous les comptes de service d’un utilisateur.
   * @param userId ID interne de l’utilisateur.
   * @returns Tableau de comptes de service.
   */
  async findByUser(userId: number): Promise<UserServiceAccount[]> {
    return this.prisma.userServiceAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Met à jour les propriétés d’un compte de service.
   * @param id UUID du compte de service.
   * @param data Champs à modifier.
   * @returns Le compte mis à jour.
   */
  async update(
    id: string,
    data: Partial<{
      name: string;
      clientSecretHash: string;
      validFrom: Date;
      validTo: Date | null;
      allowedIps: string[];
    }>,
  ): Promise<UserServiceAccount> {
    return this.prisma.userServiceAccount.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.clientSecretHash !== undefined && { clientSecret: data.clientSecretHash }),
        ...(data.validFrom !== undefined && { validFrom: data.validFrom }),
        ...(data.validTo !== undefined && { validTo: data.validTo }),
        ...(data.allowedIps !== undefined && { allowedIps: data.allowedIps }),
      },
    });
  }

  /**
   * Supprime (révocation) un compte de service.
   * @param id UUID du compte de service.
   */
  async delete(id: string): Promise<void> {
    await this.prisma.userServiceAccount.delete({ where: { id } });
  }

  /**
   * Ajoute un scope (target + permission) à un compte de service.
   * @param accountId UUID du compte.
   * @param target Domaine concerné.
   * @param permission Permission (READ ou WRITE).
   * @returns L’enregistrement de scope ajouté.
   */
  async addScope(
    accountId: string,
    target: ScopeTarget,
    permission: ScopePermission,
  ): Promise<ServiceAccountScope> {
    return this.prisma.serviceAccountScope.create({
      data: { accountId, target, permission },
    });
  }

  /**
   * Supprime un scope attaché à un compte de service.
   * @param accountId UUID du compte.
   * @param target Domaine du scope.
   * @param permission Permission du scope.
   */
  async removeScope(
    accountId: string,
    target: ScopeTarget,
    permission: ScopePermission,
  ): Promise<void> {
    await this.prisma.serviceAccountScope.delete({
      where: { accountId_target_permission: { accountId, target, permission } },
    });
  }

  /**
   * Liste les scopes d’un compte de service.
   * @param accountId UUID du compte.
   * @returns Tableau de scopes.
   */
  async listScopes(accountId: string): Promise<ServiceAccountScope[]> {
    return this.prisma.serviceAccountScope.findMany({ where: { accountId } });
  }
}