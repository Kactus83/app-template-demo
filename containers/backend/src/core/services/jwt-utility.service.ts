import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayloadDto } from '../models/dto/jwt-payload.dto';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AuthSubject } from '../models/types/auth-subject.enum';

/**
 * Service utilitaire pour la gestion des JSON Web Tokens (JWT).
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
    this.expirationBuffer = this.configService.get<number>('JWT_EXPIRATION_BUFFER', 1800) * 1000;
  }

  /**
   * Génère un JWT conforme aux spécifications définies.
   * @param payload Données à inclure dans le payload du JWT.
   * @param subject Sujet du token (par défaut "auth" ou "mfa").
   * @returns JWT signé.
   */
  signToken(payload: JwtPayloadDto, subject: AuthSubject = AuthSubject.AUTH): string {
    const payloadInstance = plainToClass(JwtPayloadDto, payload);
    const errors = validateSync(payloadInstance);

    if (errors.length) {
      throw new Error(`Invalid JWT payload: ${errors}`);
    }

    // Options de signature dynamiques depuis la configuration
    const signOptions: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      issuer: this.configService.get<string>('JWT_ISSUER'),
      subject,
    };

    return this.jwtService.sign(payload, signOptions);
  }

  /**
   * Vérifie et décode un JWT.
   * @param token JWT à vérifier.
   * @returns Payload décodé.
   */
  verifyToken(token: string): JwtPayloadDto {
    try {
      const decoded = this.jwtService.verify<JwtPayloadDto>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        issuer: this.configService.get<string>('JWT_ISSUER'),
        maxAge: this.configService.get<string>('JWT_MAX_AGE'),
      });
      this.logger.verbose(`JWT vérifié pour userId=${decoded.userId}`);
      return decoded;
    } catch (error) {
      this.logger.error('Erreur lors de la vérification du JWT', error);
      throw error;
    }
  }

  /**
   * Vérifie si le token expire bientôt.
   * @param token JWT à vérifier.
   * @returns `true` si le token approche de l'expiration, sinon `false`.
   */
  isTokenExpiringSoon(token: string): boolean {
    try {
      const decoded = this.jwtService.decode(token) as JwtPayloadDto & { exp: number };
      if (!decoded || !decoded.exp) {
        throw new Error('Le token ne contient pas de champ "exp"');
      }
      const expirationTime = decoded.exp * 1000; // Convertir en millisecondes
      const timeLeft = expirationTime - Date.now();
      return timeLeft < this.expirationBuffer;
    } catch (error) {
      this.logger.error('Erreur lors de la vérification de la durée de validité du token', error);
      throw error;
    }
  }
}
