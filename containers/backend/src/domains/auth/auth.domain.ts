import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { AuthSeedService } from './common/services/auth-seed.service';
import { ClassicAuthModule } from './modules/classic-auth/classic-auth.module';
import { Web3Module } from './modules/web3/web3.module';
import { AuthenticatorModule } from './modules/authenticator/authenticator.module';
import { PhoneModule } from './modules/phone/phone.module';
import { AuthSettingsModule } from './modules/auth-settings/auth-settings.module';
import { EmailModule } from './modules/email/email.module';
import { OAuthModule } from './modules/oauth/oauth.module';
import { MFAModule } from './modules/MFA/mfa.module';
import { ServicesAccountsModule } from './modules/services-accounts/services-accounts-module';

/**
 * @domain AuthDomain
 * @description
 * Domaine d'authentification.
 * Regroupe les modules d'authentification classiques, web3, authenticator, téléphone, paramètres, email,
 * OAuth et MFA, et configure les routes associées.
 */
@Module({
  imports: [
    CommonModule,
    RouterModule.register([
      { path: 'auth', module: ClassicAuthModule },
      { path: 'auth/web3', module: Web3Module },
      { path: 'auth/authenticator', module: AuthenticatorModule },
      { path: 'auth/phone', module: PhoneModule },
      { path: 'auth/settings', module: AuthSettingsModule },
      { path: 'auth/email', module: EmailModule },
      { path: 'auth/oauth', module: OAuthModule },
      { path: 'auth/mfa', module: MFAModule },
      { path: 'auth/services-accounts', module: ServicesAccountsModule },
    ]),
    ClassicAuthModule,
    Web3Module,
    AuthenticatorModule,
    PhoneModule,
    AuthSettingsModule,
    EmailModule,
    OAuthModule,
    MFAModule,
  ],
  providers: [
    // Force instanciation d'AuthSeedService au bootstrap
    {
      provide: 'AUTH_SEED_INITIALIZER',
      useFactory: (seed: AuthSeedService) => seed,
      inject: [AuthSeedService],
    },
  ],
  exports: [],
})
export class AuthDomain {}
