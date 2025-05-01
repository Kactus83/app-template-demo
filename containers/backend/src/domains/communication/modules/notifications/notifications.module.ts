import { Module } from '@nestjs/common';
import { PrismaService } from '../../../../core/services/prisma.service';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { NotificationRepository } from './repositories/notification.repository';

/**
 * @module NotificationsModule
 * @description
 * Module dédié à la gestion des notifications (CRUD, marquage en lu, etc.).
 * Déclare le NotificationController pour exposer les endpoints, le NotificationService
 * pour la logique métier et le NotificationRepository pour l'accès aux données via Prisma.
 */
@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, PrismaService],
  exports: [NotificationService],
})
export class NotificationsModule {}
