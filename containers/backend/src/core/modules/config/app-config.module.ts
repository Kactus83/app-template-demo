import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigLoaderService } from './services/config-loader.service';

/**
 * Module global de configuration de l'application.
 *
 * Ce module charge la configuration via les variables d'environnement et intègre
 * un service de validation (ConfigLoaderService) qui s'appuie sur Vault pour
 * récupérer et vérifier les secrets avant toute initialisation.
 *
 * La méthode static forRootAsync() permet de configurer ce module de manière asynchrone,
 * en utilisant le ConfigModule de NestJS et en chargeant directement process.env.
 * @category Core
 * @category Core Modules
 */
@Global()
@Module({})
export class AppConfigModule {
  static forRootAsync(): DynamicModule {
    return {
      module: AppConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => {
              return process.env;
            },
          ],
          validate: (config) => config,
        }),
      ],
      providers: [ConfigService, ConfigLoaderService],
      exports: [ConfigService],
    };
  }

  constructor() {
    console.log('AppConfigModule initialized');
  }
}
