import { Injectable, Logger } from '@nestjs/common';
import { Web3AccountRepository } from '../repositories/web3-account.repository';
import { NonceRepository } from '../repositories/nonce.repository';
import { CommunicationService } from '../../../../../domains/communication/communication.service';
import { AuthenticationMethod } from '@prisma/client';
import { Web3AccountDto } from '../models/dto/web3-account.dto';
import { generateNonce, verifySignature } from '../utils/web3-auth.utils';
import { plainToClass } from 'class-transformer';
import { JwtUtilityService } from '../../../../../core/services/jwt-utility.service';
import { UserDto } from '../../../../../core/models/dto/user.dto';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';
import { LoginResponseDto } from '../../../../../domains/auth/common/models/dto/login-response.dto';

@Injectable()
export class Web3AuthService {
  private readonly logger = new Logger(Web3AuthService.name);

  constructor(
    private readonly userRepository: AuthUserRepository,
    private readonly nonceRepository: NonceRepository,
    private readonly web3AccountRepository: Web3AccountRepository,
    private readonly jwtUtilityService: JwtUtilityService,
    private readonly communicationService: CommunicationService,
  ) {}

  /**
   * Génère un nonce unique pour une adresse de portefeuille donnée.
   * @param wallet Adresse du portefeuille
   * @returns Nonce généré
   */
  async generateNonce(wallet: string): Promise<string> {
    let nonceEntry = await this.nonceRepository.findByWallet(wallet);
    if (nonceEntry) {
      // Supprimer l'ancien nonce
      await this.nonceRepository.deleteByWallet(wallet);
    }

    const nonce = generateNonce();
    await this.nonceRepository.create(wallet, nonce);
    return nonce;
  }

  /**
   * Vérifie la signature et authentifie l'utilisateur Web3.
   * @param wallet Adresse du portefeuille
   * @param signature Signature de la nonce
   * @returns Objet contenant l'utilisateur et le token JWT
   */
  async authenticate(wallet: string, signature: string): Promise<LoginResponseDto> {
    const nonceEntry = await this.nonceRepository.findByWallet(wallet);
    if (!nonceEntry) {
      throw new Error('Nonce not found for this wallet');
    }

    const isValid = verifySignature(wallet, nonceEntry.nonce, signature);
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    // Supprimer le nonce après vérification
    await this.nonceRepository.delete(nonceEntry.id);

    // Vérifier si un Web3Account existe pour ce wallet
    let web3Account = await this.web3AccountRepository.findByWallet(wallet);

    let user;
    if (web3Account) {
      // Récupérer l'utilisateur associé
      user = await this.userRepository.findById(web3Account.userId);
    } else {
      // Créer un nouvel utilisateur sans email ni mot de passe
      user = await this.userRepository.create({
        email: null,
        isEmailVerified: false,
        secondaryEmail: null,
        isSecondaryEmailVerified: false,
        password: null,
        firstName: null,
        lastName: null,
        username: null,
        avatar: null,
        status: 'offline',
        roles: ['USER'],
        authMethods: [AuthenticationMethod.WEB3],
      }); 

      // Si l'utilisateur n'a pas de nom, définir "User-[id]" comme nom par défaut
      await this.userRepository.update(user.id, { firstName: 'User', lastName: user.id.toString() });
      user.firstName = 'User';
      user.lastName = user.id.toString(); 

      // Créer un Web3Account lié à cet utilisateur
      web3Account = await this.web3AccountRepository.create(user.id, wallet); 
      
      // Ajouter la méthode d'authentification
      await this.userRepository.addAuthMethod(user.id, {
        method: AuthenticationMethod.WEB3,
        methodId: web3Account.id,
        order: 1,
      });

      // Envoi d'un message de bienvenue via le domaine de communication
      await this.communicationService.createMessage(user.id, {
        title: 'Welcome Crypto User!',
        description: `Hello Crypto User. Welcome to our platform! Your wallet ${wallet} is now the key of your account.`,
        icon: 'welcome-icon', // Optionnel
        image: null, // Valeur par défaut pour l'image
        link: null,  // Pas de lien pour ce message
        useRouter: false, // Valeur par défaut
        read: false, // Le message n'est pas encore lu
        time: new Date(), // Date actuelle
      });

      // Envoi d'une notification via le domaine de communication
      await this.communicationService.createNotification(user.id, {
          title: 'Welcome!',
          description: 'You have successfully registered. Feel free to explore our services.',
          time: new Date(),
          read: false,
      });
    }

    if (!user) {
      throw new Error('Error creating user');
    }

    const token = this.jwtUtilityService.signToken({ userId: user.id, roles: user.roles });

    // Transformer l'utilisateur en DTO, incluant les web3Accounts
    const userDto = plainToClass(UserDto, user, { excludeExtraneousValues: true });

    return {
      user: userDto,
      token,
    };
  }

