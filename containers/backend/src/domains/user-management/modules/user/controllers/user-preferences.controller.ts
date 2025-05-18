import {
  Controller,
  Get,
  Patch,
  Req,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { UserPreferencesService } from '../services/user-preferences.service';
import { UpdateUserPreferencesDto } from '../models/dto/update-user-preferences.dto';
import { UserPreferencesDto } from '../models/dto/user-preferences.dto';

/**
 * Controller pour la gestion des **préférences** utilisateur.
 * Expose les routes **GET /users/me/preferences** et **PATCH /users/me/preferences**.
 * @category User Management - Preferences
 */
@ApiTags('USER PREFERENCES')
@Controller('preferences')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserPreferencesController {
  constructor(private readonly service: UserPreferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer les préférences de l’utilisateur' })
  @ApiResponse({ status: 200, description: 'Préférences récupérées.', type: UserPreferencesDto })
  @ApiResponse({ status: 401, description: 'Non authentifié.' })
  async getPreferences(@Req() req: IAuthenticatedRequest): Promise<UserPreferencesDto> {
    return this.service.getPreferences(req.user.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Mettre à jour les préférences de l’utilisateur' })
  @ApiResponse({ status: 200, description: 'Préférences mises à jour.', type: UserPreferencesDto })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Non authentifié.' })
  async updatePreferences(
    @Req() req: IAuthenticatedRequest,
    @Body() dto: UpdateUserPreferencesDto,
  ): Promise<UserPreferencesDto> {
    try {
      return this.service.updatePreferences(req.user.id, dto);
    } catch (err: any) {
      throw new HttpException(err.message, err.status ?? HttpStatus.BAD_REQUEST);
    }
  }
}
