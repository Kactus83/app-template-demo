import { Injectable } from '@nestjs/common';
import { Version } from '@prisma/client';
import { PrismaService } from '../../../../../core/services/prisma.service';

@Injectable()
export class VersionRepository {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Récupère la première version stockée dans la base de données.
   * @returns La version ou null si elle n'existe pas.
   */
  async getVersion(): Promise<Version | null> {
    return this.prisma.version.findFirst();
  }

  /**
   * Crée une nouvelle entrée de version dans la base de données.
   * @param versionData Données de la nouvelle version.
   * @returns La version créée.
   */
  async createVersion(versionData: { backend: string; frontend: string }): Promise<Version> {
    return this.prisma.version.create({
      data: versionData,
    });
  }

  /**
   * Met à jour la version existante dans la base de données.
   * @param versionData Données de version à mettre à jour.
   * @returns La version mise à jour.
   */
  async updateVersion(versionData: { backend?: string; frontend?: string }): Promise<Version> {
    return this.prisma.version.update({
      where: { id: 1 }, // Supposition qu'il n'y a qu'une seule entrée
      data: versionData,
    });
  }
}
