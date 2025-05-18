import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateUserPreferencesDto {
  @ApiPropertyOptional({ description: 'Locale de l’utilisateur', example: 'fr' })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional({ description: 'Fuseau horaire', example: 'Europe/Paris' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Thème de l’interface',
    example: 'dark',
    enum: ['light', 'dark'],
  })
  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: string;
}
