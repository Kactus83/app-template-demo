import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { ITrackedRequest } from '../../../../../core/models/interfaces/tracked-request.interface';
import { IRequestMetadata } from '../../../../../core/models/interfaces/request-metadata.interface';

import { AuthenticationMethod } from '@prisma/client';

import { AuthService } from '../services/auth.service';
import { AuthUserRepository } from '../../../common/repositories/auth-user.repository';
import { ConnectionHistoryService } from '../../../common/services/connection-history.service';

import { EmailLoginDto, UsernameLoginDto } from '../models/dto/login.dto';
import { AddEmailClassicAuthDto, AddUsernameClassicAuthDto } from '../models/dto/addClassicAuth.dto';

import { UserDto } from '../../../../../core/models/dto/user.dto';
import { LoginResponseDto } from '../../../../../domains/auth/common/models/dto/login-response.dto';
import { TOKEN } from '../../../../../core/models/decorators/token.decorator';

@ApiTags('AUTH - Classic Auth')
@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authUserRepo: AuthUserRepository,
    private readonly connectionHistoryService: ConnectionHistoryService,
  ) {}

  /**
   * Connexion de l'utilisateur via email ou username + mot de passe.
   * Enregistre un historique de connexion en cas de succès ou d'échec.
   */
  @Post('sign-in')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 400, description: 'Invalid email or password.' })
  async login(
    @Req() req: ITrackedRequest,
    @Body() loginDto: EmailLoginDto | UsernameLoginDto,
  ): Promise<LoginResponseDto> {
    const meta: IRequestMetadata = req.metadata;
    try {
      const { user, token } = await this.authService.login(loginDto);

      // enregistrement du succès
      await this.connectionHistoryService.recordAttempt({
        userId: user.id,
        method: AuthenticationMethod.CLASSIC,
        success: true,
        ipAddress: meta.network.ipAddress,
        userAgent: meta.network.userAgent,
      });

      const userDto = plainToInstance(UserDto, user);
      return { user: userDto, token };
    } catch (error: any) {
      // tenter de récupérer l'utilisateur pour historiser l'échec
      try {
        let attemptedUser = null;
        if ('email' in loginDto) {
          attemptedUser = await this.authUserRepo.findByPrimaryOrSecondaryEmail(loginDto.email);
        } else if ('username' in loginDto) {
          attemptedUser = await this.authUserRepo.findByUsername(loginDto.username);
        }
        if (attemptedUser) {
          await this.connectionHistoryService.recordAttempt({
            userId: attemptedUser.id,
            method: AuthenticationMethod.CLASSIC,
            success: false,
            ipAddress: meta.network.ipAddress,
            userAgent: meta.network.userAgent,
          });
        }
      } catch {
        // ignore errors in logging failure
      }

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Authentification via JWT existant : rafraîchit le token si besoin
   * et met à jour la date de dernière activité sur la session.
   */
  @Post('sign-in-with-token')
  @ApiOperation({ summary: 'Sign in with JWT token' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'User authenticated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async signInWithToken(
    @TOKEN() token: string,
    @Req() req: ITrackedRequest & IAuthenticatedRequest,
  ): Promise<LoginResponseDto> {
    try {
      if (!token) {
        throw new HttpException('Token non fourni', HttpStatus.UNAUTHORIZED);
      }

      // Rafraîchir token si nécessaire
      const response = await this.authService.refreshTokenIfNeeded(req.user.id, token);

      // mettre à jour lastActivity
      const sessions = await this.connectionHistoryService.getHistory(req.user.id, { take: 1 });
      if (sessions.length) {
        await this.connectionHistoryService.touchSession(sessions[0].id);
      }

      return response;
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Ajout d'une authentification classique (email/username + mot de passe)
   * pour un utilisateur déjà authentifié.
   */
  @Post('add-classic-auth')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Add classic authentication to the authenticated user' })
  @ApiResponse({ status: 200, description: 'Classic authentication added successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async addClassicAuth(
    @Req() req: IAuthenticatedRequest,
    @Body() addClassicAuthDto: AddEmailClassicAuthDto | AddUsernameClassicAuthDto,
  ): Promise<{ message: string; user: UserDto }> {
    try {
      const updatedUser = await this.authService.addClassicAuth(req.user, addClassicAuthDto);
      const userDto = plainToInstance(UserDto, updatedUser);
      return { message: 'Classic authentication added successfully', user: userDto };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}