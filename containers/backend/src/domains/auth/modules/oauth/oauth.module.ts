import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CommunicationDomain } from '../../../../domains/communication/communication.domain';
import { OAuthController } from './controllers/oauth.controller';
import { OAuthService } from './services/oauth.service';
import { OAuthMFAService } from './services/oauth-mfa.service';
import { OAuthAccountRepository } from './repositories/oauth-account.repository';
import { OAuthMFATokenRepository } from './repositories/oauth-mfa-token.repository';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { CommonModule } from '../../common/common.module';

/**
 * @module OAuthModule
 * @description
 * Module de gestion de l'authentification OAuth.
 * Configure les stratégies Passport pour Google, GitHub et Facebook, et expose le contrôleur OAuth.
 */
@Module({
  imports: [
    forwardRef(() => CommonModule),
    forwardRef(() => CommunicationDomain),
    ConfigModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [OAuthController],
  providers: [
    OAuthService,
    OAuthMFAService,
    OAuthAccountRepository,
    OAuthMFATokenRepository,
    GoogleStrategy,
    GitHubStrategy,
    FacebookStrategy,
  ],
  exports: [OAuthMFAService],
})
export class OAuthModule {}
