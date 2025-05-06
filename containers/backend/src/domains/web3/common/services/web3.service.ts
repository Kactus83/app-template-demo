import { Injectable , Logger } from '@nestjs/common';
import { JsonRpcProvider, Wallet } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class Web3Service {
  public provider: JsonRpcProvider;
  public signer: Wallet;

  constructor() {
    const logger = new Logger(Web3Service.name);

    
    if (process.env.DISABLE_WEB3 === 'true') {
      logger.warn('🔒 Web3Service neutralisé (pas de blockchain en prod)');
      // Stub minimal
      this.provider = {} as any;
      this.signer   = {} as any;
      return;
    }

    // Définir le chemin du dossier deployments
    const deploymentsPath = path.join(__dirname, '../../../../../../deployments/web3');

    // Charger Backend.json pour obtenir la clé privée et l'adresse du deployer
    const backendPath = path.join(deploymentsPath, 'Backend.json');
    if (!fs.existsSync(backendPath)) {
      logger.error(`Le fichier Backend.json n'existe pas à ${backendPath}`);
      throw new Error(`Le fichier Backend.json n'existe pas à ${backendPath}`);
    }

    const backendData = JSON.parse(fs.readFileSync(backendPath, 'utf-8'));
    const deployerPrivateKey = backendData.privateKey;

    if (!deployerPrivateKey) {
      logger.error("La clé privée du deployer n'est pas définie dans Backend.json");
      throw new Error("La clé privée du deployer n'est pas définie dans Backend.json");
    }

    // Initialiser le provider (Hardhat local)
    const providerUrl = 'http://web3-contract:8545'; // Nom du service dans docker-compose
    this.provider = new JsonRpcProvider(providerUrl);

    // Initialiser le signer
    this.signer = new Wallet(deployerPrivateKey, this.provider);
  }
}
