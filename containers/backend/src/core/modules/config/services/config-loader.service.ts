import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppConfig } from '../types/app.config';
import * as fs from 'fs';
import * as path from 'path';

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

      // --------------------------------------------------------------------
      // Lecture facultative du fichier JSON produit par le conteneur Blockchain
      // --------------------------------------------------------------------
      // Chemin dans lequel le conteneur Blockchain a écrit son JSON de déploiement
      const backendJsonPath = path.join(
        process.cwd(),         // en conteneur, process.cwd() === /app
        'deployments',
        'web3',
        'Backend.json'
      );

      
      
      // Comme Web3 est neutralisé pour la demo, on fournit un fallback safe pour
      // ne pas alterner le code (TSDoc fonctionnerai mal sinon)

      let deployerAddress = null;
      let deployerPrivateKey = null;
      
      if (process.env.DISABLE_WEB3 === 'true') {
        deployerAddress = '';
        deployerPrivateKey = '';
      }else{
        deployerAddress = this.configService.get<string>('deployerAddress');
        deployerPrivateKey = this.configService.get<string>('deployerPrivateKey');
      }

      if (
        (!deployerAddress || !deployerPrivateKey) &&
        fs.existsSync(backendJsonPath)
      ) {
        try {
          const file = fs.readFileSync(backendJsonPath, 'utf8');
          const obj = JSON.parse(file);
          deployerAddress     = obj.address;
          deployerPrivateKey  = obj.privateKey;
          console.log(
            `✔ Récupéré depuis ${backendJsonPath}: address=${deployerAddress}`
          );
        } catch (e) {
          this.logger.warn(
            `Impossible de lire/parsing ${backendJsonPath}: ${e.message}`
          );
        }
      }

      // --------------------------------------------------------------------
      // Construction de l'objet de configuration à partir des variables et fallback JSON
      // --------------------------------------------------------------------
      const configObject = {
        VAULT_ADDR: this.configService.get<string>('VAULT_ADDR'),
        VAULT_CREDENTIALS_PATH: this.configService.get<string>(
          'VAULT_CREDENTIALS_PATH'
        ),
        JWT_SECRET: this.configService.get<string>('JWT_SECRET'),
        JWT_EXPIRES_IN: this.configService.get<string>('JWT_EXPIRES_IN'),
        JWT_EXPIRATION_BUFFER: parseInt(
          this.configService.get<string>('JWT_EXPIRATION_BUFFER'),
          10
        ),
        JWT_ISSUER: this.configService.get<string>('JWT_ISSUER'),
        JWT_MAX_AGE: this.configService.get<string>('JWT_MAX_AGE'),
        DATABASE_URL: this.configService.get<string>('DATABASE_URL'),
        POSTGRES_USER: this.configService.get<string>('POSTGRES_USER'),
        POSTGRES_PASSWORD: this.configService.get<string>(
          'POSTGRES_PASSWORD'
        ),
        POSTGRES_DB: this.configService.get<string>('POSTGRES_DB'),
        GOOGLE_CLIENT_ID: this.configService.get<string>(
          'GOOGLE_CLIENT_ID'
        ),
        GOOGLE_CLIENT_SECRET: this.configService.get<string>(
          'GOOGLE_CLIENT_SECRET'
        ),
        GOOGLE_CALLBACK_URL: this.configService.get<string>(
          'GOOGLE_CALLBACK_URL'
        ),
        GITHUB_CLIENT_ID: this.configService.get<string>('GITHUB_CLIENT_ID'),
        GITHUB_CLIENT_SECRET: this.configService.get<string>(
          'GITHUB_CLIENT_SECRET'
        ),
        GITHUB_CALLBACK_URL: this.configService.get<string>(
          'GITHUB_CALLBACK_URL'
        ),
        FACEBOOK_CLIENT_ID: this.configService.get<string>(
          'FACEBOOK_CLIENT_ID'
        ),
        FACEBOOK_CLIENT_SECRET: this.configService.get<string>(
          'FACEBOOK_CLIENT_SECRET'
        ),
        FACEBOOK_CALLBACK_URL: this.configService.get<string>(
          'FACEBOOK_CALLBACK_URL'
        ),
        SESSION_SECRET: this.configService.get<string>('SESSION_SECRET'),
        FRONTEND_URL: this.configService.get<string>('FRONTEND_URL'),
        MAIL_SERVICE: this.configService.get<string>('MAIL_SERVICE'),
        MAIL_HOST: this.configService.get<string>('MAIL_HOST'),
        MAIL_PORT: parseInt(
          this.configService.get<string>('MAIL_PORT'),
          10
        ),
        MAIL_FROM: this.configService.get<string>('MAIL_FROM'),
        MAIL_FROM_NAME: this.configService.get<string>('MAIL_FROM_NAME'),
        MAIL_USER: this.configService.get<string>('MAIL_USER'),
        MAIL_PASS: this.configService.get<string>('MAIL_PASS'),
        TWILIO_ACCOUNT_SID: this.configService.get<string>(
          'TWILIO_ACCOUNT_SID'
        ),
        TWILIO_AUTH_TOKEN: this.configService.get<string>(
          'TWILIO_AUTH_TOKEN'
        ),
        TWILIO_VERIFY_SERVICE_SID: this.configService.get<string>(
          'TWILIO_VERIFY_SERVICE_SID'
        ),
        // on injecte ici les valeurs lues ou issues de process.env
        deployerAddress,
        deployerPrivateKey,
      };

      // Transformation & validation
      const validatedConfig = plainToInstance(AppConfig, configObject, {
        enableImplicitConversion: true,
      });
      const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
      });
      if (errors.length > 0) {
        const errMsg = errors
          .map(err => `${err.property}: ${Object.values(err.constraints!).join(', ')}`)
          .join('; ');
        console.log('Errors:', errMsg);
        throw new Error(`Validation failed: ${errMsg}`);
      }

      console.log('Configuration chargée et validée avec succès.');
      this.logger.log('Configuration chargée et validée avec succès.');
    } catch (error) {
      this.logger.error(
        `Erreur de validation de la configuration : ${error.message}`,
        error.stack
      );
      process.exit(1);
    }
  }
}
