import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile as GoogleProfile } from 'passport-google-oauth20';
import { OAuthService } from '../services/oauth.service';
import { OAuthMFAService } from '../services/oauth-mfa.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { OAuthProviderType } from '../models/types/oauth-provider.type';

/**
 * @passort_strategy GoogleStrategy
 * @description
 * Stratégie Passport pour l'authentification via Google OAuth.
 * Gère le flux d'authentification standard et le flux MFA.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);
  private readonly provider: OAuthProviderType = 'google';

  constructor(
    private readonly oauthService: OAuthService,
    private readonly oauthMFAService: OAuthMFAService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL')!,
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
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
