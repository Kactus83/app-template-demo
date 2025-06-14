import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { plainToClass, instanceToPlain } from 'class-transformer';
import { validateSync } from 'class-validator';
import { JwtPayloadDto } from '../models/dto/jwt-payload.dto';
import { JwtServiceAccountPayloadDto } from '../models/dto/jwt-service-account-payload.dto';
import { JwtMfaPayloadDto } from '../models/dto/jwt-mfa-payload.dto';
import { AuthSubject } from '../models/types/auth-subject.enum';

/**
 * Service utilitaire pour la gestion des JSON Web Tokens (JWT).
 * Gère les tokens utilisateur, Service Account et MFA.
 * @category Core
 * @category Core Services
 */
@Injectable()
export class JwtUtilityService {
  private readonly logger = new Logger(JwtUtilityService.name);
  private readonly expirationBuffer: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.expirationBuffer =
      this.configService.get<number>('JWT_EXPIRATION_BUFFER', 1800) * 1000;
  }

  /**
   * Génère un JWT pour un utilisateur.
   * @param payload DTO validé par JwtPayloadDto.
   * @param subject Sujet du token (AUTH ou MFA).
   */
  signUserToken(
    payload: JwtPayloadDto,
    subject: AuthSubject = AuthSubject.AUTH,
  ): string {
    const instance = plainToClass(JwtPayloadDto, payload);
    const errors = validateSync(instance);
    if (errors.length) {
      throw new Error(`Invalid user JWT payload: ${errors}`);
    }
    const plain = instanceToPlain(instance);
    return this.doSign(plain, subject);
  }

  /**
   * Génère un JWT pour un Service Account.
   * @param payload DTO validé par JwtServiceAccountPayloadDto.
   */
  signServiceAccountToken(
    payload: JwtServiceAccountPayloadDto,
  ): string {
    const instance = plainToClass(JwtServiceAccountPayloadDto, payload);
    const errors = validateSync(instance);
    if (errors.length) {
      throw new Error(`Invalid ServiceAccount JWT payload: ${errors}`);
    }
    const plain = instanceToPlain(instance);
    return this.doSign(plain, AuthSubject.SERVICE_ACCOUNT);
  }

  /**
   * Génère un JWT pour un flux MFA.
   * @param payload DTO validé par JwtMfaPayloadDto.
   */
  signMfaToken(
    payload: JwtMfaPayloadDto,
  ): string {
    const instance = plainToClass(JwtMfaPayloadDto, payload);
    const errors = validateSync(instance);
    if (errors.length) {
      throw new Error(`Invalid MFA JWT payload: ${errors}`);
    }
    const plain = instanceToPlain(instance);
    return this.doSign(plain, AuthSubject.MFA);
  }

  /**
   * Logique commune de signature de JWT.
   */
  private doSign(payload: object, subject: AuthSubject): string {
    const signOptions: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      issuer: this.configService.get<string>('JWT_ISSUER'),
      subject,
    };
    return this.jwtService.sign(payload, signOptions);
  }

  /**
   * Vérifie et décode un JWT utilisateur.
   */
  verifyToken(token: string): JwtPayloadDto {
    try {
      const decoded = this.jwtService.verify<JwtPayloadDto>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        issuer: this.configService.get<string>('JWT_ISSUER'),
        maxAge: this.configService.get<string>('JWT_MAX_AGE'),
      });
      this.logger.verbose(`User JWT verified for userId=${decoded.userId}`);
      return decoded;
    } catch (error) {
      this.logger.error('Error verifying user JWT', error);
      throw error;
    }
  }

  /**
   * Vérifie et décode un JWT Service Account.
   */
  verifyServiceAccountToken(token: string): JwtServiceAccountPayloadDto {
    try {
      const decoded = this.jwtService.verify<JwtServiceAccountPayloadDto>(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          issuer: this.configService.get<string>('JWT_ISSUER'),
          subject: AuthSubject.SERVICE_ACCOUNT,
          maxAge: this.configService.get<string>('JWT_MAX_AGE'),
        },
      );
      this.logger.verbose(
        `ServiceAccount JWT verified for clientId=${decoded.clientId}`,
      );
      return plainToClass(JwtServiceAccountPayloadDto, decoded);
    } catch (error) {
      this.logger.error('Error verifying ServiceAccount JWT', error);
      throw error;
    }
  }

  /**
   * Vérifie et décode un JWT MFA.
   */
  verifyMfaToken(token: string): JwtMfaPayloadDto {
    try {
      const decoded = this.jwtService.verify<JwtMfaPayloadDto>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        issuer: this.configService.get<string>('JWT_ISSUER'),
        subject: AuthSubject.MFA,
        maxAge: this.configService.get<string>('JWT_MAX_AGE'),
      });
      this.logger.verbose(`MFA JWT verified for mfaId=${decoded.mfaId}`);
      return plainToClass(JwtMfaPayloadDto, decoded);
    } catch (error) {
      this.logger.error('Error verifying MFA JWT', error);
      throw error;
    }
  }

  /**
   * Vérifie si un token expire bientôt.
   */
  isTokenExpiringSoon(token: string): boolean {
    try {
      const decoded = this.jwtService.decode(token) as { exp?: number };
      if (!decoded || typeof decoded.exp !== 'number') {
        throw new Error('Token missing "exp" claim');
      }
      const expirationTime = decoded.exp * 1000;
      return expirationTime - Date.now() < this.expirationBuffer;
    } catch (error) {
      this.logger.error('Error checking token expiration', error);
      throw error;
    }
  }
}
