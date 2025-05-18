import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


/**
 * Statistiques globales par template.
 * @category Domains/Demo
 */
export class TemplateGlobalStatsDto {
  @ApiProperty({ example: 1, description: 'ID du template' })
  @Expose() templateId!: number;

  @ApiProperty({ example: 42, description: 'Total téléchargements' })
  @Expose() total!: number;
}
