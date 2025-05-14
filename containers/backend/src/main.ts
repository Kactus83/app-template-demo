import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VaultModule } from './core/modules/vault/vault.module';
import { VaultService } from './core/modules/vault/services/vault.service';
import { LoggerService } from './core/modules/logger/logger.service';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

/**
 * Cette section permet de capturer les exceptions non gérées
 * et de loguer la sortie du processus.
 */

// 1. Catch-all pour exceptions non gérées
process.on('uncaughtException', (err: Error) => {
  console.error('🔥 Uncaught exception:', err.stack || err.message);
  process.exit(1);
});
process.on('unhandledRejection', (reason: any) => {
  console.error('🔥 Unhandled rejection:', reason);
  process.exit(1);
});

// 2. Log de sortie pour savoir si c'est un exit normal ou forcé
process.on('exit', (code: number) => {
  console.log(`ℹ️  Process.exit event with code: ${code}`);
});

/**
 * @function bootstrap
 * @description Point d'entrée de l'application backend.
 *
 * Ce fichier réalise plusieurs opérations critiques lors du démarrage :
 * - Initialisation du service Vault pour charger les secrets dans l'environnement depuis l'instance de vault déjà déployée.
 * - Création de l'application NestJS avec AppModule.
 * - Configuration globale des middlewares (cookie-parser, helmet).
 * - Mise en place du logger personnalisé et du filtre d'exceptions global.
 * - Génération et configuration de la documentation Swagger.
 * - Activation du CORS en fonction de la configuration.
 *
 * L'ordre d'exécution est primordial pour garantir que les secrets
 * sont chargés avant la configuration des autres services et
 * que toutes les mesures de sécurité sont en place dès le début.
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  logger.log('Starting application initialization...');

  // Création d'un contexte temporaire pour VaultModule
  const vaultAppContext = await NestFactory.createApplicationContext(VaultModule);

  // Initialisation de VaultService pour charger les secrets
  const vaultService = vaultAppContext.get(VaultService);
  try {
    await vaultService.initializeVault();
    logger.log('Vault initialized successfully');
  } catch (err: any) {
    Logger.warn(`⚠️  VaultService non disponible (${err.message}). On continue sans Vault.`, 'VaultInit');
  }
  // Fermeture du contexte VaultModule
  await vaultAppContext.close();

  logger.log('Vault initialization completed');

  // Création de l'application principale avec AppModule
  const app = await NestFactory.create(AppModule, {
    bufferLogs: false,    // Désactive le buffering pour remonter tous les logs immédiatement
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  logger.log('AppModule loaded');

  // Configuration du logger personnalisé
  const customLogger = app.get(LoggerService);
  app.useLogger(customLogger);

  logger.log('CustomLogger loaded');

  // Application de cookie-parser en middleware global
  app.use(cookieParser());
  logger.log('CookieParser loaded');

  // Application conditionnelle de helmet
  app.use((req, res, next) => {
    if (req.path.startsWith('/docs')) {
      return next();
    }
    return helmet()(req, res, next);
  });
  logger.log('Helmet (conditional) loaded');

  // Application du filtre d'exceptions global
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

  // Activation du CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  logger.log('CORS enabled');

  // Démarrage du serveur
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');

  logger.log(`Server running on port ${port}`);
  logger.log(`Swagger docs available at http://localhost:${port}/api-docs`);
}

// Wrapper top-level pour attraper toute erreur non gérée
(async () => {
  try {
    await bootstrap();
  } catch (err: any) {
    console.error('🚨 Erreur fatale non catchée dans bootstrap :', err.stack || err);
    process.exit(1);
  }
})();