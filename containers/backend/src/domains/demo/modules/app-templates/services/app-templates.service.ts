import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { TemplateRepository } from '../repositories/template.repository';
import { join } from 'path';
import { existsSync, statSync, createReadStream } from 'fs';
import { Readable } from 'stream';
import { TemplateDto } from '../models/dto/template.dto';
import { CreateTemplateDto } from '../models/dto/create-template.dto';
import { StorageService } from 'src/core/modules/storage/services/storage.service';

/**
 * Logique métier pour la démo CLI :
 * - seed initial
 * - listing, téléchargement, stats
 * - création via StorageService
 * @category Domains/Demo
 */
@Injectable()
export class AppTemplatesService implements OnModuleInit {
  private readonly logger = new Logger(AppTemplatesService.name);

  /** fichiers ZIP à seed */
  private readonly seedFiles = [
    {
      fileName: 'app-template.zip',
      name: 'app-template',
      description: 'Version complète incluant Vault',
    },
    {
      fileName: 'app-template-light.zip',
      name: 'app-template-light',
      description: 'Version allégée sans Vault',
    },
  ];

  constructor(
    private readonly repo: TemplateRepository,
    private readonly storageService: StorageService,
  ) {}

  /** Seed initial des deux templates */
  async onModuleInit(): Promise<void> {
    const all = await this.repo.findAll();
    if (all.length > 0) {
      this.logger.log('Templates déjà seedés, skip');
      return;
    }
    this.logger.log('Seed initial des templates CLI…');
    for (const tpl of this.seedFiles) {
      const fullPath = join(process.cwd(), 'public', 'templates', tpl.fileName);
      if (!existsSync(fullPath)) {
        this.logger.error(`Seed introuvable : ${fullPath}`);
        continue;
      }
      const size = statSync(fullPath).size;
      // on utilise StorageService pour copier dans storage (uploads/templates)
      const dest = `templates/${tpl.fileName}`;
      const url = await this.storageService.uploadFile(fullPath, dest);
      await this.repo.createTemplate({
        name: tpl.name,
        description: tpl.description,
        filePath: url,
        size,
      });
      this.logger.log(`– Seeded '${tpl.name}' → ${url}`);
    }
  }

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

  /**
   * Création d’un template (admins).
   * @param dto nom + description
   * @param file ZIP uploadé par multer (temporaire)
   */
  async createTemplate(
    dto: CreateTemplateDto,
    file: any, // MulterFile pose des soucis de typage mais c'est pourtant le type réel.
  ): Promise<TemplateDto> {
    // 1. Upload via StorageService dans /uploads/templates
    const dest = `templates/${file.filename}`;
    const url = await this.storageService.uploadFile(file.path, dest);

    // 2. Persist
    const tpl = await this.repo.createTemplate({
      name: dto.name,
      description: dto.description ?? null,
      filePath: url,
      size: file.size,
    });

    return {
      id: tpl.id,
      name: tpl.name,
      description: tpl.description,
    };
  }
}