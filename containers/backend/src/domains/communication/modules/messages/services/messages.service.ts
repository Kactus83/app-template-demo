import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { MessagesRepository } from '../repositories/messages.repository';
import { CreateMessageDto } from '../models/dto/createMessage.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

    /**
     * Récupère tous les messages d'un utilisateur.
     */
    getMessages(userId: number): Promise<Message[]> {
        return this.messagesRepository.findAll(userId);
    }

    /**
     * Crée un message pour un utilisateur.
     */
    async createMessage(userId: number, messageData: CreateMessageDto): Promise<Message> {
      const messageDataComplete = {
        ...messageData,
        userId,
        icon: messageData.icon ?? null,
        image: messageData.image ?? null,
        useRouter: messageData.useRouter ?? false,
        link: messageData.link ?? null, 
        read: messageData.read ?? false, 
        time: messageData.time || new Date(), 
      };
      return this.messagesRepository.create(messageDataComplete);
    }

    /**
     * Envoie un message à tous les utilisateurs.
     * @param messageData Données du message à créer.
     * @returns Le nombre de messages envoyés.
     */
    async sendMessageToAllUsers(messageData: Omit<Message, 'id' | 'userId' | 'time'>): Promise<number> {
        try {
        return await this.messagesRepository.createForAllUsers(messageData);
        } catch (error: any) {
        // Log et gestion des erreurs
        throw new Error('Failed to send messages to all users.');
        }
    }

    /**
     * Met à jour un message existant.
     */
    updateMessage(messageId: number, messageData: Partial<Message>): Promise<Message> {
        return this.messagesRepository.update(messageId, messageData);
    }

    /**
     * Supprime un message.
     */
    deleteMessage(messageId: number): Promise<void> {
        return this.messagesRepository.delete(messageId);
    }

    /**
     * Marque tous les messages comme lus pour un utilisateur.
     */
    markAllAsRead(userId: number): Promise<void> {
        return this.messagesRepository.markAllAsRead(userId);
    }
}