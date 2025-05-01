import * as fs from 'fs';
import * as path from 'path';
import vault from 'node-vault';
import dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement

export class VaultService {
  private client: any;

  constructor() {}

  /**
   * Initialise le client Vault en utilisant AppRole et retourne une instance configurée.
   */
  async initializeVault(role: string): Promise<void> {
    try {
      // Définir le chemin des credentials AppRole
      const credentialsPath = path.resolve(`/app/deployments/vault/${role}-credentials.json`);

      if (!fs.existsSync(credentialsPath)) {
        console.error(`Fichier de credentials Vault non trouvé à ${credentialsPath}`);
        throw new Error(`Fichier de credentials Vault non trouvé à ${credentialsPath}`);
      }

      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      const { role_id, secret_id } = credentials;

      // Initialiser le client Vault
      this.client = vault({
        apiVersion: 'v1',
        endpoint: process.env.VAULT_ADDR || 'http://vault:8200',
      });

      // Authentifier avec AppRole
      const authResponse = await this.client.approleLogin({ role_id, secret_id });
      this.client.token = authResponse.auth.client_token;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Vault:', error);
      throw error;
    }
  }

  /**
   * Stocker un secret dans Vault.
   * @param secretPath Chemin où le secret sera stocké.
   * @param data Les données à stocker.
   */
  async storeSecret(secretPath: string, data: Record<string, any>): Promise<void> {
    try {
        await this.client.write(`${secretPath}`, { data });
        console.info(`Secrets stockés avec succès dans Vault à ${secretPath}`);
    } catch (error) {
        console.error('Erreur lors du stockage des secrets dans Vault:', error);
        throw error;
    }
  }

}
