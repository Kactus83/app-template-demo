import { Module } from '@nestjs/common';
import { NavigationController } from './controllers/navigation.controller';
import { NavigationService } from './services/navigation.service';
import { NavigationRepository } from './repositories/navigation.repository';
import { PrismaService } from '../../../../core/services/prisma.service';

/**
 * @module NavigationModule
 * @description
 * Module de gestion de la navigation du frontend de l'application.
 * Fournit les fonctionnalités pour récupérer et mettre à jour les données de navigation.
 */
@Module({
  controllers: [NavigationController],
  providers: [NavigationService, NavigationRepository, PrismaService],
  exports: [NavigationService],
})
export class NavigationModule {
  constructor() {
    console.log('NavigationModule loaded');
  }
}
