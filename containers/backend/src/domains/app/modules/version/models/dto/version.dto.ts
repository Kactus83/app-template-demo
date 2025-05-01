import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * Contains version information for both the backend and frontend.
 *
 * This DTO is used to track the version numbers of the application components.
 *
 * @example
 * const versionInfo: VersionDto = {
 *   backend: "1.0.0",
 *   frontend: "2.0.0"
 * };
 */
export class VersionDto {
  @ApiPropertyOptional({ description: 'Version du backend', type: String })
  @IsOptional()
  @IsString()
  @Expose()
  backend?: string;

  @ApiPropertyOptional({ description: 'Version du frontend', type: String })
  @IsOptional()
  @IsString()
  @Expose()
  frontend?: string;
}
