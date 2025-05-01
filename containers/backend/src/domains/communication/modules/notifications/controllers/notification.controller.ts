import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { CreateNotificationDto } from '../models/dto/createNotification.dto';
import { UpdateNotificationDto } from '../models/dto/updateNotification.dto';
import { NotificationService } from '../services/notification.service';

@ApiTags('COMMUNICATION - Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Récupère toutes les notifications pour l'utilisateur authentifié.
   * 
   * @param req Requête authentifiée contenant l'utilisateur.
   * @returns La liste des notifications de l'utilisateur.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all notifications for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async getAllNotifications(@Req() req: IAuthenticatedRequest) {
    const userId = req.user['id'];
    return this.notificationService.getAllNotifications(userId);
  }

  /**
   * Crée une nouvelle notification pour l'utilisateur authentifié.
   * 
   * @param req Requête authentifiée contenant l'utilisateur.
   * @param createNotificationDto Données de création de la notification.
   * @returns La notification créée.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new notification for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  async createNotification(@Req() req: IAuthenticatedRequest, @Body() createNotificationDto: CreateNotificationDto) {
    const userId = req.user['id'];
    return this.notificationService.createNotification(userId, createNotificationDto);
  }

  /**
   * Met à jour une notification existante.
   * 
   * @param id Identifiant de la notification à mettre à jour (paramètre de route).
   * @param updateNotificationDto Données de mise à jour de la notification.
   * @returns La notification mise à jour.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing notification' })
  @ApiResponse({ status: 200, description: 'Notification updated successfully' })
  async updateNotification(@Param('id', ParseIntPipe) id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.updateNotification(id, updateNotificationDto);
  }

  /**
   * Supprime une notification.
   * 
   * @param id Identifiant de la notification à supprimer (paramètre de route).
   * @returns Confirmation de la suppression.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
  async deleteNotification(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.deleteNotification(id);
  }

  /**
   * Marque toutes les notifications comme lues pour l'utilisateur authentifié.
   * 
   * @param req Requête authentifiée contenant l'utilisateur.
   * @returns Confirmation de la mise à jour.
   */
  @Get('mark-all-as-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@Req() req: IAuthenticatedRequest) {
    const userId = req.user['id'];
    return this.notificationService.markAllAsRead(userId);
  }
}
