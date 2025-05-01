import { Module } from '@nestjs/common';
import { VersionController } from './controllers/version.controller';
import { VersionService } from './services/version.service';
import { VersionRepository } from './repositories/version.repository';
import { PrismaService } from '../../../../core/services/prisma.service';

/**
 * @module VersionModule
 * @description
 * Module de gestion de la version de l'application.
 * Expose les endpoints pour récupérer et mettre à jour les versions du backend et du frontend.
 * 
 * Devrait être retravaillé pour ajouter une torisieme version, celle du coeur de métier 
 * qui sera implémenté dans le template, de maniere a différencier l'évolution des versions du backend du template
 * de celle du coeur de metier lui meme.
 */
@Module({
  controllers: [VersionController],
  providers: [VersionRepository, VersionService, PrismaService],
  exports: [VersionService],
})
export class VersionModule {
  constructor() {
    console.log('VersionModule loaded');
  }
}
