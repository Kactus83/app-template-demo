import { Controller, Get, Req, Res, UseGuards, Logger, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { OAuthService } from '../services/oauth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { IOAuthRequest } from '../models/interfaces/oauth-request.interface';
import { UserDto } from '../../../../../core/models/dto/user.dto';
import { plainToClass } from 'class-transformer';
import { LoginResponseDto } from '../../../../../domains/auth/common/models/dto/login-response.dto';
import { ApiTags } from '@nestjs/swagger';

/**
 * @controller OAuthController
 * @description
 * Contrôleur pour la gestion de l'authentification OAuth.
 * Expose les endpoints pour Google, GitHub et Facebook, et gère les callbacks correspondants.
 */
@ApiTags('AUTH - OAuth')
@Controller('')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(
    private readonly oauthService: OAuthService,
    private readonly jwtService: JwtService,
  ) {}

  // Google OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    await this.handleOAuthCallback(req, res, 'google');
  }

  // GitHub OAuth
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {
    // Initiates the GitHub OAuth2 login flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
    await this.handleOAuthCallback(req, res, 'github');
  }

  // Facebook OAuth
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {
    // Initiates the Facebook OAuth2 login flow
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    await this.handleOAuthCallback(req, res, 'facebook');
  }

  /**
   * Gère le callback OAuth en fonction du fournisseur.
   * @param req Requête
   * @param res Réponse
   * @param provider Fournisseur OAuth
   * @returns Redirige vers le frontend avec le token et l'utilisateur
   * @throws UnauthorizedException si l'utilisateur n'est pas authentifié
   */
  private async handleOAuthCallback(req: IOAuthRequest, res: Response, provider: string): Promise<void> {
    try {
      const loginResponse: LoginResponseDto | undefined = req.user;

      if (!loginResponse || !loginResponse.user || !loginResponse.token) {
        throw new UnauthorizedException('Utilisateur non authentifié');
      }

      // Mapper l'utilisateur vers AuthUserDto pour la redirection
      const userDto = plainToClass(UserDto, loginResponse.user, { excludeExtraneousValues: true });

      // Construire l'URL de redirection vers le frontend avec le token et l'utilisateur
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
      // Utilisation des fragments pour plus de sécurité
      const redirectUrl = `${frontendUrl}/oauth-callback?token=${loginResponse.token}&user=${encodeURIComponent(JSON.stringify(userDto))}`;
      console.log('redirect url : ', redirectUrl);

      // Rediriger vers le frontend
      res.redirect(redirectUrl);
    } catch (error: any) {
      this.logger.error(`OAuthController Error (${provider}): ${error.message}`);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
      res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error.message)}`);
    }
  }
}
