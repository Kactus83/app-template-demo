import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

/**
 * Module global de gestion des logs.
 *
 * Ce module fournit un service de logging centralisé (LoggerService) qui peut être utilisé dans l'ensemble de l'application.
 * @category Core
 * @category Core Modules
 */
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {
  constructor() {
    console.log('LoggerModule loaded');
  }
}
