import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile as GitHubProfile } from 'passport-github2';
import { OAuthService } from '../services/oauth.service';
import { OAuthMFAService } from '../services/oauth-mfa.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { OAuthProviderType } from '../models/types/oauth-provider.type';

/**
 * @passort_strategy GitHubStrategy
 * @description
 * Stratégie Passport pour l'authentification via GitHub OAuth.
 * Gère le flux d'authentification standard et le flux MFA.
 */
@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly logger = new Logger(GitHubStrategy.name);
  private readonly provider: OAuthProviderType = 'github';

  constructor(
    private readonly oauthService: OAuthService,
    private readonly oauthMFAService: OAuthMFAService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID')!,
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL')!,
      passReqToCallback: true,
      scope: ['user:email'],
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile,
    done: VerifyCallback,
  ): Promise<any> {
    // Gérer le flux standard ou MFA en fonction du paramètre 'state'
    const state = req.query.state as string | undefined;
    const isMfaFlow = state?.includes('mfa=true') || false;

    if (isMfaFlow) {
      // Gérer la validation MFA
      // Implémentez la logique MFA ici
      return done(null, null);
    } else {
      // Flux d'authentification standard
      const response = await this.oauthService.handleOAuthLogin(
        { ...profile, provider: this.provider },
        accessToken,
        refreshToken,
      );
      return done(null, response);
    }
  }
}
