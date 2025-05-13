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
import { MainUserRepository } from '../repositories/main-user.repository';
import { JwtUtilityService } from '../services/jwt-utility.service';
import { UserRole, SecureAction } from '@prisma/client';
import { ROLES_KEY } from '../models/decorators/roles.decorator';
import { MFA_KEY } from '../models/decorators/mfa.decorator';
import { JwtPayloadDto } from '../models/dto/jwt-payload.dto';
import { JwtMfaPayloadDto } from '../models/dto/jwt-mfa-payload.dto';

/**
 * Gardien de route pour la protection des endpoints.
 * Gère en premier la vérification MFA si @Mfa(...) est présent,
 * sinon l’authentification standard via JWT utilisateur.
 * Contrôle ensuite les rôles si @Roles(...) est utilisé.
 * @category Core
 * @category Guards
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly mainUserRepository: MainUserRepository,
    private readonly jwtUtility: JwtUtilityService,
  ) {
    this.logger.log('AuthGuard loaded');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IAuthenticatedRequest>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Access Token Required');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Access Token Required');
    }

    // 1️⃣ Vérification MFA si demandé
    const requiredMfa = this.reflector.get<SecureAction>(
      MFA_KEY,
      context.getHandler(),
    );
    if (requiredMfa) {
      let mfaPayload: JwtMfaPayloadDto;
      try {
        mfaPayload = this.jwtUtility.verifyMfaToken(token);
      } catch (err) {
        this.logger.error('Invalid MFA Token', err);
        throw new ForbiddenException('Invalid MFA Token');
      }
      if (mfaPayload.action !== requiredMfa) {
        throw new ForbiddenException(
          `MFA token action mismatch (expected ${requiredMfa})`,
        );
      }
      const user = await this.mainUserRepository.findUserById(
        mfaPayload.userId,
      );
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      request.user = user;
      return true;
    }

    // 2️⃣ Authentification utilisateur standard
    let userPayload: JwtPayloadDto;
    try {
      userPayload = this.jwtUtility.verifyToken(token);
    } catch (err) {
      this.logger.error('Invalid JWT', err);
      throw new UnauthorizedException('Invalid Token');
    }
    const user = await this.mainUserRepository.findUserById(
      userPayload.userId,
    );
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    request.user = user;

    // 3️⃣ Contrôle des rôles si nécessaire
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (
      requiredRoles &&
      !requiredRoles.some((r) => user.roles.includes(r))
    ) {
      throw new ForbiddenException(
        `Access denied for roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}