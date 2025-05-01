import { IsBoolean } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données pour mettre à jour l'état d'un authenticator.
 *
 * Ce DTO permet d'activer ou de désactiver un authenticator.
 *
 * @example
 * const updateAuthenticator: UpdateAuthenticatorDto = {
 *   enabled: true
 * };
 */
export class UpdateAuthenticatorDto {
  @ApiProperty({ description: "Indique si l'authenticator doit être activé ou désactivé", example: true })
  @IsBoolean()
  @Expose()
  enabled: boolean;
}
