import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import nodeVault from 'node-vault';
import { VaultSecrets } from '../types/vault-secrets.class';
import { plainToInstance } from 'class-transformer';
import { EnvConfig } from '../../config/types/env.config';
import { validateSync } from 'class-validator';

/**
 * @class VaultService
 * @description Service chargé de gérer la connexion à Vault, l'authentification,
 * la récupération des secrets et leur fusion avec les variables d'environnement.
 *
 * Ce service utilise la bibliothèque node-vault pour interagir avec le serveur Vault.
 * Il lit les credentials depuis un fichier, valide la configuration initiale et récupère
 * les secrets depuis différents chemins dans Vault.
 */
@Injectable()
export class VaultService {
  private client: nodeVault.client;
  private secrets: VaultSecrets = new VaultSecrets();
  private readonly logger = new Logger(VaultService.name);
  private initialized = false;

  constructor() {
    this.logger.log('VaultService loaded');
  }

  /**
   * Initialise Vault en validant la configuration initiale, en s'authentifiant,
   * en récupérant les secrets et en fusionnant ces derniers dans process.env.
   *
   * @returns {Promise<void>}
   * @throws Une erreur en cas d'échec de l'initialisation.
   */
  async initializeVault(): Promise<void> {
    this.logger.log('Initializing Vault...');
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    try {
      // Valider la configuration initiale
      this.validateInitialConfig();

      const vaultAddress = process.env.VAULT_ADDR;
      const credentialsPath = process.env.VAULT_CREDENTIALS_PATH;

      this.client = nodeVault({
        apiVersion: 'v1',
        endpoint: vaultAddress,
      });

      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      // Destructuring des credentials pour satisfaire le linter
      const { role_id: roleId, secret_id: secretId } = credentials;

      this.logger.log('Authentification avec Vault...');

      // Idem, pour satisfaiure le linter (solution temporaire car pas très elegant quand meme..)
      const authResponse = await this.client.approleLogin({ role_id: roleId, secret_id: secretId });
      this.client.token = authResponse.auth.client_token;

      this.logger.log('Authentification réussie avec Vault.');

      await this.fetchSecrets('secrets/data/backend');
      await this.fetchSecrets('secrets/data/blockchain');

      this.mergeSecretsWithEnv();
    } catch (error) {
      this.logger.error('Erreur lors de l\'initialisation de Vault:', error);
      throw error;
    }
  }

  /**
   * Valide la configuration initiale à partir des variables d'environnement.
   *
   * @throws Une erreur si la validation échoue.
   */
  private validateInitialConfig(): void {
    const config = process.env;

    const validatedConfig = plainToInstance(EnvConfig, config, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
      const errorMessages = errors
        .map(err => `${err.property}: ${Object.values(err.constraints || {}).join(', ')}`)
        .join('; ');
      throw new Error(`Initial configuration validation failed: ${errorMessages}`);
    }

    this.logger.log('Configuration initiale validée avec succès.');
  }

  /**
   * Récupère les secrets depuis Vault à l'aide du chemin spécifié.
   *
   * @param {string} secretPath - Chemin dans Vault où se trouvent les secrets.
   * @returns {Promise<void>}
   * @throws Une erreur en cas d'échec de la récupération.
   */
  private async fetchSecrets(secretPath: string): Promise<void> {
    try {
      const secretsResponse = await this.client.read(secretPath);
      const secretsData = secretsResponse.data.data;

      const fetchedSecrets = plainToInstance(VaultSecrets, secretsData, {
        enableImplicitConversion: true,
      });

      Object.assign(this.secrets, fetchedSecrets);

      this.logger.log(`Secrets récupérés depuis ${secretPath}.`);
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des secrets depuis ${secretPath}:`, error);
      throw error;
    }
  }

  /**
   * Fusionne les secrets récupérés avec les variables d'environnement existantes.
   */
  private mergeSecretsWithEnv(): void {
    Object.assign(process.env, this.secrets);
    this.logger.log('Les secrets ont été fusionnés avec les variables d\'environnement.');
  }
}
