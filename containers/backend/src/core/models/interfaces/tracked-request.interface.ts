import { Request } from 'express';
import { IRequestMetadata } from './request-metadata.interface';

/**
 * Requête Express enrichie par le middleware de collecte.
 * Contient uniquement des métadonnées, pas d’info user.
 */
export interface ITrackedRequest extends Request {
  /** Métadonnées de la requête initialisées par MetadataMiddleware */
  metadata: IRequestMetadata;
}
