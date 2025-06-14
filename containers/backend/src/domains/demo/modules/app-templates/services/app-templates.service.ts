import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { TemplateRepository } from '../repositories/template.repository';
import { StorageService } from 'src/core/modules/storage/services/storage.service';
import { TemplateDto } from '../models/dto/template.dto';
import { CreateTemplateDto } from '../models/dto/create-template.dto';
import { join } from 'path';
import { existsSync, statSync } from 'fs';
import { Readable } from 'stream';

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
      fileName:    'app-template.zip',
      name:        'app-template',
      description: 'Version complète incluant Vault',
    },
    {
      fileName:    'app-template-light.zip',
      name:        'app-template-light',
      description: 'Version allégée sans Vault',
    },
    {
      fileName:    'app-template-light-demo.zip',
      name:        'app-template-light-demo',
      description: 'Version avec contenu de démonstration / backend pour le cli node js',
    },
  ];

  constructor(
    private readonly repo: TemplateRepository,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Seed initial des deux templates, si la table est vide.
   */
  async onModuleInit(): Promise<void> {
    const all = await this.repo.findAll();
    if (all.length > 0) {
      this.logger.log('Templates déjà seedés, skip');
      return;
    }
    this.logger.log('Seed initial des templates CLI…');

    for (const tpl of this.seedFiles) {
      // 1) Source du ZIP dans public/templates
      const sourcePath = join(
        process.cwd(),
        'public',
        'templates',
        tpl.fileName,
      );
      if (!existsSync(sourcePath)) {
        this.logger.error(`Seed introuvable : ${sourcePath}`);
        continue;
      }

      // 2) Taille du fichier
      const size = statSync(sourcePath).size;

      // 3) Clé interne et URL publique
      const filePath  = `templates/${tpl.fileName}`;
      const publicUrl = await this.storageService.uploadFile(
        sourcePath,
        filePath,
      );

      // 4) Persistance en base
      await this.repo.createTemplate({
        name:        tpl.name,
        description: tpl.description,
        filePath,    // clé interne
        publicUrl,   // URL exposée
        size,
      });

      this.logger.log(`– Seeded '${tpl.name}' → ${publicUrl}`);
    }
  }

  /**
   * Liste *tous* les templates (avec leur URL publique).
   */
  async listTemplates(): Promise<TemplateDto[]> {
    const all = await this.repo.findAll();
    return all.map(t => ({
      id:          t.id,
      name:        t.name,
      description: t.description,
      publicUrl:   t.publicUrl,
    }));
  }

  /**
   * Liste les templates « attribués » à l’utilisateur courant.
   * @param userId ID interne de l’utilisateur.
   */
  async listUserTemplates(userId: number): Promise<TemplateDto[]> {
    const list = await this.repo.findUserTemplates(userId);
    return list.map(t => ({
      id:          t.id,
      name:        t.name,
      description: t.description,
      publicUrl:   t.publicUrl,
    }));
  }

  /**
   * Prépare le flux de téléchargement du ZIP,
   * incrémente le compteur pour ce user/template.
   * @param userId ID interne de l’utilisateur.
   * @param templateId ID interne du template.
   * @throws NotFoundException si le template ou le fichier n’existe pas.
   */
  async getTemplateFile(
    userId: number,
    templateId: number,
  ): Promise<{ fileName: string; size: number; stream: Readable }> {
    // 1) Récupération du template
    const tpl = (await this.repo.findAll()).find(t => t.id === templateId);
    if (!tpl) {
      throw new NotFoundException(`Template id=${templateId} introuvable`);
    }

    // 2) Incrément du compteur
    await this.repo.incrementDownloadCount(userId, templateId);

    // 3) Lecture du fichier via le StorageService
    //    (implémentation ci-dessous)
    const { stream, size } = await this.storageService.readFileStream(
      tpl.filePath,
    );

    return {
      fileName: `${tpl.name}.zip`,
      size,
      stream,
    };
  }

  /**
   * Statistiques globales de téléchargements pour tous les templates.
   */
  async getAllStats(): Promise<{ templateId: number; total: number }[]> {
    return this.repo.statsAllTemplates();
  }

  /**
   * Statistiques détaillées des téléchargements pour un template donné.
   * @param templateId ID du template.
   */
  async getStatsFor(
    templateId: number,
  ): Promise<{ userId: number; count: number }[]> {
    return this.repo.statsForTemplate(templateId);
  }

  /**
   * Création d’un template (admins).
   * @param dto données de création (name, description).
   * @param file fichier ZIP uploadé par multer.
   */
  async createTemplate(
    dto: CreateTemplateDto,
    file: any, // type multer.File
  ): Promise<TemplateDto> {
    // 1) Copie du tmp → /uploads/templates/…
    const filePath  = `templates/${file.filename}`;
    const publicUrl = await this.storageService.uploadFile(
      file.path,
      filePath,
    );

    // 2) Persistance en base
    const tpl = await this.repo.createTemplate({
      name:        dto.name,
      description: dto.description ?? null,
      filePath,
      publicUrl,
      size:        file.size,
    });

    return {
      id:          tpl.id,
      name:        tpl.name,
      description: tpl.description,
      publicUrl:   tpl.publicUrl,
    };
  }
}
