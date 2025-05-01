import { Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { LocalStorageAdapter } from './adapters/local-storage.adapter';

/**
 * Module de stockage.
 *
 * Ce module regroupe l'ensemble des composants nécessaires à la gestion des fichiers.
 * Il est inclus dans le CoreModule, qui est global, et ne nécessite pas d'être redéclaré globalement.
 *
 * @module StorageModule
 * @category Core
 * @subcategory Modules - Storage
 */
@Module({
  providers: [
    {
      provide: 'IStorageAdapter',
      useClass: LocalStorageAdapter,
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}