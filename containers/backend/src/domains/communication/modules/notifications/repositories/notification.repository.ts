import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Récupère toutes les notifications pour un utilisateur donné.
   * @param userId ID de l'utilisateur.
   * @returns Liste des notifications ou une liste vide.
   */
  async findAllByUserId(userId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { time: 'desc' },
    });
  }

  /**
   * Crée une nouvelle notification pour un utilisateur.
   * @param notificationData Données de la notification à créer.
   * @returns La notification créée.
   */
  async create(notificationData: Omit<Notification, 'id'>): Promise<Notification> {
    return this.prisma.notification.create({
      data: notificationData,
    });
  }

  /**
   * Crée une notification pour tous les utilisateurs.
   * @param notificationData Données de la notification à créer.
   * @returns Le nombre de notifications créées.
   */
  async createForAllUsers(notificationData: Omit<Notification, 'id' | 'userId'>): Promise<number> {
    const users = await this.prisma.user.findMany({ select: { id: true } });

    const notifications = users.map((user: { id: number }) => ({
      ...notificationData,
      userId: user.id,
    }));

    const result = await this.prisma.notification.createMany({
      data: notifications,
      skipDuplicates: true,
    });

    return result.count;
  }

  /**
   * Met à jour une notification existante.
   * @param id ID de la notification à mettre à jour.
   * @param updateData Données de mise à jour.
   * @returns La notification mise à jour.
   */
  async update(id: number, updateData: Partial<Notification>): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Supprime une notification.
   * @param id ID de la notification à supprimer.
   * @returns La notification supprimée.
   */
  async delete(id: number): Promise<Notification> {
    return this.prisma.notification.delete({
      where: { id },
    });
  }

  /**
   * Marque toutes les notifications d'un utilisateur comme lues.
   * @param userId ID de l'utilisateur.
   * @returns Nombre de notifications mises à jour.
   */
  async markAllAsRead(userId: number): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return result.count;
  }
}