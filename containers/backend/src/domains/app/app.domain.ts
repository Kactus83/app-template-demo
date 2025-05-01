import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { VersionModule } from './modules/version/version.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { VersionService } from './modules/version/services/version.service';
import { VersionCheckMiddleware } from './modules/version/middlewares/version-check.middleware';
import { AppService } from './app.service';

/**
 * @domain AppDomain
 * @description
 * Domaine propres aux fonctionnalités basiques de l'app.
 * Regroupe les modules de version et de navigation, et expose leurs interfaces aux autres domaines.
 * Permet aux autre smodules d'enregistrer des éléments de navigation qui seront tranmis au frontend.
 */
@Module({
  imports: [
    RouterModule.register([
      {
        path: 'app',
        module: AppDomain,
        children: [
          { path: 'version', module: VersionModule },
          { path: 'navigation', module: NavigationModule },
        ],
      },
    ]),
    VersionModule,
    NavigationModule,
  ],
  providers: [
    AppService,
  ],
  exports: [
    VersionModule,
    NavigationModule,
    AppService,
  ],
})
export class AppDomain implements NestModule {
  constructor(private readonly versionService: VersionService) {
    console.log('AppDomain loaded');
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VersionCheckMiddleware).forRoutes('*');
  }
}
