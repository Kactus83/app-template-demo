/**
 * Enumération des sujets d'authentification.
 * Permet de différencier les tokens émis pour l'authentification classique et ceux émis pour la MFA.
 * @category Core
 */
export enum AuthSubject {
    AUTH = 'auth',
    MFA = 'mfa',
  }
  