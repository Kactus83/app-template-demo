import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CommunicationService } from './communication.service';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MessagesModule } from './modules/messages/messages.module';

/**
 * @domain CommunicationDomain
 * @description
 * Domaine de communication.
 * Regroupe les fonctionnalités liées aux notifications et aux messages,
 * et expose un service central (CommunicationService) permettant aux autres domaines
 * de générer des notifications ou des messages à destination de l'utilisateur.
 */
@Module({
  imports: [
    RouterModule.register([
      {
        path: 'communication',
        module: CommunicationDomain,
        children: [
          { path: 'notifications', module: NotificationsModule },
          { path: 'messages', module: MessagesModule },
        ],
      },
    ]),
    NotificationsModule,
    MessagesModule,
  ],
  providers: [CommunicationService],
  exports: [CommunicationService],
})
export class CommunicationDomain {}
