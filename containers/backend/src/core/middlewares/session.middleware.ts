import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware pour la gestion des sessions avec express-session.
 * Configure la session en utilisant une clé secrète provenant de la config issue de Vault.
 * @category Core
 * @category Middlewares
 */
@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SessionMiddleware.name);

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Initialisation du middleware de session...');
  }

  use(req: Request, res: Response, next: NextFunction) {
    session({
      secret: this.configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === 'production' },
    })(req, res, next);
  }
}
