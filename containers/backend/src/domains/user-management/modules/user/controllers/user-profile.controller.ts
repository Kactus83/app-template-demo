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
import { UserProfileService } from '../services/user-profile.service';
import { UserProfileDto } from '../repositories/user-profile.dto';
import { UpdateUserProfileDto } from '../repositories/update-user-profile.dto';

/**
 * Controller pour la gestion du **profil public** de l’utilisateur.
 * Expose les routes **GET /users/me/profile** et **PATCH /users/me/profile**.
 * @category User Management - Profile
 */
@ApiTags('USER PROFILE')
@Controller('profile')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserProfileController {
  constructor(private readonly service: UserProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer le profil public de l’utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil récupéré.', type: UserProfileDto })
  @ApiResponse({ status: 401, description: 'Non authentifié.' })
  async getProfile(@Req() req: IAuthenticatedRequest): Promise<UserProfileDto> {
    return this.service.getProfile(req.user.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Mettre à jour le profil public de l’utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil mis à jour.', type: UserProfileDto })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Non authentifié.' })
  async updateProfile(
    @Req() req: IAuthenticatedRequest,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<UserProfileDto> {
    try {
      return this.service.updateProfile(req.user.id, dto);
    } catch (err: any) {
      throw new HttpException(err.message, err.status ?? HttpStatus.BAD_REQUEST);
    }
  }
}
