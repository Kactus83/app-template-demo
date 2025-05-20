import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * DTO pour créer un nouveau template CLI.
 * @category Domains/Demo
 */
export class CreateTemplateDto {
  @ApiProperty({
    description: 'Nom unique du template (sans extension)',
    example: 'app-template',
  })
  @IsString()
  @Expose()
  name!: string;

  @ApiPropertyOptional({
    description: 'Description du template',
    example: 'Version complète incluant Vault',
  })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;
}
