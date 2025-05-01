import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IAuthenticatedRequest } from '../models/interfaces/authenticated-request.interface';
import { ConfigService } from '@nestjs/config';
import { MainUserRepository } from '../repositories/main-user.repository';
import { verify } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../models/decorators/roles.decorator';
import { JwtPayloadDto } from '../models/dto/jwt-payload.dto';

/**
 * Gardien de route pour la protection des endpoints nécessitant une authentification.
 * Vérifie la présence et la validité du token JWT, charge l'utilisateur associé et contrôle les rôles requis.
 * @category Core
 * @category Guards
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly mainUserRepository: MainUserRepository,
    private readonly configService: ConfigService,
  ) {
    this.logger.log('AuthGuard loaded');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IAuthenticatedRequest>();
    const authHeader = request.headers['authorization'];

    // Vérification de la présence de l'en-tête Authorization
    if (!authHeader) {
      throw new UnauthorizedException('Access Token Required');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Access Token Required');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = verify(token, secret) as JwtPayloadDto;

      const user = await this.mainUserRepository.findUserById(decoded.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;

      // Utilise le Reflector de NestJS pour obtenir les rôles requis pour l'endpoint actuel.
      // Les rôles sont définis à l'aide du décorateur @Roles() sur les handlers (méthodes des contrôleurs).
      const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());
      if (requiredRoles && !requiredRoles.some(role => user.roles.includes(role))) {
        throw new ForbiddenException(`Access denied for roles: ${requiredRoles.join(', ')}`);
      }

      return true;
    } catch (error) {
      this.logger.error(`Invalid Token: ${error.message}`);
      throw new ForbiddenException('Invalid Token');
    }
  }
}
