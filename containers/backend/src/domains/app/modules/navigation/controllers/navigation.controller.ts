import { Controller, Get, Put, Body, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NavigationDto } from '../models/dto/navigation.dto';
import { NavigationService } from '../services/navigation.service';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { UserRole } from '@prisma/client';
import { ROLES } from '../../../../../core/models/decorators/roles.decorator';

/**
 * @controller NavigationController
 * @description
 * Contrôleur pour la gestion de la navigation de l'utilisateur.
 * Expose les endpoints pour récupérer et mettre à jour les données de navigation.
 */
@ApiTags('APP - Navigation')
@ApiBearerAuth()
@Controller('')
@UseGuards(AuthGuard)
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  /**
   * Récupère les données de navigation de l'utilisateur.
   *
   * @param req - Requête authentifiée contenant l'utilisateur.
   * @returns Les données de navigation.
   */
  @Get()
  @ApiOperation({ summary: 'Get user navigation data' })
  @ApiResponse({ status: 200, description: 'Navigation data retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getNavigation(@Req() req: IAuthenticatedRequest) {
    try {
      const user = req.user;
      if (!user) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      return await this.navigationService.getNavigation('USER');
    } catch (error) {
      throw new HttpException('Failed to retrieve navigation data.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Met à jour les données de navigation de l'utilisateur.
   *
   * @param navigationDto - Données de mise à jour de la navigation.
   * @returns Les données de navigation mises à jour.
   */
  @Put()
  @ROLES(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user navigation data' })
  @ApiResponse({ status: 200, description: 'Navigation data updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateNavigation(@Body() navigationDto: NavigationDto) {
    try {
      return await this.navigationService.updateNavigation('USER', navigationDto);
    } catch (error) {
      throw new HttpException('Failed to update navigation data.', HttpStatus.BAD_REQUEST);
    }
  }
}
