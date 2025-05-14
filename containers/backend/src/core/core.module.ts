import { Module, Global } from '@nestjs/common';
import { LoggerModule } from './modules/logger/logger.module';
import { AppConfigModule } from './modules/config/app-config.module';
import { PrismaService } from './services/prisma.service';
import { MainUserRepository } from './repositories/main-user.repository';
import { HealthModule } from './modules/health/health.module';
import { HealthController } from './modules/health/health.controller';
import { VaultModule } from './modules/vault/vault.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtUtilityService } from './services/jwt-utility.service';
import { DocsModule } from './modules/docs/docs.module';
import { StorageModule } from './modules/storage/storage.module';

/**
 * Le socle fondamental de l'application backend.
 *
 * Le CoreModule est @Global() pour être accessible partout dans l'application sans besoin de ré-importation explicite.
 *
 * Il centralise les composants indispensables à l'infrastructure de base, tels que :
 * - La configuration de l'application (via AppConfigModule)
 * - La gestion des logs (LoggerModule)
 * - La connexion à la base de données (PrismaService)
 * - Les vérifications de l'état de l'application (HealthModule)
 * - La sécurité et la gestion des tokens JWT (JwtModule et JwtUtilityService)
 * - La gestion des secrets (VaultModule)
 *
 * Ces composants servent de fondation aux différents domaines métier (ex. Auth, User Management, etc.) 
 * qui sont eux mêmes les fonctionnalités de base du template d'application.
 * @category Core
 */
@Global()
@Module({
  imports: [
    VaultModule,
    AppConfigModule.forRootAsync(),
    LoggerModule,
    HealthModule,
    DocsModule, 
    JwtModule.register({}),
    StorageModule,
  ],
  controllers: [HealthController],
  providers: [
    PrismaService,
    MainUserRepository,
    JwtUtilityService, 
  ],
  exports: [
    LoggerModule,
    PrismaService,
    StorageModule,
    MainUserRepository,
    HealthModule,
    JwtUtilityService, 
    JwtModule, 
  ],
})
export class CoreModule {
  constructor() {
    console.log('CoreModule loaded');
  }
}
