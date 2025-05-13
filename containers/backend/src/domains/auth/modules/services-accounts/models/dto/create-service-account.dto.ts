import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsArray,
    ValidateNested,
    IsDateString,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  import { ScopeTarget, ScopePermission } from '@prisma/client';
  
  /**
   * DTO pour un scope d’un compte de service.
   */
  export class CreateServiceAccountScopeDto {
    @ApiProperty({ enum: ScopeTarget, description: 'Domaine du scope', example: ScopeTarget.AUTH })
    @IsNotEmpty()
    @IsString()
    @IsOptional() // Nest génère string enums
    readonly target!: ScopeTarget;
  
    @ApiProperty({ enum: ScopePermission, description: 'Permission du scope', example: ScopePermission.READ })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    readonly permission!: ScopePermission;
  }
  
  /**
   * DTO de création d’un compte de service pour un utilisateur.
   */
  export class CreateServiceAccountDto {
    @ApiProperty({ description: 'Nom descriptif du compte de service', example: 'CLI principal' })
    @IsNotEmpty()
    @IsString()
    readonly name!: string;
  
    @ApiPropertyOptional({ description: 'Date limite de validité (ISO 8601)', example: '2025-12-31T23:59:59.000Z' })
    @IsOptional()
    @IsDateString()
    readonly validTo?: string;
  
    @ApiPropertyOptional({ description: 'Liste d’IP autorisées (CIDR ou adresse simple)', example: ['192.0.2.0/24'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly allowedIps?: string[];
  
    @ApiPropertyOptional({
      type: [CreateServiceAccountScopeDto],
      description: 'Scopes à donner au compte',
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateServiceAccountScopeDto)
    readonly scopes?: CreateServiceAccountScopeDto[];
  }