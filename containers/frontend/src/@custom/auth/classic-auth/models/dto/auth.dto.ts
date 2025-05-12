/**
 * DTOs for authentication flows, aligned with backend NestJS DTOs.
 *
 * - EmailLoginDto: connexion par email + mot de passe
 * - UsernameLoginDto: connexion par username + mot de passe
 * - RegisterDto: données d'inscription, étendu avec prénom, nom et email secondaire
 * - AddEmailClassicAuthDto: ajout d'auth classique email + mot de passe pour comptes OAuth/Web3
 * - AddUsernameClassicAuthDto: ajout d'auth classique username + mot de passe pour comptes OAuth/Web3
 * - PasswordResetDto & ResetPasswordDto: flux de réinitialisation de mot de passe
 */

/**
 * Connexion par adresse email et mot de passe.
 */
export interface EmailLoginDto {
  /** Adresse email de l'utilisateur */
  email: string;
  /** Mot de passe de l'utilisateur */
  password: string;
}

/**
 * Connexion par nom d'utilisateur (username) et mot de passe.
 */
export interface UsernameLoginDto {
  /** Nom d’utilisateur (username) */
  username: string;
  /** Mot de passe de l'utilisateur */
  password: string;
}

/**
 * Données d'inscription pour un nouvel utilisateur.
 */
export interface RegisterDto {
  /** Adresse email de l'utilisateur */
  email: string;
  /** Mot de passe de l'utilisateur (au moins 6 caractères) */
  password: string;
  /** Nom d’utilisateur (username) */
  username?: string;
  /** Prénom de l'utilisateur */
  firstName?: string;
  /** Nom de famille de l'utilisateur */
  lastName?: string;
  /** Email secondaire de l'utilisateur */
  secondaryEmail?: string;
}

/**
 * Ajout d’une méthode de connexion classique par email + mot de passe
 * pour les comptes OAuth/Web3 sans authentification classique.
 */
export interface AddEmailClassicAuthDto {
  /** Adresse email de l'utilisateur */
  email: string;
  /** Mot de passe de l'utilisateur (au moins 6 caractères) */
  password: string;
}

/**
 * Ajout d’une méthode de connexion classique par username + mot de passe
 * pour les comptes OAuth/Web3 sans authentification classique.
 */
export interface AddUsernameClassicAuthDto {
  /** Nom d’utilisateur (username) */
  username: string;
  /** Mot de passe de l'utilisateur (au moins 6 caractères) */
  password: string;
}

/**
 * DTO pour la demande de réinitialisation de mot de passe.
 */
export interface PasswordResetDto {
  /** Adresse email de l'utilisateur */
  email: string;
}

/**
 * DTO pour la réinitialisation effective du mot de passe.
 */
export interface ResetPasswordDto {
  /** Token de réinitialisation fourni par l’API */
  token: string;
  /** Nouveau mot de passe */
  newPassword: string;
}
