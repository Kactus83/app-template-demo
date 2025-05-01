import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile as FacebookProfile } from 'passport-facebook';
import { OAuthService } from '../services/oauth.service';
import { OAuthMFAService } from '../services/oauth-mfa.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { OAuthProviderType } from '../models/types/oauth-provider.type';

/**
 * @passort_strategy FacebookStrategy
 * @description
 * Stratégie Passport pour l'authentification via Facebook OAuth.
 * Gère le flux d'authentification standard et le flux MFA.
 */
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  private readonly logger = new Logger(FacebookStrategy.name);
  private readonly provider: OAuthProviderType = 'facebook';

  constructor(
    private readonly oauthService: OAuthService,
    private readonly oauthMFAService: OAuthMFAService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID')!,
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL')!,
      passReqToCallback: true,
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
      scope: ['email'],
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: FacebookProfile,
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
