import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ScopePermission, ScopeTarget } from '@prisma/client';


/**
 * Représentation d’un scope attaché à un compte de service.
 */
export class ServiceAccountScopeDto {
  @ApiProperty({
    enum: ScopeTarget,
    description: 'Domaine du scope',
  })
  @Expose()
  readonly target!: ScopeTarget;

  @ApiProperty({
    enum: ScopePermission,
    description: 'Permission du scope',
  })
  @Expose()
  readonly permission!: ScopePermission;
}

/**
 * DTO retourné pour un compte de service.
 */
export class ServiceAccountDto {
  @ApiProperty({ description: 'UUID du compte de service' })
  @Expose()
  readonly id!: string;

  @ApiProperty({ description: 'Nom descriptif du compte' })
  @Expose()
  readonly name!: string;

  @ApiProperty({ description: 'Identifiant public (clientId)' })
  @Expose()
  readonly clientId!: string;

  @ApiProperty({ description: 'Date de création (ISO 8601)' })
  @Expose()
  readonly createdAt!: Date;

  @ApiProperty({ description: 'Date de début de validité (ISO 8601)' })
  @Expose()
  readonly validFrom!: Date;

  @ApiProperty({ description: 'Date de fin de validité (ISO 8601), null pour illimité' })
  @Expose()
  readonly validTo!: Date | null;

  @ApiProperty({ description: 'Liste d’IP autorisées' })
  @Expose()
  readonly allowedIps!: string[];

  @ApiProperty({ type: [ServiceAccountScopeDto], description: 'Scopes attachés au compte' })
  @Expose()
  @Type(() => ServiceAccountScopeDto)
  readonly scopes!: ServiceAccountScopeDto[];
}