import { Module } from '@nestjs/common';
import { PrismaService } from '../../../../core/services/prisma.service';
import { MessagesController } from './controllers/messages.controller';
import { MessagesService } from './services/messages.service';
import { MessagesRepository } from './repositories/messages.repository';

/**
 * @module MessagesModule
 * @description
 * Module dédié à la gestion des messages utilisateurs (CRUD, marquage, etc.).
 * Déclare le MessagesController pour exposer les endpoints, le MessagesService
 * pour la logique métier et le MessagesRepository pour l'accès aux données via Prisma.
 */
@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository, PrismaService],
  exports: [MessagesService],
})
export class MessagesModule {}
