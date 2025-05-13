import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserServiceAccountRepository } from '../repositories/user-service-account.repository';
import { CreateServiceAccountDto } from '../models/dto/create-service-account.dto';
import { UpdateServiceAccountDto } from '../models/dto/update-service-account.dto';
import { ServiceAccountDto } from '../models/dto/service-account.dto';

/**
 * Service de gestion des comptes de service (UserServiceAccount)
 * - Création, lecture, mise à jour, révocation, rotation de secret
 * @category Domains/Auth
 */
@Injectable()
export class ServiceAccountsManagementService {
  private static readonly SECRET_LENGTH = 32;

  constructor(private readonly repo: UserServiceAccountRepository) {}

  /**
   * Crée un nouveau compte de service pour un utilisateur.
   * @param userId ID interne de l’utilisateur “maître”
   * @param dto Données de création (nom, validTo, allowedIps, scopes)
   * @returns DTO du compte créé + secret brut à fournir une seule fois au client
   */
  async create(
    userId: number,
    dto: CreateServiceAccountDto,
  ): Promise<ServiceAccountDto & { clientSecret: string }> {
    const clientId = randomBytes(16).toString('hex');
    const clientSecret = randomBytes(ServiceAccountsManagementService.SECRET_LENGTH).toString('hex');
    const clientSecretHash = await bcrypt.hash(clientSecret, 10);

    const account = await this.repo.create({
      userId,
      name: dto.name,
      clientId,
      clientSecretHash,
      validTo: dto.validTo ? new Date(dto.validTo) : null,
      allowedIps: dto.allowedIps ?? [],
    });

    if (dto.scopes?.length) {
      for (const { target, permission } of dto.scopes) {
        await this.repo.addScope(account.id, target, permission);
      }
    }

    const scopes = await this.repo.listScopes(account.id);
    const accountDto = plainToInstance(ServiceAccountDto, { ...account, scopes });

    return { ...accountDto, clientSecret };
  }

  /**
   * Récupère la liste de tous les comptes de service d’un utilisateur.
   * @param userId ID interne de l’utilisateur
   */
  async list(userId: number): Promise<ServiceAccountDto[]> {
    const accounts = await this.repo.findByUser(userId);
    return Promise.all(
      accounts.map(async (acct) => {
        const scopes = await this.repo.listScopes(acct.id);
        return plainToInstance(ServiceAccountDto, { ...acct, scopes });
      }),
    );
  }

  /**
   * Met à jour un compte de service, y compris la synchronisation des scopes.
   * @param id UUID du compte de service
   * @param dto Données de mise à jour
   */
  async update(
    id: string,
    dto: UpdateServiceAccountDto,
  ): Promise<ServiceAccountDto> {
    // Vérifie que le compte existe
    await this.repo.findById(id);

    // Met à jour les champs simples
    const updated = await this.repo.update(id, {
      name: dto.name,
      validTo: dto.validTo ? new Date(dto.validTo) : undefined,
      allowedIps: dto.allowedIps,
    });

    // Synchronise les scopes
    if (dto.scopes) {
      const current = await this.repo.listScopes(id);

      // Supprime les scopes absents du DTO
      for (const cs of current) {
        if (!dto.scopes.some((s) => s.target === cs.target && s.permission === cs.permission)) {
          await this.repo.removeScope(id, cs.target, cs.permission);
        }
      }
      // Ajoute les nouveaux scopes
      for (const { target, permission } of dto.scopes) {
        if (!current.some((cs) => cs.target === target && cs.permission === permission)) {
          await this.repo.addScope(id, target, permission);
        }
      }
    }

    const scopes = await this.repo.listScopes(id);
    return plainToInstance(ServiceAccountDto, { ...updated, scopes });
  }

  /**
   * Révoque (supprime) un compte de service.
   * @param id UUID du compte de service
   */
  async revoke(id: string): Promise<void> {
    // lancera NotFoundException si absent
    await this.repo.findById(id);
    await this.repo.delete(id);
  }

  /**
   * Fait tourner le secret d’un compte de service et retourne le nouveau secret brut.
   * @param id UUID du compte de service
   */
  async rotateSecret(id: string): Promise<{ clientSecret: string }> {
    const clientSecret = randomBytes(ServiceAccountsManagementService.SECRET_LENGTH).toString('hex');
    const clientSecretHash = await bcrypt.hash(clientSecret, 10);
    await this.repo.update(id, { clientSecretHash });
    return { clientSecret };
  }
}
