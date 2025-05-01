import { CreateNotificationDto } from '../dto/createNotification.dto';
import { Notification } from '@prisma/client';

export interface INotificationsModule {
  createNotification(userId: number, createNotificationDto: CreateNotificationDto): Promise<Notification>;
  notifyAllUsers(createNotificationDto: CreateNotificationDto): Promise<number>;
}