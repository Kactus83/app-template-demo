import { Injectable, Logger } from '@nestjs/common';
import { Contract, ContractTransactionResponse } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { ContractService } from '../../../../../domains/web3/common/services/contract.service';
import { Web3Service } from '../../../../../domains/web3/common/services/web3.service';
import { NFTContract } from '../../../../../domains/web3/modules/dynamic/models/types';

@Injectable()
export class NFTService {
  public nftContract: NFTContract;
  private readonly logger = new Logger(NFTService.name);

  constructor(private readonly web3Service: Web3Service, private readonly contractService: ContractService) {

    // 🚧 Neutralisation en prod pour le demo simplifié
    if (process.env.DISABLE_WEB3 === 'true') {
      this.logger.warn('🔒 NFTService neutralisé (pas de blockchain en prod)');
      // Pas d'initialisation du contrat, mais on définit un stub vide 
      this.nftContract = {} as any;
      return;
    }

    const deploymentsPath = path.join(__dirname, '../../../../../../../deployments/web3');
    const nftDeploymentPath = path.join(deploymentsPath, 'NFTContract.json');
    const contractName = 'NFTContract';

    if (fs.existsSync(nftDeploymentPath)) {
      const nftDeployment = JSON.parse(fs.readFileSync(nftDeploymentPath, 'utf-8'));
      const nftAbi = nftDeployment.abi;
      const nftAddress = nftDeployment.address;

      this.nftContract = new Contract(
        nftAddress,
        nftAbi,
        this.web3Service.signer,
      ) as unknown as NFTContract;

      this.contractService.upsertContract(contractName, nftAddress, nftAbi)
        .then(() => {
          this.logger.log(`Contrat ${contractName} enregistré ou mis à jour en base de données.`);
        })
        .catch((error) => {
          this.logger.error(`Erreur lors de la mise à jour du contrat ${contractName}:`, error);
        });
    } else {
      this.logger.error(`Le fichier ${contractName}.json est introuvable à ${nftDeploymentPath}.`);
      throw new Error(`Impossible d'initialiser le contrat ${contractName} sans le fichier de déploiement.`);
    }
  }

  /**
   * Mint des NFTs ERC1155.
   * @param to Adresse du destinataire
   * @param tokenId ID du token
   * @param amount Quantité à mint
   * @param data Données supplémentaires
   */
  async mint(to: string, tokenId: bigint, amount: bigint, data: string): Promise<void> {
    const tx: ContractTransactionResponse = await this.nftContract.mint(to, tokenId, amount, data);
    await tx.wait();
  }

  /**
   * Obtient le solde de NFTs ERC1155 pour une adresse donnée et un tokenId spécifique.
   * @param address Adresse du wallet.
   * @param tokenId ID du token.
   * @returns Le solde de NFTs en bigint.
   */
  async getBalance(address: string, tokenId: bigint): Promise<bigint> {
    return this.nftContract.balanceOf(address, tokenId);
  }

  /**
   * Obtient le solde total de NFTs ERC1155 pour un tokenId spécifique et plusieurs adresses.
   * @param addresses Tableau des adresses des wallets.
   * @param tokenId ID du token.
   * @returns Le solde total de NFTs en bigint.
   */
  async getTotalBalance(addresses: string[], tokenId: bigint): Promise<bigint> {
    const balancePromises = addresses.map(address => this.getBalance(address, tokenId));
    const balances: bigint[] = await Promise.all(balancePromises);
    return balances.reduce((acc, balance) => acc + balance, BigInt(0));
  }
}
