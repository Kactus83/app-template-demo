import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * Représente la désactivation d'une méthode d'authentification.
 *
 * Ce DTO est utilisé pour désactiver une méthode d'authentification, notamment dans le cadre de la MFA.
 *
 * @example
 * const disableAuth: AuthSettingsDisableDto = {
 *   methodId: 2
 * };
 */
export class AuthSettingsDisableDto {
  @ApiProperty({ example: 2, description: "ID de la méthode d'authentification à désactiver" })
  @IsInt({ message: "L'ID de la méthode doit être un entier" })
  @Expose()
  methodId!: number;
}
