import { Injectable, Inject } from '@nestjs/common';
import { IStorageAdapter } from '../interfaces/storage-adapter.interface';
import { Readable } from 'stream';

/**
 * Service de stockage centralisé.
 *
 * Ce service délègue les opérations de stockage à l'adapter injecté, 
 * permettant ainsi de facilement remplacer l'implémentation locale par un adapter cloud.
 *
 * @class StorageService
 * @category Core
 * @subcategory Modules - Storage
 */
@Injectable()
export class StorageService {
  /**
   * Crée une instance de StorageService.
   *
   * @param storageAdapter - Instance de l'adapter de stockage injecté.
   */
  constructor(
    @Inject('IStorageAdapter') private readonly storageAdapter: IStorageAdapter,
  ) {}

  /**
   * Upload d'un fichier vers le stockage.
   *
   * @param filePath - Chemin local du fichier.
   * @param destination - Chemin de destination dans le stockage.
   * @returns Une promesse qui se résout en renvoyant l'URL publique du fichier uploadé.
   */
  async uploadFile(filePath: string, destination: string): Promise<string> {
    return this.storageAdapter.uploadFile(filePath, destination);
  }

  /**
   * Suppression d'un fichier du stockage.
   *
   * @param fileName - Nom ou chemin relatif du fichier à supprimer.
   * @returns Une promesse résolue lorsque l'opération est terminée.
   */
  async deleteFile(fileName: string): Promise<void> {
    return this.storageAdapter.deleteFile(fileName);
  }

  /**
   * Lecture d'un fichier depuis le stockage.
   *
   * @param path - Chemin (clé) du fichier dans le stockage.
   * @returns Flux de lecture et taille du fichier.
   */
  async readFileStream(path: string): Promise<{ stream: Readable; size: number }> {
    return this.storageAdapter.readFileStream(path);
  }
}
