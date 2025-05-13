import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { SecureAction } from '@prisma/client';

/**
 * Payload spécifique aux tokens MFA.
 * Utilisé pour vérifier qu’un token MFA authentifie bien l’utilisateur
 * pour l’action sécurisée demandée.
 * @category Core
 * @category DTOs
 */
export class JwtMfaPayloadDto {
  @ApiProperty({
    description: 'UUID du token MFA',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  @Expose()
  readonly mfaId!: string;

  @ApiProperty({
    description: "ID interne de l'utilisateur",
    example: 42,
  })
  @IsInt()
  @Expose()
  readonly userId!: number;

  @ApiProperty({
    description: 'Action sécurisée couverte par ce token MFA',
    enum: SecureAction,
  })
  @IsEnum(SecureAction)
  @Expose()
  readonly action!: SecureAction;
}