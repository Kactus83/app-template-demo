import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsArray, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Payload spécifique aux tokens des Service Accounts.
 * @category Core
 * @category DTOs
 */
export class JwtServiceAccountPayloadDto {
  @ApiProperty({
    description: 'UUID public du compte de service (clientId)',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  @Expose()
  readonly clientId!: string;

  @ApiProperty({
    description: "ID interne de l'utilisateur maître",
    example: 42,
  })
  @IsInt()
  @Expose()
  readonly userId!: number;

  @ApiProperty({
    description: 'Liste des scopes (format "target:permission")',
    isArray: true,
    example: ['auth:read', 'user:write'],
  })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  readonly scopes!: string[];
}
