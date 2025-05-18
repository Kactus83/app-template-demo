import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO minimal pour lister un template.
 * @category Domains/Demo
 */
export class TemplateDto {
  @ApiProperty({ example: 1, description: 'ID interne' })
  @Expose() id!: number;

  @ApiProperty({ example: 'blog', description: 'Nom unique' })
  @Expose() name!: string;

  @ApiProperty({ example: 'Template minimal pour un blog', required: false })
  @Expose() description?: string;
}
