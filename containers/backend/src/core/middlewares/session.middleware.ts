import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';
import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware pour la gestion des sessions avec express-session.
 * Configure la session en mémoire (MemoryStore).
 *
 * @category Core
 * @category Middlewares
 */
@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SessionMiddleware.name);
  private readonly sessionMiddleware = session({
    secret: this.configService.get<string>('SESSION_SECRET')!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 jour
    },
  });

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Initialisation du middleware de session en MemoryStore…');
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.sessionMiddleware(req, res, next);
  }
}
