import { Injectable, NotFoundException } from '@nestjs/common';
import { TemplateRepository } from '../repositories/template.repository';
import { join } from 'path';
import { createReadStream, statSync } from 'fs';
import type { Readable } from 'stream';
import { TemplateDto } from '../models/dto/template.dto';

/**
 * Logique métier pour la démo CLI :
 * listing, téléchargement et stats des templates.
 * @category Domains/Demo
 */
@Injectable()
export class AppTemplatesService {
  constructor(private readonly repo: TemplateRepository) {}

  /**
   * Liste l’ensemble des templates.
   */
  async listTemplates(): Promise<TemplateDto[]> {
    const all = await this.repo.findAll();
    return all.map(t => ({ id: t.id, name: t.name, description: t.description }));
  }

  /**
   * Liste les templates attribués à un utilisateur.
   * @param userId ID interne de l’utilisateur.
   */
  async listUserTemplates(userId: number): Promise<TemplateDto[]> {
    const list = await this.repo.findUserTemplates(userId);
    return list.map(t => ({ id: t.id, name: t.name, description: t.description }));
  }

  /**
   * Prépare le flux de téléchargement du ZIP,
   * incrémente le compteur de l’utilisateur.
   * @param userId ID interne de l’utilisateur.
   * @param templateId ID du template.
   * @throws NotFoundException si le template n’existe pas.
   */
  async getTemplateFile(
    userId: number,
    templateId: number,
  ): Promise<{ fileName: string; size: number; stream: Readable }> {
    const tpl = await this.repo.findAll().then(list => list.find(t => t.id === templateId));
    if (!tpl) {
      throw new NotFoundException(`Template id=${templateId} introuvable`);
    }
    await this.repo.incrementDownloadCount(userId, templateId);

    const fullPath = join(process.cwd(), tpl.filePath);
    const stat = await new Promise<{ size: number }>((res, rej) =>
      createReadStream(fullPath)
        .on('open', () => res({ size: statSync(fullPath).size }))
        .on('error', rej),
    );
    return {
      fileName: `${tpl.name}.zip`,
      size: stat.size,
      stream: createReadStream(fullPath),
    };
  }

  /**
   * Récupère les stats globales tous templates confondus.
   */
  async getAllStats(): Promise<{ templateId: number; total: number }[]> {
    return this.repo.statsAllTemplates();
  }

  /**
   * Récupère les stats par utilisateur pour un template.
   * @param templateId ID du template.
   */
  async getStatsFor(templateId: number): Promise<{ userId: number; count: number }[]> {
    return this.repo.statsForTemplate(templateId);
  }
}
