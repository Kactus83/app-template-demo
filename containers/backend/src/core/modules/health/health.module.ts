import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/**
 * Module dédié aux vérifications de santé de l'application.
 *
 * Ce module expose le contrôleur HealthController qui fournit un endpoint
 * permettant de s'assurer que l'application est en marche.
 * @category Core
 * @category Core Modules
 */
@Module({
  controllers: [HealthController],
})
export class HealthModule {
  constructor() {
    console.log('HealthModule loaded');
  }
}
