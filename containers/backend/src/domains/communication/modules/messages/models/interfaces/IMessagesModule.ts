import { Message } from '@prisma/client';
import { CreateMessageDto } from '../dto/createMessage.dto';

export interface IMessagesModule {
    createMessage(userId: number, messageData: CreateMessageDto): Promise<Message>;
    sendMessageToAllUsers(messageData: Omit<Message, 'id' | 'userId' | 'time'>): Promise<number>;
}