  /**
   * Génère un nonce pour ajouter un nouveau portefeuille Web3 à un utilisateur existant.
   * @param userId ID de l'utilisateur
   * @param wallet Adresse du portefeuille à ajouter
   * @returns Nonce généré
   */
  async generateAddWalletNonce(userId: number, wallet: string): Promise<string> {
    // Vérifier que le wallet n'est pas déjà lié à un autre utilisateur
    const existingAccount = await this.web3AccountRepository.findByWallet(wallet);
    if (existingAccount) {
      throw new Error('This wallet is already linked to another account');
    }

    // Générer un nonce pour l'ajout du wallet
    let nonceEntry = await this.nonceRepository.findByWallet(wallet);
    if (nonceEntry) {
      // Supprimer l'ancien nonce
      await this.nonceRepository.deleteByWallet(wallet);
    }

    const nonce = generateNonce();
    await this.nonceRepository.create(wallet, nonce);
    return nonce;
  }

  /**
   * Ajoute un nouveau portefeuille Web3 à l'utilisateur après vérification de la signature.
   * @param userId ID de l'utilisateur
   * @param wallet Adresse du portefeuille à ajouter
   * @param signature Signature de la nonce
   * @returns Web3AccountDto du portefeuille ajouté
   */
  async addWallet(userId: number, wallet: string, signature: string): Promise<Web3AccountDto> {
    const nonceEntry = await this.nonceRepository.findByWallet(wallet);
    if (!nonceEntry) {
      throw new Error('Nonce not found for this wallet');
    }

    const isValid = verifySignature(wallet, nonceEntry.nonce, signature);
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    // Supprimer le nonce après vérification
    await this.nonceRepository.delete(nonceEntry.id);

    // Vérifier à nouveau si le wallet est déjà lié (au cas où)
    const existingAccount = await this.web3AccountRepository.findByWallet(wallet);
    if (existingAccount) {
      throw new Error('This wallet is already linked to another account');
    }

    // Créer un nouveau Web3Account lié à l'utilisateur
    const web3Account = await this.web3AccountRepository.create(userId, wallet);

    // Transformer en DTO
    const web3AccountDto = plainToClass(Web3AccountDto, web3Account, { excludeExtraneousValues: true });

    // Verifier les AuthMethods de l'user et y ajouter le web3 si ça n'en fait pas partie.
    const existingUserAccount = await this.userRepository.findById(userId);
    if (!existingUserAccount) {
      throw new Error('User not found');
    }
    
    if(!existingUserAccount.authMethods.includes(AuthenticationMethod.WEB3)) {
        existingUserAccount.authMethods.push(AuthenticationMethod.WEB3);
        await this.userRepository.update(userId, { authMethods: existingUserAccount.authMethods });
    };

    return web3AccountDto;
  }

  /**
   * Supprime un portefeuille Web3 de l'utilisateur.
   * @param userId ID de l'utilisateur
   * @param wallet Adresse du portefeuille à supprimer
   */
  async removeWallet(userId: number, wallet: string): Promise<void> {
    const web3Account = await this.web3AccountRepository.findByWallet(wallet);

    if (!web3Account) {
      throw new Error('Web3 wallet not found');
    }

    if (web3Account.userId !== userId) {
      throw new Error('You do not have permission to remove this wallet');
    }

    await this.web3AccountRepository.delete(web3Account.id);
  }
}