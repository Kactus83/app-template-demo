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

import { AuthService } from '../services/auth.service';
import { EmailLoginDto, UsernameLoginDto } from '../models/dto/login.dto';
import { AddEmailClassicAuthDto, AddUsernameClassicAuthDto } from '../models/dto/addClassicAuth.dto';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../../../../../core/models/dto/user.dto';
import { LoginResponseDto } from '../../../../../domains/auth/common/models/dto/login-response.dto';
import { TOKEN } from '../../../../../core/models/decorators/token.decorator';

@ApiTags('AUTH - Classic Auth')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Connexion de l'utilisateur via email et mot de passe.
   *
   * @param loginDto - Données de connexion.
   * @returns L'utilisateur et le token JWT.
   */
  @Post('sign-in')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 400, description: 'Invalid email or password.' })
  async login(@Body() loginDto: EmailLoginDto | UsernameLoginDto): Promise<LoginResponseDto> {
    try {
      const { user, token } = await this.authService.login(loginDto);
      const userDto = plainToInstance(UserDto, user);
      return { user: userDto, token };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Authentification via token JWT.
   *
   * @param token - Le token extrait de l'en-tête Authorization.
   * @param req - La requête HTTP authentifiée.
   * @returns Un token rafraîchi et l'utilisateur associé.
   */
  @Post('sign-in-with-token')
  @ApiOperation({ summary: 'Sign in with JWT token' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'User authenticated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async signInWithToken(
    @TOKEN() token: string,
    @Req() req: IAuthenticatedRequest,
  ): Promise<LoginResponseDto> {
    try {
      if (!token) {
        throw new HttpException('Token non fourni', HttpStatus.UNAUTHORIZED);
      }
      return await this.authService.refreshTokenIfNeeded(req.user.id, token);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Ajout d'une authentification classique pour l'utilisateur authentifié.
   *
   * @param req - La requête HTTP authentifiée.
   * @param addClassicAuthDto - Données pour ajouter l'authentification classique.
   * @returns Un message de succès et les informations de l'utilisateur mis à jour.
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
      const user = req.user;
      const updatedUser = await this.authService.addClassicAuth(user, addClassicAuthDto);
      const userDto = plainToInstance(UserDto, updatedUser);
      return { message: 'Classic authentication added successfully', user: userDto };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
