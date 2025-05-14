import { ClientMetadataDto } from '../dto/client-metadata.dto';

/**
 * Métadonnées stockées sur chaque requête :
 * - réseau (IP / user-agent), horodatage serveur
 * - métadonnées client (optionnelles) transmises par le front
 *
 * @category Core
 * @subcategory Interfaces
 */
export interface IRequestMetadata {
  /** Horodatage côté serveur */
  timestamp: Date;

  /** Infos réseau */
  network: {
    ipAddress: string;
    userAgent: string;
  };

  /** Métadonnées front-end, si fournies */
  client?: ClientMetadataDto;
}
