import { PartialMFARequestResponseDto } from "../models/dto/MFARequestResponseDto";

/**
 * Génère un token aléatoire sécurisé.
 * @returns Token généré
 */
export function generateRandomMFAToken(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Fusionne un tableau de `PartialMFARequestResponseDto` en un seul objet.
 * @param responses Tableau des réponses MFA à fusionner
 * @returns Un objet `PartialMFARequestResponseDto` fusionné
 */
export function mergeMFAResponses(responses: PartialMFARequestResponseDto[]): PartialMFARequestResponseDto {
  const merged: PartialMFARequestResponseDto = {};

  for (const response of responses) {
    if (response.web3MFARequestResponse) {
      if (!merged.web3MFARequestResponse) {
        merged.web3MFARequestResponse = [];
      }
      merged.web3MFARequestResponse.push(...response.web3MFARequestResponse);
    }

    // Ajoutez d'autres propriétés si nécessaire
    // Exemple :
    // if (response.emailMFARequestResponse) {
    //   merged.emailMFARequestResponse = response.emailMFARequestResponse;
    // }
  }

  return merged;
}