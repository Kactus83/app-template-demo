import { Controller, Post, Put, Delete, Get, Body, Req, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { AuthenticatorService } from '../services/authenticator.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('AUTH - Authenticator')
@Controller('')
export class AuthenticatorController {
  constructor(private readonly authenticatorService: AuthenticatorService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new authenticator' })
  @ApiResponse({ status: 201, description: 'Authenticator created successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post()
  async createAuthenticator(@Req() req: IAuthenticatedRequest, @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const { authenticator, qrCodeUrl } = await this.authenticatorService.createAuthenticator(userId);
      res.status(HttpStatus.CREATED).json({ message: 'Authenticator created successfully', authenticator, qrCodeUrl });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable the authenticator' })
  @ApiResponse({ status: 200, description: 'Authenticator enabled successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid TOTP code.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Put('enable')
  async enableAuthenticator(@Req() req: IAuthenticatedRequest, @Body() body: { totpCode: string }, @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const authenticator = await this.authenticatorService.enableAuthenticator(userId, body.totpCode);
      res.status(HttpStatus.OK).json({ message: 'Authenticator enabled successfully', authenticator });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable the authenticator' })
  @ApiResponse({ status: 200, description: 'Authenticator disabled successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Put('disable')
  async disableAuthenticator(@Req() req: IAuthenticatedRequest, @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const authenticator = await this.authenticatorService.disableAuthenticator(userId);
      res.status(HttpStatus.OK).json({ message: 'Authenticator disabled successfully', authenticator });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete the authenticator' })
  @ApiResponse({ status: 200, description: 'Authenticator deleted successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Delete()
  async deleteAuthenticator(@Req() req: IAuthenticatedRequest, @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      await this.authenticatorService.deleteAuthenticator(userId);
      res.status(HttpStatus.OK).json({ message: 'Authenticator deleted successfully' });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticator details' })
  @ApiResponse({ status: 200, description: 'Authenticator retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Authenticator not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get()
  async getAuthenticator(@Req() req: IAuthenticatedRequest, @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const authenticator = await this.authenticatorService.getAuthenticator(userId);
      if (!authenticator) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Authenticator not found' });
        return;
      }
      res.status(HttpStatus.OK).json({ authenticator });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the authenticator secret' })
  @ApiResponse({ status: 200, description: 'Authenticator secret updated successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Put('secret')
  async updateAuthenticatorSecret(@Req() req: IAuthenticatedRequest, @Body() body: { newSecret: string }, @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const authenticator = await this.authenticatorService.updateAuthenticatorSecret(userId, body.newSecret);
      res.status(HttpStatus.OK).json({ message: 'Authenticator secret updated successfully', authenticator });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
    }
  }
}
