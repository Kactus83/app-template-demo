import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AppTemplatesService } from '../services/app-templates.service';
import { TemplateDto } from '../models/dto/template.dto';
import { TemplateGlobalStatsDto } from '../models/dto/template-global-stats.dto';
import { TemplateUserStatsDto } from '../models/dto/template-user-stats.dto';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import type { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import type { Response } from 'express';

/**
 * Controller pour l’API Demo CLI – Templates.
 * Toutes les routes sont protégées par JWT Utilisateur OU Service Account.
 * @category Domains/Demo
 */
@ApiTags('App Templates')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class AppTemplatesController {
  constructor(private readonly svc: AppTemplatesService) {}

  /**
   * Liste *tous* les templates.
   */
  @Get()
  @ApiOperation({ summary: 'Liste de tous les templates' })
  @ApiResponse({ status: 200, type: [TemplateDto] })
  listAll(): Promise<TemplateDto[]> {
    return this.svc.listTemplates();
  }

  /**
   * Liste les templates « attribués » à l’utilisateur courant.
   */
  @Get('me')
  @ApiOperation({ summary: 'Templates de l’utilisateur actif' })
  @ApiResponse({ status: 200, type: [TemplateDto] })
  listMine(@Req() req: IAuthenticatedRequest): Promise<TemplateDto[]> {
    return this.svc.listUserTemplates(req.user.id);
  }

  /**
   * Téléchargement d’un template (ZIP).
   * Incrémente le compteur même si le template n’est pas « attribué ».
   * @param id ID interne du template
   */
  @Get(':id/download')
  @ApiParam({ name: 'id', example: 1, description: 'ID du template' })
  @ApiOperation({ summary: 'Télécharger le ZIP d’un template' })
  @ApiResponse({ status: 200, description: 'Flux binaire ZIP' })
  async download(
    @Param('id') id: number,
    @Req() req: IAuthenticatedRequest,
    @Res() res: Response,
  ) {
    const file = await this.svc.getTemplateFile(req.user.id, id);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
      'Content-Length': file.size,
    });
    return file.stream.pipe(res);
  }

  /**
   * Statistiques globales de téléchargement.
   */
  @Get('stats')
  @ApiOperation({ summary: 'Stats téléchargements – tous templates' })
  @ApiResponse({ status: 200, type: [TemplateGlobalStatsDto] })
  getAllStats(): Promise<TemplateGlobalStatsDto[]> {
    return this.svc.getAllStats();
  }

  /**
   * Statistiques détaillées pour un template donné.
   * @param id ID interne du template
   */
  @Get(':id/stats')
  @ApiParam({ name: 'id', example: 1, description: 'ID du template' })
  @ApiOperation({ summary: 'Stats user ↔ template' })
  @ApiResponse({ status: 200, type: [TemplateUserStatsDto] })
  getStatsOne(@Param('id') id: number): Promise<TemplateUserStatsDto[]> {
    return this.svc.getStatsFor(id);
  }
}
