import { Injectable, Logger } from '@nestjs/common';
import { OAuthAccountRepository } from '../repositories/oauth-account.repository';
import { AuthenticationMethod, OAuthAccount, UserRole } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { CommunicationService } from '../../../../../domains/communication/communication.service';
import { UserWithRelations } from '../../../../../core/models/types/userWithRelations.type';
import { IOAuthProfile } from '../models/interfaces/oauth-profile.interface';
import { OAuthProviderType } from '../models/types/oauth-provider.type';
import { IGitHubUserResponse } from '../models/interfaces/github-user-response.interface';
import { JwtUtilityService } from '../../../../../core/services/jwt-utility.service';
import { UserDto } from '../../../../../core/models/dto/user.dto';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';
import { LoginResponseDto } from '../../../../../domains/auth/common/models/dto/login-response.dto';

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);

  constructor(
    private readonly userRepository: AuthUserRepository,
    private readonly oauthAccountRepository: OAuthAccountRepository,
    private readonly jwtUtilityService: JwtUtilityService,
    private readonly communicationService: CommunicationService,
  ) {}

  /**
   * Récupère un utilisateur par son ID.
   */
  public async getUserById(userId: number): Promise<UserWithRelations | null> {
    return this.userRepository.findById(userId);
  }

  /**
   * Gère la connexion OAuth pour tous les fournisseurs.
   */
  async handleOAuthLogin(
    profile: IOAuthProfile,
    accessToken?: string,
    refreshToken?: string
  ): Promise<LoginResponseDto> {
    try {
      const provider = profile.provider;
      const providerId = profile.id;

      // Obtenir l'email de l'utilisateur
      const email = await this.getEmailFromProfile(profile, accessToken, provider);

      // Trouver ou créer l'utilisateur et le compte OAuth
      const user = await this.findOrCreateUserByEmailAndOAuth(
        profile,
        email,
        provider,
        providerId,
        accessToken,
        refreshToken
      );

      // Générer le token
      const payload = { userId: user.id, roles: user.roles };
      const token = this.jwtUtilityService.signToken(payload);
  
      // Retourner l'utilisateur en tant que DTO, incluant le token
      const userDto = plainToClass(UserDto, user, { excludeExtraneousValues: true });
  
      return { user: userDto, token };

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Obtient l'email depuis le profil OAuth ou déclenche une erreur si absent.
   */
  private async getEmailFromProfile(
    profile: IOAuthProfile,
    accessToken: string | undefined,
    provider: OAuthProviderType
  ): Promise<string> {
    const email = await this.getEmail(profile, accessToken, provider);

    if (!email) {
      this.logger.error(`Le profil est manquant d'email pour le fournisseur: ${provider}`);
      throw new Error('Aucun email trouvé dans le profil OAuth');
    }

    return email;
  }

  /**
   * Trouve ou crée un utilisateur en fonction de l'email et de l'existence d'un compte OAuth.
   */
  private async findOrCreateUserByEmailAndOAuth(
    profile: IOAuthProfile,
    email: string,
    provider: string,
    providerId: string,
    accessToken?: string,
    refreshToken?: string
  ): Promise<UserWithRelations> {
    // Vérifier l'existence d'un compte OAuth
    let oauthAccount = await this.oauthAccountRepository.findByProviderAndProviderId(provider, providerId);

    if (oauthAccount) {
      // Si un compte OAuth existe déjà, récupérer l'utilisateur associé
      const user = await this.updateOAuthAccountTokensAndGetUser(oauthAccount, accessToken, refreshToken);

      // Mettre à jour l'avatar si nécessaire
      await this.updateUserAvatar(user, profile, provider, accessToken);

      return user;
    }

    // Si aucun compte OAuth n'existe, vérifier si un utilisateur existe déjà avec cet email
    const existingUser = await this.userRepository.findByPrimaryOrSecondaryEmail(email);

    if (existingUser) {
      // Mettre à jour l'avatar si nécessaire
      await this.updateUserAvatar(existingUser, profile, provider, accessToken);

      // Créer le compte OAuth pour cet utilisateur existant
      oauthAccount = await this.createOAuthAccountForExistingUser(
        existingUser,
        provider,
        providerId,
        email,
        accessToken,
        refreshToken
      );

      // Ajouter la méthode d'authentification OAuth à l'utilisateur
      await this.userRepository.addAuthMethod(existingUser.id, {
        method: AuthenticationMethod.OAUTH,
        methodId: oauthAccount.id,
        order: existingUser.userAuthMethods.length + 1,
      });

      return existingUser;
    } else {
      // Créer un nouvel utilisateur et un compte OAuth
      const newUser = await this.createUserWithOAuth(
        profile,
        email,
        provider,
        providerId,
        accessToken,
        refreshToken
      );
      return newUser;
    }
  }

  /**
   * Met à jour les tokens OAuth pour un compte OAuth existant et retourne l'utilisateur associé.
   */
  private async updateOAuthAccountTokensAndGetUser(
    oauthAccount: OAuthAccount,
    accessToken?: string,
    refreshToken?: string
  ): Promise<UserWithRelations> {
    const user = await this.userRepository.findById(oauthAccount.userId);
    if (!user) {
      throw new Error('Utilisateur associé au compte OAuth introuvable grâce à son id');
    }

    this.logger.verbose(`Utilisateur existant authentifié via ${oauthAccount.provider}: ${user.email}`);

    // Mettre à jour les tokens OAuth
    await this.oauthAccountRepository.updateOAuthAccount(oauthAccount.id, {
      accessToken,
      refreshToken,
    });

    return user;
  }

  /**
   * Met à jour l'avatar de l'utilisateur si nécessaire.
   */
  private async updateUserAvatar(
    user: UserWithRelations,
    profile: IOAuthProfile,
    provider: string,
    accessToken?: string
  ): Promise<void> {
    if (!user.avatar && profile.photos && profile.photos.length > 0) {
      await this.userRepository.update(user.id, { avatar: profile.photos[0].value });
      this.logger.verbose(`Avatar mis à jour pour l'utilisateur: ${user.email}`);
    } else if (provider === 'github' && !user.avatar && accessToken) {
      // Récupérer l'avatar de GitHub s'il n'est pas fourni dans le profil
      const { avatar } = await this.fetchGitHubEmailAndAvatar(accessToken);
      if (avatar) {
        await this.userRepository.update(user.id, { avatar });
        this.logger.verbose(`Avatar GitHub mis à jour pour l'utilisateur: ${user.email}`);
      }
    }
  }

  /**
   * Crée un compte OAuth pour un utilisateur existant.
   */
  private async createOAuthAccountForExistingUser(
    user: UserWithRelations,
    provider: string,
    providerId: string,
    email: string,
    accessToken?: string,
    refreshToken?: string
  ): Promise<OAuthAccount> {
    const oauthAccount = await this.oauthAccountRepository.createOAuthAccount({
      provider,
      providerId,
      email,
      accessToken,
      refreshToken,
      user: {
        connect: { id: user.id },
      },
    });

    this.logger.verbose(`Nouveau compte OAuth créé pour l'utilisateur: ${user.email}, OAuthAccount ID: ${oauthAccount.id}`);

    return oauthAccount;
  }

  /**
   * Crée un nouvel utilisateur et un compte OAuth associé.
   */
  private async createUserWithOAuth(
    profile: IOAuthProfile,
    email: string,
    provider: string,
    providerId: string,
    accessToken?: string,
    refreshToken?: string
  ): Promise<UserWithRelations> {
    // Si le provider est GitHub, récupérer l'avatar et l'email via l'API
    let avatar = profile.photos?.[0]?.value || null;
    if (!avatar && provider === 'github' && accessToken) {
      const result = await this.fetchGitHubEmailAndAvatar(accessToken);
      avatar = result.avatar;
    }

    // Créer un nouvel utilisateur
    const newUserData = {
      email,
      isEmailVerified: true,
      secondaryEmail: null,
      isSecondaryEmailVerified: false,
      password: null,
      name:
        profile.displayName ||
        `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() ||
        `User-${Math.floor(Math.random() * 1000000)}`, // Nom par défaut si aucun nom n'est fourni
      avatar: avatar,
      status: 'offline',
      roles: [UserRole.USER],
      authMethods: [AuthenticationMethod.OAUTH],
    };

    const user = await this.userRepository.create(newUserData);

    this.logger.verbose(`Nouvel utilisateur créé avec l'email: ${email}, ID: ${user.id}`);

    // Créer le compte OAuth pour ce nouvel utilisateur
    const oauthAccount = await this.oauthAccountRepository.createOAuthAccount({
      provider,
      providerId,
      email,
      accessToken,
      refreshToken,
      user: {
        connect: { id: user.id },
      },
    });

    this.logger.verbose(`Nouveau compte OAuth créé pour le nouvel utilisateur: ${user.email}, OAuthAccount ID: ${oauthAccount.id}`);

    // Ajouter la méthode d'authentification OAuth à l'utilisateur
    await this.userRepository.addAuthMethod(user.id, {
      method: AuthenticationMethod.OAUTH,
      methodId: oauthAccount.id,
      order: 1,
    });

    // Envoyer un message de bienvenue via le service de communication
    await this.communicationService.createMessage(user.id, {
      title: 'Welcome OAuth User!',
      description: `Hello ${user.name}, welcome to our platform! You have registered using ${provider}.`,
      icon: 'welcome-icon',
      image: null,
      link: null,
      useRouter: false,
      read: false,
      time: new Date(),
    });

    return user;
  }

  /**
   * Obtient l'email à partir du profil ou via l'API du fournisseur.
   */
  private async getEmail(
    profile: IOAuthProfile,
    accessToken?: string,
    provider?: OAuthProviderType
  ): Promise<string | null> {
    const profileEmail= this.extractEmail(profile);
    if (profileEmail) {
      this.logger.verbose(`Email extrait du profil: ${profileEmail}`);
      return profileEmail;
    }

    this.logger.warn(`Email non trouvé dans le profil pour le fournisseur: ${provider}`);

    switch (provider) {
      case 'github':
        if (accessToken) {
          const { email } = await this.fetchGitHubEmailAndAvatar(accessToken);
          return email;
        }
        break;
      // Ajoutez d'autres fournisseurs ici si nécessaire
      default:
        this.logger.warn(`Gestion de l'email non implémentée pour le fournisseur: ${provider}`);
    }

    return null;
  }

  /**
   * Extrait l'email du profil OAuth.
   */
  private extractEmail(profile: IOAuthProfile): string | null {
    if (profile.emails && profile.emails.length > 0) {
      return profile.emails[0].value;
    }
    return null;
  }

  /**
   * Obtient l'email et l'avatar depuis GitHub via l'API.
   */
  private async fetchGitHubEmailAndAvatar(accessToken: string): Promise<{ email: string | null; avatar: string | null }> {
    try {
      const userResponse = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userResponse.ok) {
        this.logger.error(`Échec de la récupération des informations utilisateur GitHub: ${userResponse.statusText}`);
        throw new Error('Échec de la récupération des informations utilisateur GitHub');
      }

      const user: IGitHubUserResponse = await userResponse.json() as IGitHubUserResponse;
      const email = user.email || null;
      const avatar = user.avatar_url || null;

      this.logger.verbose(`Email GitHub récupéré: ${email}`);
      this.logger.verbose(`Avatar GitHub récupéré: ${avatar}`);

      return { email, avatar };
    } catch (error) {
      this.handleError(error);
      throw new Error('Échec de la récupération des informations GitHub');
    }
  }

  /**
   * Gestion centralisée des erreurs avec logging.
   */
  private handleError(error: any): void {
    if (error instanceof Error) {
      this.logger.error(`OAuthService Erreur: ${error.message}`);
    } else {
      this.logger.error('OAuthService Erreur inconnue');
    }
  }
}
