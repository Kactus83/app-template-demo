import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { MessagesService } from '../services/messages.service';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { CreateMessageDto } from '../models/dto/createMessage.dto';
import { UpdateMessageDto } from '../models/dto/updateMessage.dto';

/**
 * @controller MessagesController
 * @description
 * Contrôleur pour la gestion des messages de l'utilisateur.
 * Expose les endpoints pour récupérer, créer, mettre à jour et supprimer des messages.
 */
@ApiTags('COMMUNICATION - Messages')
@ApiBearerAuth()
@Controller('')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * Récupère tous les messages de l'utilisateur authentifié.
   *
   * @param req Requête authentifiée contenant l'utilisateur.
   * @returns La liste des messages de l'utilisateur.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all messages for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  async getMessages(@Req() req: IAuthenticatedRequest) {
    const userId = req.user['id'];
    return this.messagesService.getMessages(userId);
  }

  /**
   * Crée un nouveau message pour l'utilisateur authentifié.
   *
   * @param req Requête authentifiée contenant l'utilisateur.
   * @param createMessageDto Données de création du message.
   * @returns Le message créé.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new message for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Message created successfully' })
  async createMessage(
    @Req() req: IAuthenticatedRequest,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const userId = req.user['id'];
    return this.messagesService.createMessage(userId, createMessageDto);
  }

  /**
   * Met à jour un message existant.
   *
   * @param id Identifiant du message à mettre à jour (paramètre de route).
   * @param updateMessageDto Données de mise à jour du message.
   * @returns Le message mis à jour.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing message' })
  @ApiResponse({ status: 200, description: 'Message updated successfully' })
  async updateMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.updateMessage(id, updateMessageDto);
  }

  /**
   * Supprime un message.
   *
   * @param id Identifiant du message à supprimer (paramètre de route).
   * @returns Une confirmation de la suppression.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully' })
  async deleteMessage(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.deleteMessage(id);
  }

  /**
   * Marque tous les messages de l'utilisateur comme lus.
   *
   * @param req Requête authentifiée contenant l'utilisateur.
   * @returns Une confirmation de la mise à jour.
   */
  @Get('mark-all-as-read')
  @ApiOperation({ summary: 'Mark all messages as read' })
  @ApiResponse({ status: 200, description: 'All messages marked as read' })
  async markAllAsRead(@Req() req: IAuthenticatedRequest) {
    const userId = req.user['id'];
    return this.messagesService.markAllAsRead(userId);
  }
}
