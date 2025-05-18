import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Statistiques de téléchargements par utilisateur.
 * @category Domains/Demo
 */
export class TemplateUserStatsDto {
  @ApiProperty({ example: 7, description: 'ID de l’utilisateur' })
  @Expose() userId!: number;

  @ApiProperty({ example: 3, description: 'Nombre de téléchargements' })
  @Expose() count!: number;
}
