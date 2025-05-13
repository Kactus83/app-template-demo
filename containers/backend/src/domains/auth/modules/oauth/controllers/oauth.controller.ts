import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

import { IOAuthRequest } from '../models/interfaces/oauth-request.interface';
import { UserDto } from '../../../../../core/models/dto/user.dto';
import { LoginResponseDto } from '../../../../../domains/auth/common/models/dto/login-response.dto';

import { OAuthService } from '../services/oauth.service';
import { ConnectionHistoryService } from '../../../common/services/connection-history.service';
import { AuthenticationMethod } from '@prisma/client';

import { ITrackedRequest } from '../../../../../core/models/interfaces/tracked-request.interface';
import { IRequestMetadata } from '../../../../../core/models/interfaces/request-metadata.interface';

@ApiTags('AUTH - OAuth')
@Controller('')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(
    private readonly oauthService: OAuthService,
    private readonly jwtService: JwtService,
    private readonly connectionHistoryService: ConnectionHistoryService,
  ) {}

  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // Affiche redirection vers Google : rien à faire ici
  }

  @Get('google/callback')
  @UseGuards(PassportAuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: IOAuthRequest & ITrackedRequest,
    @Res() res: Response,
  ) {
    await this.handleOAuthCallback(req, res, 'google');
  }

  @Get('github')
  @UseGuards(PassportAuthGuard('github'))
  async githubAuth(@Req() req: Request) {
    // Redirection vers GitHub
  }

  @Get('github/callback')
  @UseGuards(PassportAuthGuard('github'))
  async githubAuthRedirect(
    @Req() req: IOAuthRequest & ITrackedRequest,
    @Res() res: Response,
  ) {
    await this.handleOAuthCallback(req, res, 'github');
  }

  @Get('facebook')
  @UseGuards(PassportAuthGuard('facebook'))
  async facebookAuth(@Req() req: Request) {
    // Redirection vers Facebook
  }

  @Get('facebook/callback')
  @UseGuards(PassportAuthGuard('facebook'))
  async facebookAuthRedirect(
    @Req() req: IOAuthRequest & ITrackedRequest,
    @Res() res: Response,
  ) {
    await this.handleOAuthCallback(req, res, 'facebook');
  }

  /**
   * Gère le callback OAuth, historise la connexion réussie,
   * puis redirige vers le frontend avec token et user.
   */
  private async handleOAuthCallback(
    req: IOAuthRequest & ITrackedRequest,
    res: Response,
    provider: string,
  ): Promise<void> {
    try {
      const loginResponse: LoginResponseDto | undefined = req.user;
      if (!loginResponse?.user?.id || !loginResponse.token) {
        throw new UnauthorizedException('Utilisateur non authentifié');
      }

      // Historiser la connexion réussie
      const meta: IRequestMetadata = req.metadata;
      await this.connectionHistoryService.recordAttempt({
        userId: loginResponse.user.id,
        method: AuthenticationMethod.OAUTH,
        success: true,
        ipAddress: meta.network.ipAddress,
        userAgent: meta.network.userAgent,
      });

      // Préparer la redirection
      const userDto = plainToInstance(UserDto, loginResponse.user, {
        excludeExtraneousValues: true,
      });
      const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:4200';
      const fragment = `token=${loginResponse.token}&user=${encodeURIComponent(
        JSON.stringify(userDto),
      )}`;
      const redirectUrl = `${frontendUrl}/oauth-callback#${fragment}`;

      this.logger.log(`OAuth ${provider} success, redirecting to ${redirectUrl}`);
      res.redirect(redirectUrl);
    } catch (error: any) {
      this.logger.error(`OAuthController Error (${provider}): ${error.message}`);

      // Si on a un user connu, historiser l'échec
      try {
        const partial = (req.user as LoginResponseDto)?.user;
        if (partial?.id) {
          const meta: IRequestMetadata = req.metadata;
          await this.connectionHistoryService.recordAttempt({
            userId: partial.id,
            method: AuthenticationMethod.OAUTH,
            success: false,
            ipAddress: meta.network.ipAddress,
            userAgent: meta.network.userAgent,
          });
        }
      } catch {
        // ignore
      }

      const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:4200';
      const errorParam = encodeURIComponent(error.message);
      res.redirect(`${frontendUrl}/login?error=${errorParam}`);
    }
  }
}