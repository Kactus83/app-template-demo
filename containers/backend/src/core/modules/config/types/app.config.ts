import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { VaultSecrets } from '../../vault/types/vault-secrets.class';

/**
 * Classe représentant la configuration complète de l'application,
 * incluant les secrets récupérés depuis Vault.
 *
 * Cette classe étend VaultSecrets et contient toutes les variables de configuration
 * nécessaires au fonctionnement de l'application.
 * @category Core
 * @category Config
 */
export class AppConfig extends VaultSecrets {
  @IsString()
  @IsNotEmpty()
  VAULT_ADDR: string;

  @IsString()
  @IsNotEmpty()
  VAULT_CREDENTIALS_PATH: string;
  
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsNumber()
  JWT_EXPIRATION_BUFFER: number;

  @IsString()
  JWT_ISSUER: string;

  @IsString()
  JWT_MAX_AGE: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  GOOGLE_CALLBACK_URL: string;

  @IsString()
  GITHUB_CLIENT_ID: string;

  @IsString()
  GITHUB_CLIENT_SECRET: string;

  @IsString()
  GITHUB_CALLBACK_URL: string;

  @IsString()
  FACEBOOK_CLIENT_ID: string;

  @IsString()
  FACEBOOK_CLIENT_SECRET: string;

  @IsString()
  FACEBOOK_CALLBACK_URL: string;

  @IsString()
  SESSION_SECRET: string;

  @IsString()
  FRONTEND_URL: string;

  @IsString()
  MAIL_SERVICE: string;

  @IsString()
  MAIL_HOST: string;

  @IsNumber()
  MAIL_PORT: number;

  @IsString()
  MAIL_FROM: string;

  @IsString()
  MAIL_FROM_NAME: string;

  @IsString()
  @IsOptional()
  MAIL_USER?: string;

  @IsString()
  @IsOptional()
  MAIL_PASS?: string;

  @IsString()
  TWILIO_ACCOUNT_SID: string;

  @IsString()
  TWILIO_AUTH_TOKEN: string;

  @IsString()
  TWILIO_VERIFY_SERVICE_SID: string;

  @IsString()
  deployerAddress: string;

  @IsString()
  deployerPrivateKey: string;
}
