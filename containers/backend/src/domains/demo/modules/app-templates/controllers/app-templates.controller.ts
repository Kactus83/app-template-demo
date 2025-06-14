import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ROLES } from '../../../../../core/models/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { AppTemplatesService } from '../services/app-templates.service';
import { TemplateDto } from '../models/dto/template.dto';
import { TemplateGlobalStatsDto } from '../models/dto/template-global-stats.dto';
import { TemplateUserStatsDto } from '../models/dto/template-user-stats.dto';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import type { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { CreateTemplateDto } from '../models/dto/create-template.dto';

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
  constructor(private readonly appTemplateService: AppTemplatesService) {}

  /**
   * Liste *tous* les templates.
   */
  @Get()
  @ApiOperation({ summary: 'Liste de tous les templates' })
  @ApiResponse({ status: 200, type: [TemplateDto] })
  listAll(): Promise<TemplateDto[]> {
    return this.appTemplateService.listTemplates();
  }

  /**
   * Liste les templates « attribués » à l’utilisateur courant.
   */
  @Get('me')
  @ApiOperation({ summary: 'Templates de l’utilisateur actif' })
  @ApiResponse({ status: 200, type: [TemplateDto] })
  listMine(@Req() req: IAuthenticatedRequest): Promise<TemplateDto[]> {
    return this.appTemplateService.listUserTemplates(req.user.id);
  }

  /**
   * Téléchargement d’un template (ZIP).
   * Incrémente le compteur même si le template n’est pas « attribué ».
   */
  @Get(':id/download')
  @ApiParam({ name: 'id', example: 1, description: 'ID du template' })
  @ApiOperation({ summary: 'Télécharger le ZIP d’un template' })
  @ApiResponse({ status: 200, description: 'Flux binaire ZIP' })
  async download(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: IAuthenticatedRequest,
  ): Promise<StreamableFile> {
    const { stream, size, fileName } =
      await this.appTemplateService.getTemplateFile(req.user.id, id);

    return new StreamableFile(stream, {
      type: 'application/zip',
      disposition: `attachment; filename="${fileName}"`,
      length: size,
    });
  }

  /**
   * Statistiques globales de téléchargement.
   */
  @Get('stats')
  @ApiOperation({ summary: 'Stats téléchargements – tous templates' })
  @ApiResponse({ status: 200, type: [TemplateGlobalStatsDto] })
  getAllStats(): Promise<TemplateGlobalStatsDto[]> {
    return this.appTemplateService.getAllStats();
  }

  /**
   * Statistiques détaillées pour un template donné.
   * @param id ID interne du template
   */
  @Get(':id/stats')
  @ApiParam({ name: 'id', example: 1, description: 'ID du template' })
  @ApiOperation({ summary: 'Stats user ↔ template' })
  @ApiResponse({ status: 200, type: [TemplateUserStatsDto] })
  getStatsOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TemplateUserStatsDto[]> {
    return this.appTemplateService.getStatsFor(id);
  }

  /**
   * Upload d’un template (ZIP).
   * @param file Fichier ZIP
   * @param dto DTO de création
   */
  @Post()
  @ROLES(UserRole.ADMIN)
  @ApiOperation({ summary: 'Créer un nouveau template (admins)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['name', 'file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, type: TemplateDto })
  create(
    @UploadedFile() file: any,  // Devrait être `Express.Multer.File` mais l'import ne fonctionne pas (à corriger)
    @Body() dto: CreateTemplateDto,
  ): Promise<TemplateDto> {
    return this.appTemplateService.createTemplate(dto, file);
  }
}
