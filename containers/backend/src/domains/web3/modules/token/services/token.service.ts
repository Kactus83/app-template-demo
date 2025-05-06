import { Injectable, Logger } from '@nestjs/common';
import { Contract, ContractTransactionResponse } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { ContractService } from '../../../../../domains/web3/common/services/contract.service';
import { Web3Service } from '../../../../../domains/web3/common/services/web3.service';
import { TokenContract } from '../../../../../domains/web3/modules/dynamic/models/types';

@Injectable()
export class TokenService {
  public tokenContract: TokenContract;
  private readonly logger = new Logger(TokenService.name);

  constructor(private readonly web3Service: Web3Service, private readonly contractService: ContractService) {

    // 🚧 Neutralisation en prod pour la =version demo
    if (process.env.DISABLE_WEB3 === 'true') {
      this.logger.warn('🔒 TokenService neutralisé (pas de blockchain en prod)');
      // Pas d'initialisation du contrat, mais on définit un stub vide 
      this.tokenContract = {} as any;
      return;
    }

    const deploymentsPath = path.join(__dirname, '../../../../../../../deployments/web3');
    const tokenDeploymentPath = path.join(deploymentsPath, 'TokenContract.json');
    const contractName = 'TokenContract';

    if (fs.existsSync(tokenDeploymentPath)) {
      const tokenDeployment = JSON.parse(fs.readFileSync(tokenDeploymentPath, 'utf-8'));
      const tokenAbi = tokenDeployment.abi;
      const tokenAddress = tokenDeployment.address;

      this.tokenContract = new Contract(
        tokenAddress,
        tokenAbi,
        this.web3Service.signer,
      ) as unknown as TokenContract;

      this.contractService.upsertContract(contractName, tokenAddress, tokenAbi)
        .then(() => {
          this.logger.log(`Contrat ${contractName} enregistré ou mis à jour en base de données.`);
        })
        .catch((error) => {
          this.logger.error(`Erreur lors de la mise à jour du contrat ${contractName}:`, error);
        });
    } else {
      this.logger.error(`Le fichier ${contractName}.json est introuvable à ${tokenDeploymentPath}.`);
      throw new Error(`Impossible d'initialiser le contrat ${contractName} sans le fichier de déploiement.`);
    }
  }

  /**
   * Mint des tokens ERC20.
   * @param to Adresse du destinataire
   * @param amount Quantité à mint (en wei)
   */
  async mint(to: string, amount: bigint): Promise<void> {
    const tx: ContractTransactionResponse = await this.tokenContract.mint(to, amount);
    await tx.wait();
  }

  /**
   * Obtient le solde de tokens ERC20 pour une adresse donnée.
   * @param address Adresse du wallet.
   * @returns Le solde de tokens en bigint.
   */
  async getBalance(address: string): Promise<bigint> {
    return this.tokenContract.balanceOf(address);
  }

  /**
   * Obtient le solde total de tokens ERC20 pour plusieurs adresses.
   * @param addresses Tableau des adresses des wallets.
   * @returns Le solde total de tokens en bigint.
   */
  async getTotalBalance(addresses: string[]): Promise<bigint> {
    const balancePromises = addresses.map(address => this.getBalance(address));
    const balances: bigint[] = await Promise.all(balancePromises);
    return balances.reduce((acc, balance) => acc + balance, BigInt(0));
  }

  /**
   * Définit la nouvelle limite maximale d'approvisionnement.
   * @param newMaxSupply Nouvelle limite maximale.
   */
  async setMaxSupply(newMaxSupply: bigint): Promise<void> {
    const tx: ContractTransactionResponse = await this.tokenContract.setMaxSupply(newMaxSupply);
    await tx.wait();
  }

  /**
   * Obtient le timestamp de la dernière mise à jour de la limite maximale d'approvisionnement.
   * @returns Timestamp en bigint.
   */
  async getLastMaxSupplyChanged(): Promise<bigint> {
    return this.tokenContract.getLastMaxSupplyChanged();
  }

  /**
   * Obtient la limite maximale actuelle d'approvisionnement.
   * @returns Limite maximale en bigint.
   */
  async getMaxSupply(): Promise<bigint> {
    return this.tokenContract.maxSupply();
  }

  /**
   * Obtient l'adresse du propriétaire.
   * @returns Adresse du propriétaire.
   */
  async getOwner(): Promise<string> {
    return this.tokenContract.owner();
  }
}
