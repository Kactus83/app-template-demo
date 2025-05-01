import { Injectable, Logger } from '@nestjs/common';
import { AuthenticationMethod } from '@prisma/client';
import { NonceRepository } from '../repositories/nonce.repository';
import { generateNonce, verifySignature } from '../utils/web3-auth.utils';
import { Web3AccountRepository } from '../repositories/web3-account.repository';
import { Web3MFARequestResponseDto } from '../../MFA/models/dto/MFARequestResponseDto';
import { MFAValidationData } from '../../MFA/models/dto/MFAValidationData';
import { UserWithRelations } from '../../../../../core/models/types/userWithRelations.type';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';
import { AuthMethodService } from '../../MFA/models/abstract/auth-method.service';
import { AuthMethodsService } from '../../../common/services/auth-methods.service';

@Injectable()
export class Web3MFAService extends AuthMethodService {
  private readonly logger = new Logger(Web3MFAService.name);

  constructor(
    private readonly nonceRepository: NonceRepository,
    private readonly userRepository: AuthUserRepository,
    private readonly web3AccountRepository: Web3AccountRepository,
    private readonly authMethodsService: AuthMethodsService,
  ) {
    super(authMethodsService, AuthenticationMethod.WEB3);
  }

  /**
   * Demande la validation MFA pour une action spécifique
   * @param userId ID de l'utilisateur concerné
   */
  async requestMFA(userId: number): Promise<void> {
    try {
      // Générer un nonce pour chaque wallet associé à l'utilisateur
      await this.generateNoncesForMFA(userId);
    } catch (error) {
      this.logger.error(`Failed to request MFA for user ${userId}: ${error.message}`, error.stack);
      throw new Error('Failed to request MFA');
    }
  }

  /**
   * Génère un nonce pour l'authentification MFA.
   * @param userId ID de l'utilisateur
   * @returns Nonce généré
   */
  async generateNoncesForMFA(userId: number): Promise<Web3MFARequestResponseDto[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const wallets: string[] = [];

    // Filtrer les méthodes d'authentification de type WEB3
    const web3AuthMethods = user.userAuthMethods.filter(
      (authMethod) => authMethod.method === AuthenticationMethod.WEB3,
    );
    
    // Récupérer les wallets associés
    for (const authMethod of web3AuthMethods) {
      const web3Account = await this.web3AccountRepository.findById(authMethod.methodId!);
      if (web3Account) {
        wallets.push(web3Account.wallet);
      }
    }    

    // Supprimer les anciens nonces
    await this.nonceRepository.deleteUserMFANonces(userId);

    // Générer un nouveau nonce pour chaque wallet
    const web3MFARequestResponseDtos = [];
    for (const wallet of wallets) {
      const nonce = generateNonce();
      await this.nonceRepository.createMFANonce(userId, wallet, nonce);
      web3MFARequestResponseDtos.push({
        web3Wallet: wallet,
        web3Nonce: nonce,
      });
    }

    return web3MFARequestResponseDtos;
  }

  /**
   * Vérifie la validation MFA pour les wallets Web3.
   * @param userId ID de l'utilisateur
   * @param data Données de validation MFA
   * @returns Vrai si toutes les signatures sont valides, faux sinon
   */
  async validateMFA(userId: number, data: MFAValidationData): Promise<boolean> {
    const user: UserWithRelations = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const requiredWallets: string[] = [];

    // Récupérer les wallets associés aux méthodes d'authentification Web3
    const web3AuthMethods = user.userAuthMethods.filter(
      (authMethod) => authMethod.method === AuthenticationMethod.WEB3,
    );
    
    for (const authMethod of web3AuthMethods) {
      const web3Account = await this.web3AccountRepository.findById(authMethod.methodId!);
      if (web3Account) {
        requiredWallets.push(web3Account.wallet);
      }
    }    

    if (requiredWallets.length === 0) {
      // Aucune méthode Web3 requise pour la MFA
      return true;
    }

    // Vérifier que des signatures ont été fournies
    const web3Signatures = data.web3Signatures;
    if (!web3Signatures || web3Signatures.length === 0) {
      throw new Error('No Web3 signatures provided');
    }

    // Créer un map pour un accès rapide aux signatures par wallet
    const signatureMap = new Map<string, string>();
    for (const sig of web3Signatures) {
      signatureMap.set(sig.wallet.toLowerCase(), sig.signature);
    }

    // Vérifier chaque wallet requis
    for (const wallet of requiredWallets) {
      const signature = signatureMap.get(wallet.toLowerCase());
      if (!signature) {
        throw new Error(`No signature provided for wallet ${wallet}`);
      }

      const isValid = await this.verifySignatureForMFA(wallet, signature);
      if (!isValid) {
        throw new Error(`Invalid signature for wallet ${wallet}`);
      }

      // Marquer le nonce comme validé
      await this.nonceRepository.markMFANonceAsValidated(wallet);
    }

    await this.nonceRepository.deleteUserMFANonces(userId);
    return true;
  }

  /**
   * Vérifie la signature pour un wallet spécifique dans le cadre de la MFA.
   * @param wallet Adresse du portefeuille
   * @param signature Signature de la nonce
   * @returns Vrai si la signature est valide, faux sinon
   */
  async verifySignatureForMFA(wallet: string, signature: string): Promise<boolean> {
    const walletMFANonce = await this.nonceRepository.findMFANonceByWallet(wallet);
    if (!walletMFANonce) {
      throw new Error(`No MFA nonce found for wallet ${wallet}`);
    }

    const isValid = verifySignature(wallet, walletMFANonce.nonce, signature);
    if (!isValid) {
      return false;
    }

    return true;
  }
}