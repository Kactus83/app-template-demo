import {
  Controller,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AppWizardService } from '../services/app-wizard.service';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import type { Response } from 'express';

/**
 * Contrôleur pour l’API Demo CLI – Wizard.
 * Point d’accès pour le téléchargement du setup wizard.
 * @category Domains/Demo
 */
@ApiTags('App Wizard')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class AppWizardController {
  constructor(private readonly svc: AppWizardService) {}

  /**
   * Téléchargement du ZIP du setup wizard.
   */
  @Get()
  @ApiOperation({ summary: 'Télécharger le setup wizard' })
  @ApiResponse({ status: 200, description: 'Flux binaire ZIP' })
  download(@Res() res: Response) {
    const { fileName, size, stream } = this.svc.getWizardFile();
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': size,
    });
    return stream.pipe(res);
  }
}
