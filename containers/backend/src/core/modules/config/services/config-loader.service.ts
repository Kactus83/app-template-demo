import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppConfig } from '../types/app.config';

/**
 * Service chargé de charger et valider la configuration de l'application.
 *
 * Lors de l'initialisation du module, ce service construit un objet de configuration
 * à partir des variables d'environnement, le transforme en instance d'AppConfig et
 * vérifie sa validité à l'aide de class-validator. En cas d'erreur, le processus est arrêté.
 * @category Core
 * @category Core Services
 */
@Injectable()
export class ConfigLoaderService implements OnModuleInit {
  private readonly logger = new Logger(ConfigLoaderService.name);

  constructor(private readonly configService: ConfigService) {
    console.log('ConfigLoaderService loaded');
  }

  onModuleInit(): void {
    console.log('ConfigLoaderService initialized');
    this.loadAndValidateConfig();
  }

  private loadAndValidateConfig(): void {
    try {
      console.log('Chargement de la configuration...');
      
      // Construction de l'objet de configuration à partir des variables d'environnement
      const configObject = {
        VAULT_ADDR: this.configService.get<string>('VAULT_ADDR'),
        VAULT_CREDENTIALS_PATH: this.configService.get<string>('VAULT_CREDENTIALS_PATH'),
        JWT_SECRET: this.configService.get<string>('JWT_SECRET'),
        JWT_EXPIRES_IN: this.configService.get<string>('JWT_EXPIRES_IN'),
        JWT_EXPIRATION_BUFFER: parseInt(this.configService.get<string>('JWT_EXPIRATION_BUFFER'), 10),
        JWT_ISSUER: this.configService.get<string>('JWT_ISSUER'),
        JWT_MAX_AGE: this.configService.get<string>('JWT_MAX_AGE'),
        DATABASE_URL: this.configService.get<string>('DATABASE_URL'),
        POSTGRES_USER: this.configService.get<string>('POSTGRES_USER'),
        POSTGRES_PASSWORD: this.configService.get<string>('POSTGRES_PASSWORD'),
        POSTGRES_DB: this.configService.get<string>('POSTGRES_DB'),
        GOOGLE_CLIENT_ID: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        GOOGLE_CLIENT_SECRET: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        GOOGLE_CALLBACK_URL: this.configService.get<string>('GOOGLE_CALLBACK_URL'),
        GITHUB_CLIENT_ID: this.configService.get<string>('GITHUB_CLIENT_ID'),
        GITHUB_CLIENT_SECRET: this.configService.get<string>('GITHUB_CLIENT_SECRET'),
        GITHUB_CALLBACK_URL: this.configService.get<string>('GITHUB_CALLBACK_URL'),
        FACEBOOK_CLIENT_ID: this.configService.get<string>('FACEBOOK_CLIENT_ID'),
        FACEBOOK_CLIENT_SECRET: this.configService.get<string>('FACEBOOK_CLIENT_SECRET'),
        FACEBOOK_CALLBACK_URL: this.configService.get<string>('FACEBOOK_CALLBACK_URL'),
        SESSION_SECRET: this.configService.get<string>('SESSION_SECRET'),
        FRONTEND_URL: this.configService.get<string>('FRONTEND_URL'),
        MAIL_SERVICE: this.configService.get<string>('MAIL_SERVICE'),
        MAIL_HOST: this.configService.get<string>('MAIL_HOST'),
        MAIL_PORT: parseInt(this.configService.get<string>('MAIL_PORT'), 10),
        MAIL_FROM: this.configService.get<string>('MAIL_FROM'),
        MAIL_FROM_NAME: this.configService.get<string>('MAIL_FROM_NAME'),
        MAIL_USER: this.configService.get<string>('MAIL_USER'),
        MAIL_PASS: this.configService.get<string>('MAIL_PASS'),
        TWILIO_ACCOUNT_SID: this.configService.get<string>('TWILIO_ACCOUNT_SID'),
        TWILIO_AUTH_TOKEN: this.configService.get<string>('TWILIO_AUTH_TOKEN'),
        TWILIO_VERIFY_SERVICE_SID: this.configService.get<string>('TWILIO_VERIFY_SERVICE_SID'),
        deployerAddress: this.configService.get<string>('deployerAddress'),
        deployerPrivateKey: this.configService.get<string>('deployerPrivateKey'),
      };

      // Transformation de l'objet en instance d'AppConfig et validation
      const validatedConfig = plainToInstance(AppConfig, configObject, {
        enableImplicitConversion: true,
      });

      // Vérification des erreurs de validation
      const errors = validateSync(validatedConfig, { skipMissingProperties: false });

      if (errors.length > 0) {
        const errorMessages = errors
          .map(err => `${err.property}: ${Object.values(err.constraints || {}).join(', ')}`)
          .join('; ');

        console.log('Errors:', errorMessages);
        throw new Error(`Configuration validation failed: ${errorMessages}`);
      }

      console.log('Configuration chargée et validée avec succès.');
      this.logger.log('Configuration chargée et validée avec succès.');
    } catch (error) {
      this.logger.error(`Erreur de validation de la configuration : ${error.message}`, error.stack);
      process.exit(1);
    }
  }
}
