import { Injectable, Logger } from '@nestjs/common';
import { Contract, ContractTransactionResponse } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { ContractService } from '../../../../../domains/web3/common/services/contract.service';
import { Web3Service } from '../../../../../domains/web3/common/services/web3.service';
import { TokenSale } from '../../../../../domains/web3/modules/dynamic/models/types';

@Injectable()
export class TokenSaleService {
  public tokenSaleContract: TokenSale;
  private readonly logger = new Logger(TokenSaleService.name);

  constructor(
    private readonly web3Service: Web3Service,
    private readonly contractService: ContractService
  ) {
    const deploymentsPath = path.join(__dirname, '../../../../../../../deployments/web3');
    const tokenSaleDeploymentPath = path.join(deploymentsPath, 'TokenSale.json');
    const contractName = 'TokenSale';

    if (fs.existsSync(tokenSaleDeploymentPath)) {
      const tokenSaleDeployment = JSON.parse(fs.readFileSync(tokenSaleDeploymentPath, 'utf-8'));
      const tokenSaleAbi = tokenSaleDeployment.abi;
      const tokenSaleAddress = tokenSaleDeployment.address;

      this.tokenSaleContract = new Contract(
        tokenSaleAddress,
        tokenSaleAbi,
        this.web3Service.signer
      ) as unknown as TokenSale;

      this.contractService.upsertContract(contractName, tokenSaleAddress, tokenSaleAbi)
        .then(() => {
          this.logger.log(`Contrat ${contractName} enregistré ou mis à jour en base de données.`);
        })
        .catch((error) => {
          this.logger.error(`Erreur lors de la mise à jour du contrat ${contractName}:`, error);
        });
    } else {
      this.logger.error(`Le fichier ${contractName}.json est introuvable à ${tokenSaleDeploymentPath}.`);
      throw new Error(`Impossible d'initialiser le contrat ${contractName} sans le fichier de déploiement.`);
    }
  }

  /**
   * Définit l'adresse du contrat TokenContract.
   * @param token Adresse du contrat TokenContract.
   */
  async setToken(token: string): Promise<void> {
    const tx: ContractTransactionResponse = await this.tokenSaleContract.setToken(token);
    await tx.wait();
  }

  /**
   * Définit le taux de vente (tokens par ETH).
   * @param rate Nouveau taux.
   */
  async setRate(rate: bigint): Promise<void> {
    const tx: ContractTransactionResponse = await this.tokenSaleContract.setRate(rate);
    await tx.wait();
  }

  /**
   * Retire une certaine quantité d'ETH du contrat.
   * @param amount Quantité d'ETH à retirer (en wei).
   */
  async withdrawETH(amount: bigint): Promise<void> {
    const tx: ContractTransactionResponse = await this.tokenSaleContract.withdrawETH(amount);
    await tx.wait();
  }

  /**
   * Retire une certaine quantité de tokens du contrat.
   * @param amount Quantité de tokens à retirer.
   */
  async withdrawTokens(amount: bigint): Promise<void> {
    const tx: ContractTransactionResponse = await this.tokenSaleContract.withdrawTokens(amount);
    await tx.wait();
  }

  /**
   * Obtient le taux de vente actuel.
   * @returns Le taux de vente (tokens par ETH).
   */
  async getRate(): Promise<bigint> {
    return this.tokenSaleContract.rate();
  }

  /**
   * Obtient l'adresse du contrat TokenContract.
   * @returns Adresse du contrat TokenContract.
   */
  async getTokenAddress(): Promise<string> {
    return this.tokenSaleContract.token();
  }

  /**
   * Obtient l'adresse du propriétaire.
   * @returns Adresse du propriétaire.
   */
  async getOwner(): Promise<string> {
    return this.tokenSaleContract.owner();
  }
}
