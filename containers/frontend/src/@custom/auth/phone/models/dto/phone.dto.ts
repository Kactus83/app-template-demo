/**
 * DTO pour ajouter un numéro de téléphone.
 */
export interface AddPhoneDto {
    /** Le numéro de téléphone à ajouter (format E.164 recommandé). */
    phoneNumber: string;
  }
  
  /**
   * DTO pour mettre à jour un numéro de téléphone.
   */
  export interface UpdatePhoneDto {
    /** Nouveau numéro de téléphone, si modification. */
    phoneNumber?: string;
    /** Statut de vérification du numéro. */
    isVerified?: boolean;
  }
  
  /**
   * DTO pour la vérification d'un numéro de téléphone.
   */
  export interface VerifyPhoneDto {
    /** Le numéro de téléphone au format E.164. */
    phoneNumber: string;
    /** Le token de vérification reçu par SMS. */
    token: string;
  }
  
  /**
   * DTO représentant un numéro de téléphone.
   */
  export interface PhoneDto {
    /** Identifiant unique du numéro de téléphone. */
    id: number;
    /** Identifiant de l'utilisateur propriétaire. */
    userId: number;
    /** Le numéro de téléphone. */
    phoneNumber: string;
    /** Statut de vérification du numéro. */
    isVerified: boolean;
    /** Date de création du numéro. */
    createdAt: Date;
  }
  