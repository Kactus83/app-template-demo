import { Injectable, Logger } from '@nestjs/common';
import { MFARepository } from '../repositories/mfa.repository';
import { SecureAction, AuthenticationMethod } from '@prisma/client';
import { MFAValidationData } from '../models/dto/MFAValidationData';
import { MFARequestResponseDto, PartialMFARequestResponseDto } from '../models/dto/MFARequestResponseDto';
import { AuthMethodsService } from '../../../common/services/auth-methods.service';
import { JwtService } from '@nestjs/jwt';
import { generateRandomMFAToken, mergeMFAResponses } from '../utils/mfa-utils';
import { UserWithRelations } from '../../../../../core/models/types/userWithRelations.type';
import { IAuthMethodService } from '../../../../../domains/auth/modules/MFA/models/interfaces/IAuthMethodService';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';

@Injectable()
export class MFAService {
  private readonly logger = new Logger(MFAService.name);
  private authModules: Map<AuthenticationMethod, IAuthMethodService>;

  constructor(
    private readonly mfaRepository: MFARepository,
    private readonly userRepository: AuthUserRepository,
    private readonly authMethodsService: AuthMethodsService,
    private readonly jwtService: JwtService,
  ) {
    console.log('MFA Service initialing...');
    this.initializeAuthModules();
  }
  
  /**
   * Initialize or reinitialize the auth modules.
   */
  initializeAuthModules(): void {
    this.authModules = new Map();
    this.authModules.clear();
    const modules = this.authMethodsService.getServices();
    modules.forEach((module: IAuthMethodService) => {
      if (this.authModules.has(module.authModuleName)) {
        throw new Error(`Duplicate AuthMethodModule for method: ${module.authModuleName}`);
      }
      this.authModules.set(module.authModuleName, module);
      console.log(`Auth module ${module.authModuleName} initialized successfully.`);
    });
    this.logger.log(`Auth modules initialized: ${Array.from(this.authModules.keys()).join(', ')}`);
  }

  /**
   * Initie le processus MFA pour un utilisateur.
   * @param userId ID de l'utilisateur
   * @param secureActionType Action sécurisée à valider
   * @returns Les méthodes d'authentification disponibles, le token MFA et d'autres données pertinentes
   */
  async initiateMFA(userId: number, secureActionType: SecureAction): Promise<MFARequestResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    this.logger.log(`MFA Requested for user ID: ${userId}`);

    // Récupérer les méthodes d'authentification de l'utilisateur
    const availableAuthMethods = this.getUserAuthMethods(user);
    this.logger.log(`Auth methods for user ${userId}: ${availableAuthMethods.join(', ')}`);
    this.logger.log(`Service auth methods : ${Array.from(this.authModules.keys()).join(', ')}`);

    // Filtrer les méthodes implémentées
    const implementedAuthMethods = this.getImplementedAuthMethods(availableAuthMethods);

    if (implementedAuthMethods.length === 0) {
      throw new Error('No available authentication methods for MFA');
    }

    // Nettoyer tous les tokens MFA existants pour l'utilisateur
    await this.mfaRepository.cleanupTokens(userId);

    // Générer un token MFA unique
    const token = generateRandomMFAToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expire dans 15 minutes

    // Créer un nouveau token MFA avec les méthodes requises
    await this.mfaRepository.create(
      userId,
      token,
      secureActionType,
      implementedAuthMethods,
      expiresAt
    );

    // Démarrer le processus MFA pour chaque méthode et récupérer les réponses
    const partialResponse = await this.initiateAuthMethodsMFA(userId, implementedAuthMethods);

    // Ajouter les auth methods pour créer le dto complet
    const response: MFARequestResponseDto = {
      ...partialResponse,
      authMethods: implementedAuthMethods,
    };

    this.logger.log(`MFA initiated for user ${userId} with token ${token}, and auth methods: ${implementedAuthMethods.join(', ')}`);

