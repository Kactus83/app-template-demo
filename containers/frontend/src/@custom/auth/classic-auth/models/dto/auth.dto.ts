/**
 * DTO pour la connexion
 */
export interface LoginDto {
    email: string;
    password: string;
  }
  
  /**
   * DTO pour l'inscription
   */
  export interface RegisterDto {
    email: string;
    password: string;
    name?: string;
    secondaryEmail?: string;
  }
  
  /**
   * DTO pour la demande de réinitialisation de mot de passe
   */
  export interface PasswordResetDto {
    email: string;
  }
  
  /**
   * DTO pour la réinitialisation du mot de passe
   */
  export interface ResetPasswordDto {
    token: string;
    newPassword: string;
  }

  
  /**
   * DTO pour ajouter l'authentification classique
   * pour les compte OAuth / Web3 qui ne l'ont pas au départ
   */
  export class AddClassicAuthDto {
    email: string;
    password: string;
  }
  