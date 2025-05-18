import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ description: 'Biographie de l’utilisateur' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'URL Twitter' })
  @IsOptional()
  @IsUrl()
  twitterUrl?: string;

  @ApiPropertyOptional({ description: 'URL LinkedIn' })
  @IsOptional()
  @IsUrl()
  linkedInUrl?: string;

  @ApiPropertyOptional({ description: 'URL Facebook' })
  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @ApiPropertyOptional({ description: 'URL de l’image de bannière' })
  @IsOptional()
  @IsUrl()
  bannerUrl?: string;
}
