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
import {
  UserRole,
  SecureAction,
  ScopeTarget,
  ScopePermission,
} from '@prisma/client';
import { ROLES_KEY } from '../models/decorators/roles.decorator';
import { MFA_KEY } from '../models/decorators/mfa.decorator';
import { SCOPE_KEY } from '../models/decorators/scope.decorator';
import { JwtPayloadDto } from '../models/dto/jwt-payload.dto';
import { JwtMfaPayloadDto } from '../models/dto/jwt-mfa-payload.dto';
import { JwtServiceAccountPayloadDto } from '../models/dto/jwt-service-account-payload.dto';

/**
 * Gardien de route pour la protection des endpoints.
 * 
 * 1️⃣ Si décoré @Mfa, vérifie un token MFA (MFA_KEY).
 * 2️⃣ Sinon, si décoré @Scope, vérifie un token ServiceAccount + scope (SCOPE_KEY).
 * 3️⃣ Sinon, vérifie un token utilisateur + rôles éventuels (ROLES_KEY).
 *
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
    const req = context.switchToHttp().getRequest<IAuthenticatedRequest>();
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Access Token Required');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Access Token Required');
    }

    // 1️⃣ MFA ?
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
      req.user = user;
      return true;
    }

    // 2️⃣ Service Account + Scope ?
    const requiredScope = this.reflector.get<{
      target: ScopeTarget;
      permission: ScopePermission;
    }>(SCOPE_KEY, context.getHandler());
    if (requiredScope) {
      let svcPayload: JwtServiceAccountPayloadDto;
      try {
        svcPayload = this.jwtUtility.verifyServiceAccountToken(token);
      } catch (err) {
        this.logger.error('Invalid ServiceAccount Token', err);
        throw new ForbiddenException('Invalid ServiceAccount Token');
      }
      // vérifier que le scope requis est dans la liste du token
      const needed = `${requiredScope.target.toLowerCase()}:${requiredScope.permission.toLowerCase()}`;
      if (!svcPayload.scopes.includes(needed)) {
        throw new ForbiddenException(`Missing scope: ${needed}`);
      }
      // charger l'utilisateur "maître" pour avoir le contexte dans req.user
      const user = await this.mainUserRepository.findUserById(
        svcPayload.userId,
      );
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      req.user = user;
      return true;
    }

    // 3️⃣ Auth utilisateur + rôles éventuels
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
    req.user = user;

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
