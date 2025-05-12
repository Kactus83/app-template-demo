/**
 * Données collectées automatiquement par le middleware de metadata.
 * Ne contient pas d’information d’authentification utilisateur.
 */
export interface IRequestMetadata {
    /** Horodatage de la requête */
    timestamp: Date;
  
    /** Info réseau et client */
    network: {
      /** Adresse IP source (req.ip) */
      ipAddress: string;
      /** User-Agent du client (req.headers['user-agent']) */
      userAgent?: string;
    };
  }
  