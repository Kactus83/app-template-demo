import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceAccountScopeDto } from './service-account.dto';

/**
 * DTO retourné pour un compte de service.
 */
export class CreateServiceAccountResponseDto {
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


  @ApiProperty({ description: 'Secret du service créé' })
  @Expose()
  readonly secret!: string;
}