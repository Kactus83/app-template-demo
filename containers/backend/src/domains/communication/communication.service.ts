import { Injectable } from '@nestjs/common';
import { Notification, Message } from '@prisma/client';
import { ICommunicationDomain } from './ICommunicationDomain';
import { MessagesService } from './modules/messages/services/messages.service';
import { NotificationService } from './modules/notifications/services/notification.service';
import { CreateNotificationDto } from './modules/notifications/models/dto/createNotification.dto';
import { CreateMessageDto } from './modules/messages/models/dto/createMessage.dto';

@Injectable()
export class CommunicationService implements ICommunicationDomain {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly notificationService: NotificationService,
  ) {}

  // Méthodes de notification
  async createNotification(userId: number, createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationService.createNotification(userId, createNotificationDto);
  }

  async notifyAllUsers(createNotificationDto: CreateNotificationDto): Promise<number> {
    return this.notificationService.notifyAllUsers(createNotificationDto);
  }

  // Méthodes de message
  async createMessage(userId: number, messageData: CreateMessageDto): Promise<Message> {
    return this.messagesService.createMessage(userId, messageData);
  }

  async sendMessageToAllUsers(messageData: Omit<Message, 'id' | 'userId' | 'time'>): Promise<number> {
    return this.messagesService.sendMessageToAllUsers(messageData);
  }
}