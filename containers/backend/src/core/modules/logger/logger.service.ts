import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as Sentry from '@sentry/node';
import SentryTransport from 'winston-transport-sentry-node';

/**
 * Service de logging basé sur Winston, intégrant :
 * - Une sortie console (avec mise en forme pour l'environnement de développement),
 * - Une rotation quotidienne des logs,
 * - Un enregistrement des erreurs dans un fichier dédié,
 * - L'envoi des erreurs à Sentry.
 *
 * Ce service permet d'assurer une gestion centralisée des logs dans l'application.
 * @implements NestLoggerService
 * @category Core
 * @category Core Services
 */

// Initialiser Sentry avec les configurations provenant de l'environnement
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, context }) =>
        `${timestamp} [${level}] ${context ? `[${context}] ` : ''}${message}`
      ),
    );

    this.logger = winston.createLogger({
      level: this.configService.get<string>('LOG_LEVEL', 'info'),
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format:
            this.configService.get<string>('NODE_ENV') === 'development'
              ? winston.format.combine(winston.format.colorize(), logFormat)
              : winston.format.simple(),
        }),
        new winston.transports.DailyRotateFile({
          filename: './logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '14d',
          maxSize: '20m',
        }),
        new winston.transports.File({
          filename: './logs/error.log',
          level: 'error',
        }),
        new SentryTransport({
          sentry: {
            dsn: this.configService.get<string>('SENTRY_DSN'),
            environment: this.configService.get<string>('NODE_ENV'),
          },
          level: 'error',
          // Attache des contextes spécifiques aux logs Sentry
          format: winston.format((info) => {
            info.context = info.context || 'unknown';
            info.requestId = info.requestId || 'no-request-id';
            return info;
          })(),
        }),
      ],
      exceptionHandlers: [
        new winston.transports.File({ filename: './logs/exceptions.log' }),
        new SentryTransport({
          sentry: {
            dsn: this.configService.get<string>('SENTRY_DSN'),
            environment: this.configService.get<string>('NODE_ENV'),
          },
          level: 'error',
        }),
      ],
    });
    console.log('LoggerService constructor end');
  }

  /**
   * Log un message de niveau "info".
   *
   * @param {string} message - Le message à logger.
   * @param {string} [context] - Le contexte du log.
   */
  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  /**
   * Log un message de niveau "error" avec trace.
   *
   * @param {string} message - Le message d'erreur.
   * @param {string} trace - La trace d'erreur.
   * @param {string} [context] - Le contexte du log.
   */
  error(message: string, trace: string, context?: string) {
    this.logger.error(`${message} - Trace: ${trace}`, { context });
  }

  /**
   * Log un message de niveau "warn".
   *
   * @param {string} message - Le message d'avertissement.
   * @param {string} [context] - Le contexte du log.
   */
  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  /**
   * Log un message de niveau "debug".
   *
   * @param {string} message - Le message de debug.
   * @param {string} [context] - Le contexte du log.
   */
  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  /**
   * Log un message de niveau "verbose".
   *
   * @param {string} message - Le message détaillé.
   * @param {string} [context] - Le contexte du log.
   */
  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
