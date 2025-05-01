import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Contrôleur exposant un endpoint pour vérifier l'état de l'application.
 * Cet endpoint est utilisé pour réaliser des vérifications de santé (health checks).
 * @category Core
 * @category Controllers
 */
@ApiTags('CORE - Health')
@Controller('health')
export class HealthController {
  /**
   * Vérifie l'état de l'application.
   *
   * @returns {object} Un objet indiquant que l'application est opérationnelle.
   */
  @Get()
  @ApiOperation({ summary: "Vérifie l'état de l'application" })
  @ApiResponse({ status: 200, description: "L'application est en marche." })
  getHealth() {
    return { status: 'OK' };
  }
}