    return response;
  }

  /**
   * Valide un token MFA avec les données fournies.
   * @param userId ID de l'utilisateur
   * @param data Données de validation MFA
   * @returns True si la validation est réussie, sinon False
   */
  async validateMFA(userId: number, data: MFAValidationData): Promise<boolean> {
    this.logger.log(`Validating MFA for user ${userId} with data: ${JSON.stringify(data)}`);

    const mfaToken = await this.mfaRepository.findTokenByUserId(userId);

    if (!mfaToken) {
      this.logger.warn(`No MFA token found for user ${userId}`);
      return false;
    }

    const { stepsRequired, stepsValidated } = mfaToken;

    this.logger.log(`MFA Steps required for user ${userId}: ${stepsRequired.join(', ')}`);

    // Valider chaque méthode d'authentification requise
    for (const method of stepsRequired) {
      // Ignorer les méthodes déjà validées
      if (stepsValidated.includes(method)) continue;

      const authModule = this.authModules.get(method);

      if (authModule) {
        this.logger.log(`Validating MFA step ${method} for user ${userId}, in module ${authModule.constructor.name}`);
        const isValid = await authModule.validateMFA(userId, data);
        if (isValid) {
          stepsValidated.push(method);
        } else {
          this.logger.error(`Validation failed for method ${method} for user ${userId}`);
          return false;
        }
      } else {
        this.logger.error(`No auth module found for method ${method}`);
        return false;
      }
    }

    this.logger.log(`MFA Steps validated for user ${userId}: ${stepsValidated.join(', ')}`);

    // Mettre à jour les étapes validées dans le token MFA
    await this.mfaRepository.updateStepsValidated(mfaToken.id, stepsValidated);

    // Vérifier si toutes les étapes requises sont validées
    const allValidated = stepsRequired.every((method: AuthenticationMethod) =>
      stepsValidated.includes(method)
    );

    if (allValidated) {
      this.logger.log(`All MFA steps validated for user ${userId}`);
      return true;
    }

    return false;
  }

  /**
   * Génère un JWT après la validation du MFA.
   * @param userId ID de l'utilisateur.
   * @returns Le token JWT généré.
   */
  async generateJWTAfterMFA(userId: number): Promise<string> {
    // Récupérer le token MFA
    const mfaToken = await this.mfaRepository.findTokenByUserId(userId);
    if (!mfaToken) {
      throw new Error('Aucun token MFA trouvé pour cet utilisateur.');
    }

    // Vérifier que toutes les étapes ont été validées
    if (mfaToken.stepsValidated.length !== mfaToken.stepsRequired.length) {
      throw new Error('Toutes les étapes MFA n\'ont pas été validées.');
    }

    // Récupérer l'action sécurisée
    const action = mfaToken.action;

    // Récupérer l'utilisateur
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Utilisateur introuvable.');
    }

    // Générer le token JWT avec l'action autorisée
    const payload = {
      userId: user.id,
      roles: user.roles,
      authorizedAction: action, // Ajout de l'action sécurisée
    };

    const token = this.jwtService.sign(payload);

    // Marquer le token MFA comme utilisé
    await this.mfaRepository.markAsUsed(mfaToken.id);

    this.logger.log(`JWT généré pour l'utilisateur ${userId} avec action sécurisée ${action}`);

    return token;
  }

  /**
   * Récupère les méthodes d'authentification de l'utilisateur.
   * @param user Utilisateur
   * @returns Tableau des méthodes d'authentification
   */
  private getUserAuthMethods(user: UserWithRelations): AuthenticationMethod[] {
    return user.userAuthMethods.map((authMethod) => authMethod.method);
  }

  /**
   * Filtre les méthodes d'authentification implémentées.
   * @param methods Tableau des méthodes d'authentification disponibles
   * @returns Tableau des méthodes implémentées
   */
  private getImplementedAuthMethods(methods: AuthenticationMethod[]): AuthenticationMethod[] {
    const result = methods.filter((method) => this.authModules.has(method));
    this.logger.log(`Implemented auth methods: ${result.join(', ')}`);
    return result;
  }

  /**
   * Initie la validation MFA pour chaque méthode d'authentification implémentée de manière parallèle.
   * @param userId ID de l'utilisateur
   * @param methods Tableau des méthodes d'authentification implémentées
   * @returns Un objet `PartialMFARequestResponseDto` fusionné avec les réponses des différentes méthodes
   */
  private async initiateAuthMethodsMFA(userId: number, methods: AuthenticationMethod[]): Promise<PartialMFARequestResponseDto> {
    const promises = methods.map(async (method) => {
      const authModule = this.authModules.get(method);
      if (authModule) {
        try {
          const response = await authModule.requestMFA(userId);
          return response;
        } catch (error) {
          if (error instanceof Error) {
            this.logger.error(`Erreur lors de l'initiation de la méthode MFA ${method}: ${error.message}`);
            throw new Error(`Erreur lors de l'initiation de la méthode MFA ${method}: ${error.message}`);
          } else {
            this.logger.error(`Erreur lors de l'initiation de la méthode MFA ${method}: ${error}`);
            throw new Error(`Erreur lors de l'initiation de la méthode MFA ${method}: ${String(error)}`);
          }
        }
      }
      return undefined;
    });

    const responses = await Promise.all(promises);
    const validResponses = responses.filter((response): response is PartialMFARequestResponseDto => response !== undefined);

    const mergedResponse: PartialMFARequestResponseDto = mergeMFAResponses(validResponses);

    return mergedResponse;
  }
}
