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

/**
 * Gardien de route principal pour :
 *  1️⃣ Exiger une validation MFA si la route est décorée avec @Mfa(...)
 *  2️⃣ Autoriser un Service Account si la route est décorée avec @Scope(...)
 *  3️⃣ Sinon, valider un JWT utilisateur standard et éventuellement @Roles(...)
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
    this.logger.log('AuthGuard chargé');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IAuthenticatedRequest>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Jeton d’accès requis');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Jeton d’accès requis');
    }

    // 1️⃣ Validation MFA
    const requiredMfa = this.reflector.get<SecureAction>(
      MFA_KEY,
      context.getHandler(),
    );
    if (requiredMfa) {
      let mfaPayload: JwtMfaPayloadDto;
      try {
        mfaPayload = this.jwtUtility.verifyMfaToken(token);
      } catch (err) {
        this.logger.error('Jeton MFA invalide', err);
        throw new ForbiddenException('Jeton MFA invalide');
      }
      if (mfaPayload.action !== requiredMfa) {
        throw new ForbiddenException(
          `Action MFA non autorisée (attendu : ${requiredMfa})`,
        );
      }
      const user = await this.mainUserRepository.findUserById(
        mfaPayload.userId,
      );
      if (!user) {
        throw new UnauthorizedException('Utilisateur introuvable');
      }
      request.user = user;
      return true;
    }

    // 2️⃣ Validation via Service Account + @Scope(...)
    const requiredScope = this.reflector.get<{
      target: ScopeTarget;
      permission: ScopePermission;
    }>(SCOPE_KEY, context.getHandler());
    if (requiredScope) {
      try {
        const svc = this.jwtUtility.verifyServiceAccountToken(token);
        // format "auth:read", "user:write", etc.
        const needed = `${requiredScope.target.toLowerCase()}:${requiredScope.permission.toLowerCase()}`;
        if (svc.scopes.includes(needed)) {
          const user = await this.mainUserRepository.findUserById(
            svc.userId,
          );
          if (!user) {
            throw new UnauthorizedException('Utilisateur introuvable');
          }
          request.user = user;
          return true;
        }
      } catch {
        // si le Service Account échoue, on retente le JWT utilisateur
      }
    }

    // 3️⃣ JWT utilisateur standard + @Roles(...)
    let userPayload: JwtPayloadDto;
    try {
      userPayload = this.jwtUtility.verifyToken(token);
    } catch (err) {
      this.logger.error('JWT invalide', err);
      throw new UnauthorizedException('Jeton invalide');
    }
    const user = await this.mainUserRepository.findUserById(
      userPayload.userId,
    );
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }
    request.user = user;

    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (
      requiredRoles &&
      !requiredRoles.some((r) => user.roles.includes(r))
    ) {
      throw new ForbiddenException(
        `Accès refusé pour les rôles : ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
