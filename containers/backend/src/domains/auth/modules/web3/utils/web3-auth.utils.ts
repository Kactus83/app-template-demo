import { verifyMessage } from 'ethers';

/**
 * Génère un nonce aléatoire.
 * @returns Nonce unique sous forme de chaîne de caractères
 */
export const generateNonce = (): string => {
  return Math.floor(Math.random() * 1000000).toString();
};

/**
 * Vérifie la signature d'une nonce pour une adresse de portefeuille donnée.
 * @param wallet Adresse du portefeuille
 * @param nonce Nonce généré
 * @param signature Signature de la nonce
 * @returns Boolean indiquant si la signature est valide
 */
export const verifySignature = (wallet: string, nonce: string, signature: string): boolean => {
  try {
    const recoveredAddress = verifyMessage(nonce, signature);
    return recoveredAddress.toLowerCase() === wallet.toLowerCase();
  } catch (error) {
    return false;
  }
};
