/**
 * DTO représentant un authenticator.
 */
export interface AuthenticatorDto {
    /** La clé secrète utilisée pour générer les codes TOTP. */
    secret: string;
    /** Indique si l'authenticator est activé. */
    enabled?: boolean;
    /** L'URL du QR code permettant de configurer l'authenticator. */
    qrCodeURL: string;
  }
  
  /**
   * DTO pour la mise à jour de l'authenticator (activation/désactivation).
   */
  export interface UpdateAuthenticatorDto {
    /** Le nouveau statut d'activation de l'authenticator. */
    enabled: boolean;
  }
  