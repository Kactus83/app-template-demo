import { SecureAction } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente une demande d'authentification multi-facteurs (MFA) pour une action sécurisée.
 *
 * Ce DTO est utilisé pour initier une demande MFA en spécifiant le type d'action sécurisée.
 *
 * @example
 * const mfaRequest: MFARequestDto = {
 *   secureActionType: SecureAction.CHANGEMAIL
 * };
 */
export class MFARequestDto {
  @ApiProperty({
    description: "Type d'action sécurisée pour la demande MFA",
    enum: SecureAction,
    example: SecureAction.ALL,
  })
  @IsEnum(SecureAction)
  @Expose()
  secureActionType: SecureAction;
}
