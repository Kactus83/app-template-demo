import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware qui intègre Morgan pour le logging des requêtes HTTP,
 * en redirigeant les logs vers le logger NestJS personnalisé.
 * @category Core
 * @category Middlewares
 */
@Injectable()
export class MorganMiddleware implements NestMiddleware {
  private readonly logger = new Logger(MorganMiddleware.name);

  constructor() {
    this.logger.log('Initialisation du middleware Morgan...');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const stream = {
      write: (message: string) => {
        this.logger.log(`HTTP ${message.trim()}`);
      },
    };

    const skip = () => {
      const isHealthCheck = req.path === '/health';
      const isNotDevelopment = process.env.NODE_ENV !== 'development';
      return isHealthCheck || isNotDevelopment;
    };

    const format =
      process.env.NODE_ENV === 'production'
        ? 'combined'
        : ':method :url :status :res[content-length] - :response-time ms';

    morgan(format, { stream, skip })(req, res, next);
  }
}
