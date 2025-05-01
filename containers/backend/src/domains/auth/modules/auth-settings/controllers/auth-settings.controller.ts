import { Controller, Post, Get, Body, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthSettingsUpdateDto } from '../models/dto/authSettingsUpdate.dto';
import { AuthSettingsDisableDto } from '../models/dto/authSettingsDisable.dto';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthSettingsDto } from '../models/dto/authSettingsDto';
import { AuthSettingsService } from '../services/auth-settings.service';

@ApiTags('AUTH - Settings')
@ApiBearerAuth()
@Controller('')
@UseGuards(AuthGuard)
export class AuthSettingsController {
  constructor(private readonly authSettingsService: AuthSettingsService) {}

  @Post('update')
  @ApiOperation({ summary: 'Update or add an authentication method' })
  @ApiResponse({ status: 200, description: 'Authentication method updated or added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or update error' })
  @ApiResponse({ status: 401, description: 'Unauthorized, missing or invalid token' })
  async updateAuthMethod(
    @Req() req: IAuthenticatedRequest,
    @Body() authSettingsUpdateDto: AuthSettingsUpdateDto
  ): Promise<{ message: string }> {
    try {
      const userId = req.user.id;
      const { method, methodId, order } = authSettingsUpdateDto;
      await this.authSettingsService.updateAuthMethod(userId, method, methodId, order);
      return { message: 'Authentication method updated successfully' };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('disable')
  @ApiOperation({ summary: 'Disable an authentication method' })
  @ApiResponse({ status: 200, description: 'Authentication method disabled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or validation code incorrect' })
  @ApiResponse({ status: 401, description: 'Unauthorized, missing or invalid token' })
  async disableAuthMethod(
    @Req() req: IAuthenticatedRequest,
    @Body() authSettingsDisableDto: AuthSettingsDisableDto
  ): Promise<{ message: string }> {
    try {
      const userId = req.user.id;
      const { methodId } = authSettingsDisableDto;
      await this.authSettingsService.disableAuthMethod(userId, methodId);
      return { message: 'Authentication method disabled successfully' };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get user authentication settings' })
  @ApiResponse({ status: 200, description: 'Authentication settings retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Error retrieving settings' })
  @ApiResponse({ status: 401, description: 'Unauthorized, missing or invalid token' })
  async getAuthSettings(
    @Req() req: IAuthenticatedRequest
  ): Promise<AuthSettingsDto> {
    try {
      const userId = req.user.id;
      return await this.authSettingsService.getAuthSettings(userId);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
