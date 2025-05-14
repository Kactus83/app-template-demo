import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SessionMiddleware } from './core/middlewares/session.middleware';
import { MorganMiddleware } from './core/middlewares/morgan.middleware';
import { AppDomain } from './domains/app/app.domain';
import { CommunicationDomain } from './domains/communication/communication.domain';
import { UserManagementDomain } from './domains/user-management/user-management.domain';
import { AuthDomain } from './domains/auth/auth.domain';
import { SearchDomain } from './domains/search/search.domain';
import { Web3Domain } from './domains/web3/web3.domain';
import { VersionCheckMiddleware } from './domains/app/modules/version/middlewares/version-check.middleware';
import { MetadataMiddleware } from './core/middlewares/metadata.middleware';

/**
 * @module AppModule
 * @description Point central d'agrégation des différents domaines de l'application.
 *
 * Ce module assemble les éléments de bases du template (CoreModule, et fonctionnalités de base)
 * Les middlewares globaux (gestion de sessions, logs via Morgan et vérification de version) sont appliqués sur l'ensemble des routes.
 *
 * L'idée ici est de permettre une extensibilité complète : il suffit d'ajouter de nouveaux modules de domaine pour
 * intégrer de nouvelles fonctionnalités, en bénéficiant déjà de l'infrastructure de base (configuration, sécurité, etc.).
 */
@Module({
  imports: [
    CoreModule, 
    AuthDomain,
    Web3Domain, 
    AppDomain,
    CommunicationDomain,
    UserManagementDomain,
    SearchDomain,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware, MorganMiddleware, VersionCheckMiddleware, MetadataMiddleware)
      .exclude(
        { path: 'api-docs', method: RequestMethod.ALL },
        { path: 'docs', method: RequestMethod.ALL },
        { path: 'health', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
