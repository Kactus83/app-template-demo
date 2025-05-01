import { Injectable, Logger } from '@nestjs/common';
import { OAuthMFATokenRepository } from '../repositories/oauth-mfa-token.repository';
import { OAuthAccountRepository } from '../repositories/oauth-account.repository';
import { OAuthAccount, AuthenticationMethod } from '@prisma/client';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';
import { generateRandomToken } from '../../../../../domains/auth/common/utils/tokenGenerator';
import { AuthMethodService } from '../../MFA/models/abstract/auth-method.service';
import { AuthMethodsService } from '../../../common/services/auth-methods.service';

@Injectable()
export class OAuthMFAService extends AuthMethodService {
  private readonly logger = new Logger(OAuthMFAService.name);

  constructor(
    private readonly oauthMfaTokenRepository: OAuthMFATokenRepository,
    private readonly oauthAccountRepository: OAuthAccountRepository,
    private readonly authUserRepository: AuthUserRepository,
    private readonly authMethodsService: AuthMethodsService
  ) {
    super(authMethodsService, AuthenticationMethod.OAUTH);
  }

  /**
   * Demande la validation MFA pour une action spécifique
   * @param userId ID de l'utilisateur concerné
   */
  async requestMFA(userId: number): Promise<void> {
    await this.initializeMfaTokens(userId);
  }

  /**
   * Valide une demande de MFA pour une action spécifique
   * @param userId ID de l'utilisateur concerné
   * @param data Données de validation (ex: code MFA, token, etc.)
   */
  async validateMFA(userId: number, data: any): Promise<boolean> {
    const result = await this.checkIfOAuthMFATokensAreValid(userId);
    return result;
  }

  /**
   * Initialise les tokens MFA OAuth pour un utilisateur.
   */
  async initializeMfaTokens(userId: number): Promise<void> {
    try {
      // Supprimer tous les tokens MFA OAuth existants pour l'utilisateur
      await this.oauthMfaTokenRepository.deleteAllByUserId(userId);
      this.logger.verbose(`Tous les tokens MFA OAuth supprimés pour l'utilisateur ID: ${userId}`);

      // Récupérer l'utilisateur avec ses méthodes d'authentification
      const user = await this.authUserRepository.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Filtrer les méthodes d'authentification de type OAuth
      const oauthAuthMethods = user.userAuthMethods.filter(
        (authMethod) => authMethod.method === AuthenticationMethod.OAUTH
      );

      if (oauthAuthMethods.length === 0) {
        this.logger.warn(`Aucun compte OAuth associé à l'utilisateur ID: ${userId}`);
        return;
      }

      // Récupérer les OAuthAccounts correspondants
      const oauthAccounts = await Promise.all(
        oauthAuthMethods.map((authMethod) => this.oauthAccountRepository.findById(authMethod.methodId!))
      );

      // Filtrer les comptes trouvés
      const validOauthAccounts = oauthAccounts.filter(
        (account: OAuthAccount | null): account is OAuthAccount => account !== null
      );

      if (validOauthAccounts.length === 0) {
        this.logger.warn(`Aucun compte OAuth valide trouvé pour l'utilisateur ID: ${userId}`);
        return;
      }

      // Générer et stocker un nouveau token MFA OAuth pour chaque compte OAuth valide
      for (const account of validOauthAccounts) {
        const token = generateRandomToken(); // Fonction sécurisée
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await this.oauthMfaTokenRepository.createOAuthMfaToken(
          userId,
          account.provider,
          account.providerId,
          token,
          expiresAt
        );

        this.logger.verbose(`Token MFA OAuth généré pour le fournisseur ${account.provider}: ${token}`);
      }
    } catch (error) {
      this.logger.error(
        `Erreur lors de l'initialisation des tokens MFA OAuth pour l'utilisateur ID: ${userId} - ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Vérifie si tous les tokens MFA OAuth sont valides pour un utilisateur.
   */
  async checkIfOAuthMFATokensAreValid(userId: number): Promise<boolean> {
    // Récupérer tous les tokens MFA OAuth pour l'utilisateur
    const tokens = await this.oauthMfaTokenRepository.findAllByUserId(userId);

    if (tokens.length === 0) {
      throw new Error("Aucun token MFA OAuth trouvé pour l'utilisateur");
    }

    // Vérifier que tous les tokens sont valides
    const now = new Date();
    for (const token of tokens) {
      if (token.expiresAt < now || !token.hasBeenValidated) {
        return false;
      }
    }

    // Supprimer les tokens
    await this.oauthMfaTokenRepository.deleteAllByUserId(userId);

    return true;
  }

  /**
   * Vérifie et valide un callback MFA OAuth.
   */
  async validateMFAOAuthCallback(provider: string, providerId: string): Promise<boolean> {
    try {
      // Trouver le compte OAuth correspondant
      const oauthAccount = await this.oauthAccountRepository.findByProviderAndProviderId(provider, providerId);

      if (!oauthAccount) {
        this.logger.warn(`Compte OAuth non trouvé pour le fournisseur ${provider} et providerId ${providerId}`);
        return false;
      }

      const userId = oauthAccount.userId;

      // Trouver le token MFA OAuth correspondant
      const tokenRecord = await this.oauthMfaTokenRepository.findByUserProviderAndProviderId(
        userId,
        provider,
        providerId
      );

      if (!tokenRecord) {
        this.logger.warn(
          `Aucun token MFA OAuth trouvé ou déjà validé pour l'utilisateur ID: ${userId}, fournisseur: ${provider}`
        );
        return false;
      }

      // Vérifier si le token a expiré
      const now = new Date();
      if (tokenRecord.expiresAt < now) {
        this.logger.warn(`Le token MFA OAuth a expiré pour l'utilisateur ID: ${userId}, fournisseur: ${provider}`);
        return false;
      }

      // Marquer le token comme validé
      await this.oauthMfaTokenRepository.updateTokenAsValidated(tokenRecord.token);
      this.logger.verbose(`Token MFA OAuth validé pour l'utilisateur ID: ${userId}, fournisseur: ${provider}`);

      return true;
    } catch (error) {
      this.logger.error(
        `Erreur lors de la validation du token MFA OAuth pour le fournisseur: ${provider} - ${error.message}`
      );
      return false;
    }
  }
}