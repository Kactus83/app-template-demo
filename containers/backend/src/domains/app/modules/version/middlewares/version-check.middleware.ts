import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { VersionService } from '../services/version.service';

/**
 * Middleware qui :
 *  - Exclut /health,
 *  - Lit **uniquement** le header `x-frontend-version`,
 *  - Compare à la version backend en base via VersionService.
 *
 * Si l’en-tête est absent ou incorrect, renvoie 400.
 *
 * @category Core
 * @category Middlewares
 */
@Injectable()
export class VersionCheckMiddleware implements NestMiddleware {
  private readonly logger = new Logger(VersionCheckMiddleware.name);

  constructor(private readonly versionService: VersionService) {
    this.logger.log('VersionCheckMiddleware loaded');
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.originalUrl === '/health' || req.path === '/health') {
      return next();
    }

    // Lecture **exclusive** du header
    const frontendVersion = req.header('x-frontend-version');
    if (!frontendVersion) {
      throw new HttpException(
        'Frontend version not provided',
        HttpStatus.BAD_REQUEST
      );
    }

    const currentVersion = await this.versionService.getVersion();
    if (!currentVersion) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (frontendVersion !== currentVersion.frontend) {
      throw new HttpException(
        `Frontend version ${frontendVersion} is not supported. Please update to version ${currentVersion.frontend}.`,
        HttpStatus.BAD_REQUEST
      );
    }

    next();
  }
}
