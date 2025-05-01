/**
 * @module NotificationsModule
 * @include notifications-module.md
 *
 * Ce barrel regroupe les éléments du module de notifications du domaine "Communication".
 * Il inclut les contrôleurs, les modèles, les interfaces, les répertoires et les services
 * relatifs aux notifications.
 */
export * from './notifications.module';
export * from './controllers/notification.controller';
export * from './models/dto/createNotification.dto';
export * from './models/dto/notification.dto';
export * from './models/dto/updateNotification.dto';
export * from './models/interfaces/INotificationsModule';
export * from './repositories/notification.repository';
export * from './services/notification.service';
