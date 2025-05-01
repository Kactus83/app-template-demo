import { randomBytes } from 'crypto';

/**
 * Génère un token aléatoire sécurisé.
 * @param length Longueur du token en bytes. Par défaut 30.
 * @returns Le token généré sous forme de chaîne hexadécimale.
 */
export function generateRandomToken(length: number = 30): string {
  return randomBytes(length).toString('hex');
}