import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données de confirmation d'un changement d'email.
 *
 * Ce DTO est utilisé pour transmettre le token de confirmation lors du changement de l'email principal.
 *
 * @example
 * const confirmEmailChange: ConfirmEmailChangeDto = {
 *   token: "abc123token"
 * };
 */
export class ConfirmEmailChangeDto {
  @ApiProperty({ description: "Token de confirmation du changement d'email principal", example: "abc123token" })
  @IsNotEmpty({ message: "Le token est requis" })
  @IsString({ message: "Le token doit être une chaîne de caractères" })
  @Expose()
  token: string;
}
