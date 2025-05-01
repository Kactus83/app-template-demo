import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/services/prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class MessagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère tous les messages d'un utilisateur.
   */
  async findAll(userId: number): Promise<Message[]> {
      return this.prisma.message.findMany({
          where: { userId },
          orderBy: { time: 'desc' },
      });
  }

  /**
   * Crée un message.
   */
  async create(data: Omit<Message, 'id' | 'time'>): Promise<Message> {
      return this.prisma.message.create({
          data: { ...data, time: new Date() },
      });
  }

  /**
   * Crée un message pour tous les utilisateurs.
   * @param messageData Données du message à créer.
   * @returns Le nombre de messages créés.
   */
  async createForAllUsers(messageData: Omit<Message, 'id' | 'userId' | 'time'>): Promise<number> {
      const users = await this.prisma.user.findMany({ select: { id: true } });
  
      const messages = users.map((user: { id: number }) => ({
      ...messageData,
      userId: user.id,
      time: new Date(),
      }));
  
      const result = await this.prisma.message.createMany({
      data: messages,
      skipDuplicates: true,
      });
  
      return result.count; 
  }

  /**
   * Met à jour un message.
   */
  async update(messageId: number, data: Partial<Message>): Promise<Message> {
      return this.prisma.message.update({
          where: { id: messageId },
          data,
      });
  }

  /**
   * Supprime un message.
   */
  async delete(messageId: number): Promise<void> {
      await this.prisma.message.delete({
          where: { id: messageId },
      });
  }

  /**
   * Marque tous les messages comme lus pour un utilisateur.
   */
  async markAllAsRead(userId: number): Promise<void> {
      await this.prisma.message.updateMany({
          where: { userId, read: false },
          data: { read: true },
      });
  }
}