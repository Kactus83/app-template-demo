import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { Template } from '@prisma/client';

/**
 * Accès base de données pour les templates CLI et leur historique.
 * @category Domains/Demo
 */
@Injectable()
export class TemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère tous les templates, triés par date de création.
   */
  async findAll(): Promise<Template[]> {
    return this.prisma.template.findMany({ orderBy: { createdAt: 'asc' } });
  }

  /**
   * Récupère les templates "achetés"/liés à un utilisateur.
   * @param userId ID interne de l’utilisateur.
   */
  async findUserTemplates(userId: number): Promise<Template[]> {
    return this.prisma.template.findMany({
      where: { userTemplates: { some: { userId } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Upsert du compteur de téléchargement pour un user/template.
   * @param userId ID interne de l’utilisateur.
   * @param templateId ID du template.
   */
  async incrementDownloadCount(userId: number, templateId: number): Promise<void> {
    await this.prisma.userTemplate.upsert({
      where: { userId_templateId: { userId, templateId } },
      update: { downloadCount: { increment: 1 } },
      create: { userId, templateId, downloadCount: 1 },
    });
  }

  /**
   * Statistiques globales : total téléchargements par template.
   */
  async statsAllTemplates(): Promise<{ templateId: number; total: number }[]> {
    const rows = await this.prisma.userTemplate.groupBy({
      by: ['templateId'],
      _sum: { downloadCount: true },
    });
    return rows.map(r => ({ templateId: r.templateId, total: r._sum.downloadCount! }));
  }

  /**
   * Statistiques détaillées : par utilisateur pour un template donné.
   * @param templateId ID du template.
   */
  async statsForTemplate(templateId: number): Promise<{ userId: number; count: number }[]> {
    const rows = await this.prisma.userTemplate.findMany({
      where: { templateId },
      select: { userId: true, downloadCount: true },
    });
    return rows.map(r => ({ userId: r.userId, count: r.downloadCount }));
  }


  /**
   * Crée un nouveau template.
   * @param data Données du template à persister, 
   *             incluant la clé interne (filePath) et l’URL publique (publicUrl).
   */
  async createTemplate(data: {
    name: string;
    description?: string | null;
    filePath: string;
    publicUrl: string;
    size: number;
  }): Promise<Template> {
    return this.prisma.template.create({
      data: {
        name:        data.name,
        description: data.description,
        filePath:    data.filePath,
        publicUrl:   data.publicUrl,
        size:        data.size,
      },
    });
  }
}
