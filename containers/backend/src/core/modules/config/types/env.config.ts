import { IsString } from 'class-validator';

/**
 * Classe représentant la configuration minimale attendue depuis l'environnement.
 *
 * Cette classe définit les variables d'environnement essentielles (ici uniquement
 * les informations relatives à Vault), et sert de contrat pour la validation des valeurs fournies.
 * @category Core
 * @category Config
 */
export class EnvConfig {
  @IsString()
  VAULT_ADDR: string;

  @IsString()
  VAULT_CREDENTIALS_PATH: string;
}
