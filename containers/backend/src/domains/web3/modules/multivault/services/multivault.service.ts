import { Injectable , Logger } from '@nestjs/common';
import { Contract, ContractTransactionResponse } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

import { ContractService } from '../../../../../domains/web3/common/services/contract.service';
import { Web3Service } from '../../../../../domains/web3/common/services/web3.service';
import { MultiVault } from '../../../../../domains/web3/modules/dynamic/models/types';

@Injectable()
export class MultiVaultService {
  public multiVaultContract: MultiVault;

  constructor(private readonly web3Service: Web3Service, private readonly contractService: ContractService) {
    const logger = new Logger(MultiVaultService.name);

    

    // 🚧 Neutralisation en prod pour le demo simplifiée
    if (process.env.DISABLE_WEB3 === 'true') {
      logger.warn('🔒 MultiVaultService neutralisé (pas de blockchain en prod)');
      // Pas d'initialisation du contrat, mais on définit un stub vide 
      this.multiVaultContract = {} as any;
      return;
    }

    const deploymentsPath = path.join(__dirname, '../../../../../../../deployments/web3');
    const multiVaultDeploymentPath = path.join(deploymentsPath, 'MultiVault.json');
    const contractName = 'MultiVault';

    if (fs.existsSync(multiVaultDeploymentPath)) {
      const multiVaultDeployment = JSON.parse(fs.readFileSync(multiVaultDeploymentPath, 'utf-8'));
      const multiVaultAbi = multiVaultDeployment.abi;
      const multiVaultAddress = multiVaultDeployment.address;

      this.multiVaultContract = new Contract(
        multiVaultAddress,
        multiVaultAbi,
        this.web3Service.signer
      ) as unknown as MultiVault;

      this.contractService.upsertContract(contractName, multiVaultAddress, multiVaultAbi)
        .then(() => {
          logger.log(`Contrat ${contractName} enregistré ou mis à jour en base de données.`);
        })
        .catch((error) => {
          logger.error(`Erreur lors de la mise à jour du contrat ${contractName}:`, error);
        });
    } else {
      logger.error(`Le fichier ${contractName}.json est introuvable à ${multiVaultDeploymentPath}.`);
      throw new Error(`Impossible d'initialiser le contrat ${contractName} sans le fichier de déploiement.`);
    }
  }

  async createVault(name: string, acceptsETH: boolean, acceptsToken: boolean): Promise<void> {
    const tx: ContractTransactionResponse = await this.multiVaultContract.createVault(name, acceptsETH, acceptsToken);
    await tx.wait();
  }

  async deleteVault(name: string): Promise<void> {
    const tx: ContractTransactionResponse = await this.multiVaultContract.deleteVault(name);
    await tx.wait();
  }

  async getVaultType(name: string): Promise<bigint> {
    return this.multiVaultContract.getVaultType(name);
  }

  async getETHBalance(name: string, user: string): Promise<bigint> {
    return this.multiVaultContract.getETHBalance(name, user);
  }

  async getTokenBalance(name: string, user: string): Promise<bigint> {
    return this.multiVaultContract.getTokenBalance(name, user);
  }

  async getUsersInVault(name: string): Promise<string[]> {
    return this.multiVaultContract.getUsersInVault(name);
  }

  async getTokenAddress(): Promise<string> {
    return this.multiVaultContract.token();
  }

  async getOwner(): Promise<string> {
    return this.multiVaultContract.owner();
  }
}
