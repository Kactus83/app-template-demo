import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ITrackedRequest } from '../models/interfaces/tracked-request.interface';

/**
 * Middleware global – à placer en premier dans la chaîne.
 * Initialise `req.metadata` avec IP, agent et timestamp.
 */
@Injectable()
export class MetadataMiddleware implements NestMiddleware {
  use(req: ITrackedRequest, res: Response, next: NextFunction) {
    req.metadata = {
      timestamp: new Date(),
      network: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string,
      },
    };
    next();
  }
}
