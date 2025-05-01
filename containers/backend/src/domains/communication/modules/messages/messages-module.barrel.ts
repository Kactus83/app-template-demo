/**
 * @module MessagesModule
 * @include messages-module.md
 *
 * Ce barrel regroupe les éléments du module de messages du domaine "Communication".
 * Il inclut les contrôleurs, les modèles, les interfaces, les répertoires et les services
 * relatifs aux messages.
 */
export * from './messages.module';
export * from './controllers/messages.controller';
export * from './models/dto/createMessage.dto';
export * from './models/dto/updateMessage.dto';
export * from './models/interfaces/IMessagesModule';
export * from './repositories/messages.repository';
export * from './services/messages.service';
