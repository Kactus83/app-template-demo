import { IStorageAdapter } from '../interfaces/storage-adapter.interface';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const copyFile = promisify(fs.copyFile);

/**
 * Adapter de stockage local.
 *
 * Cette implémentation utilise le système de fichiers local pour gérer l'upload et la suppression.
 * Elle est adaptée pour un usage standalone (par exemple, en démo), et permet d'ajouter ultérieurement un adapter cloud.
 *
 * @class LocalStorageAdapter
 * @implements {IStorageAdapter}
 * @category Core
 * @subcategory Modules - Storage
 */
@Injectable()
export class LocalStorageAdapter implements IStorageAdapter {
  private readonly logger = new Logger(LocalStorageAdapter.name);

  /**
   * Répertoire de base pour le stockage local.
   * Peut être configuré via la variable d'environnement LOCAL_STORAGE_PATH.
   */
  private readonly baseDir = process.env.LOCAL_STORAGE_PATH || path.join(__dirname, '../../../uploads');

  /**
   * Upload d'un fichier vers le stockage local.
   *
   * @param filePath - Chemin local du fichier à uploader.
   * @param destination - Chemin de destination (par exemple, 'avatars/mon-fichier.png').
   * @returns Une promesse qui se résout en renvoyant l'URL relative du fichier uploadé.
   */
  async uploadFile(filePath: string, destination: string): Promise<string> {
    try {
      const destPath = path.join(this.baseDir, destination);
      await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
      await copyFile(filePath, destPath);
      // L'URL relative sera exposée via votre ServeStaticModule.
      return `/uploads/${destination}`;
    } catch (error) {
      this.logger.error('Erreur lors de l’upload du fichier en stockage local', error);
      throw error;
    }
  }

  /**
   * Suppression d'un fichier du stockage local.
   *
   * @param fileName - Nom ou chemin relatif du fichier à supprimer.
   * @returns Une promesse résolue une fois le fichier supprimé.
   */
  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = path.join(this.baseDir, fileName);
      await fs.promises.unlink(filePath);
    } catch (error) {
      this.logger.error('Erreur lors de la suppression du fichier en stockage local', error);
      throw error;
    }
  }
}
