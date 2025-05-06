import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VaultModule } from './core/modules/vault/vault.module';
import { VaultService } from './core/modules/vault/services/vault.service';
import { LoggerService } from './core/modules/logger/logger.service';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

/**
 * @function bootstrap
 * @description Point d'entrée de l'application backend.
 *
 * Ce fichier réalise plusieurs opérations critiques lors du démarrage :
 * - Initialisation du service Vault pour charger les secrets dans l'environnement depuis l'instance de vault déja déployée.
 * - Création de l'application NestJS avec AppModule.
 * - Configuration globale des middlewares (cookie-parser, helmet).
 * - Mise en place du logger personnalisé et du filtre d'exceptions global.
 * - Génération et configuration de la documentation Swagger.
 * - Activation du CORS en fonction de la configuration.
 *
 * L'ordre d'exécution est primordial pour garantir que les secrets sont chargés avant
 * la configuration des autres services et que toutes les mesures de sécurité (helmet, cookie-parser)
 * sont en place dès le début.
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('Starting application initialization...');
    
    // Créer un contexte temporaire pour VaultModule
    const vaultAppContext = await NestFactory.createApplicationContext(VaultModule);

    // Initialiser VaultService pour charger les secrets dans l'environnement
    const vaultService = vaultAppContext.get(VaultService);
    try {
      await vaultService.initializeVault();
    } catch (err) {
      Logger.warn(
        `⚠️  VaultService non disponible (${err.message}). On continue sans Vault.`,
        'VaultInit'
      );
    }
    
    // Fermer le contexte de VaultModule après l'initialisation
    await vaultAppContext.close();

    logger.log('Vault initialization completed');
    
    // Créer l'application principale avec AppModule
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    logger.log('AppModule loaded');

    // Utiliser le logger personnalisé
    const customLogger = app.get(LoggerService);
    app.useLogger(customLogger);

    logger.log('CustomLogger loaded');

    // Appliquer cookie-parser comme middleware global
    app.use(cookieParser());

    logger.log('CookieParser loaded');

    // Appliquer helmet comme middleware conditionnel
    app.use((req, res, next) => {
      // S'il s'agit d'une requête sur /docs ou /docs/*,
      // on n'applique pas helmet
      if (req.path.startsWith('/docs')) {
        return next();
      }
      // Sinon, on applique helmet normalement
      return helmet()(req, res, next);
    });
    logger.log('Helmet (conditional) loaded');

    // Appliquer le filtre d'exceptions global
    app.useGlobalFilters(new AllExceptionsFilter(customLogger));

    logger.log('AllExceptionsFilter loaded');

    // Configuration de Swagger
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API Backend')
      .setDescription('Documentation API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);

    logger.log('Swagger loaded');

    // Récupérer les configurations depuis l'environnement
    const port = process.env.PORT || 3000;
    // const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

    // Activer CORS
    app.enableCors({
      origin: true,          // renvoie l’origine reçue dans le header `Origin`
      credentials: true,     // autorise les cookies
    });    

    logger.log('CORS enabled');

    // Démarrer l'application
    await app.listen(port);
    logger.log(`Server running on port ${port}`);
    logger.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  } catch (error) {
    logger.error('Erreur lors du démarrage de l\'application', error);
    process.exit(1);
  }
}

bootstrap();
