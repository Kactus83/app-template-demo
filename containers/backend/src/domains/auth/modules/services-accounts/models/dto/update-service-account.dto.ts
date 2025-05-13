import {
    IsOptional,
    IsString,
    IsDateString,
    IsArray,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiPropertyOptional } from '@nestjs/swagger';
  import { ScopeTarget, ScopePermission } from '@prisma/client';
  
  /**
   * DTO pour modifier un scope existant.
   */
  export class UpdateServiceAccountScopeDto {
    @ApiPropertyOptional({ enum: ScopeTarget, description: 'Domaine du scope', example: ScopeTarget.USER })
    @IsOptional()
    readonly target?: ScopeTarget;
  
    @ApiPropertyOptional({ enum: ScopePermission, description: 'Permission du scope', example: ScopePermission.WRITE })
    @IsOptional()
    readonly permission?: ScopePermission;
  }
  
  /**
   * DTO de mise à jour d’un compte de service.
   */
  export class UpdateServiceAccountDto {
    @ApiPropertyOptional({ description: 'Nouveau nom', example: 'Webhook Bot' })
    @IsOptional()
    @IsString()
    readonly name?: string;
  
    @ApiPropertyOptional({ description: 'Nouvelle date limite (ISO 8601)', example: '2026-01-01T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    readonly validTo?: string;
  
    @ApiPropertyOptional({ description: 'Nouvelle liste d’IP autorisées', example: ['203.0.113.5'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly allowedIps?: string[];
  
    @ApiPropertyOptional({
      type: [UpdateServiceAccountScopeDto],
      description: 'Scopes à ajouter/supprimer',
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateServiceAccountScopeDto)
    readonly scopes?: UpdateServiceAccountScopeDto[];
  }