import { Injectable } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationDto } from '../models/dto/createNotification.dto';
import { UpdateNotificationDto } from '../models/dto/updateNotification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  /**
   * Récupère toutes les notifications pour un utilisateur donné.
   * @param userId ID de l'utilisateur.
   * @returns Liste des notifications.
   */
  async getAllNotifications(userId: number): Promise<Notification[]> {
    try {
      return await this.notificationRepository.findAllByUserId(userId);
    } catch (error: any) {
      throw new Error('Failed to retrieve notifications.');
    }
  }

  /**
   * Crée une nouvelle notification pour un utilisateur.
   * @param userId ID de l'utilisateur.
   * @param createNotificationDto Données de la notification à créer.
   * @returns La notification créée.
   */
  async createNotification(userId: number, createNotificationDto: CreateNotificationDto): Promise<Notification> {
    try {
      const notificationData: Omit<Notification, 'id'> = {
        userId,
        title: createNotificationDto.title,
        description: createNotificationDto.description ?? null,
        icon: createNotificationDto.icon ?? null,
        image: createNotificationDto.image ?? null,
        time: createNotificationDto.time,
        link: createNotificationDto.link ?? null,
        useRouter: createNotificationDto.useRouter ?? false,
        read: createNotificationDto.read ?? false,
      };
      return await this.notificationRepository.create(notificationData);
    } catch (error: any) {
      throw new Error('Failed to create notification.');
    }
  }

  /**
   * Envoie une notification à tous les utilisateurs.
   * @param createNotificationDto Données de la notification à créer.
   * @returns Le nombre de notifications envoyées.
   */
  async notifyAllUsers(createNotificationDto: CreateNotificationDto): Promise<number> {
    try {
      const notificationData: Omit<Notification, 'id' | 'userId'> = {
        title: createNotificationDto.title,
        description: createNotificationDto.description ?? null,
        icon: createNotificationDto.icon ?? null,
        image: createNotificationDto.image ?? null,
        time: createNotificationDto.time,
        link: createNotificationDto.link ?? null,
        useRouter: createNotificationDto.useRouter ?? false,
        read: createNotificationDto.read ?? false,
      };

      return await this.notificationRepository.createForAllUsers(notificationData);
    } catch (error: any) {
      throw new Error('Failed to send notification to all users.');
    }
  }

  /**
   * Met à jour une notification existante.
   * @param id ID de la notification.
   * @param updateNotificationDto Données de mise à jour.
   * @returns La notification mise à jour.
   */
  async updateNotification(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    try {
      const updateData: Partial<Omit<Notification, 'id' | 'userId'>> = {
        title: updateNotificationDto.title,
        description: updateNotificationDto.description ?? null,
        icon: updateNotificationDto.icon ?? null,
        image: updateNotificationDto.image ?? null,
        time: updateNotificationDto.time ?? undefined, // Si non fourni, ne pas mettre à jour
        link: updateNotificationDto.link ?? null,
        useRouter: updateNotificationDto.useRouter ?? undefined,
        read: updateNotificationDto.read ?? undefined,
      };
      return await this.notificationRepository.update(id, updateData);
    } catch (error: any) {
      throw new Error('Failed to update notification.');
    }
  }

  /**
   * Supprime une notification.
   * @param id ID de la notification.
   * @returns La notification supprimée.
   */
  async deleteNotification(id: number): Promise<Notification> {
    try {
      return await this.notificationRepository.delete(id);
    } catch (error: any) {
      throw new Error('Failed to delete notification.');
    }
  }

  /**
   * Marque toutes les notifications d'un utilisateur comme lues.
   * @param userId ID de l'utilisateur.
   * @returns Nombre de notifications mises à jour.
   */
  async markAllAsRead(userId: number): Promise<number> {
    try {
      return await this.notificationRepository.markAllAsRead(userId);
    } catch (error: any) {
      throw new Error('Failed to mark notifications as read.');
    }
  }
}