import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ITrackedRequest } from '../models/interfaces/tracked-request.interface';
import { ClientMetadataDto } from '../models/dto/client-metadata.dto';

/**
 * Middleware global – à placer en premier dans la chaîne.
 * Initialise `req.metadata.network` et `req.metadata.timestamp`,
 * puis parse l’en-tête JSON `x-client-metadata` pour enrichir `req.metadata.client`.
 *
 * @category Core
 * @subcategory Middlewares
 */
@Injectable()
export class MetadataMiddleware implements NestMiddleware {
  private readonly logger = new Logger(MetadataMiddleware.name);

  use(req: ITrackedRequest, res: Response, next: NextFunction): void {
    // 1) Métadonnées serveur / réseau
    req.metadata = {
      timestamp: new Date(),
      network: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string,
      },
    };

    // 2) Métadonnées client (depuis header)
    const raw = req.header('x-client-metadata');
    if (raw) {
      try {
        const clientMeta: ClientMetadataDto = JSON.parse(raw);
        req.metadata.client = clientMeta;
      } catch (err: any) {
        this.logger.warn(
          `Impossible de parser x-client-metadata: ${err.message}`
        );
      }
    }

    next();
  }
}
