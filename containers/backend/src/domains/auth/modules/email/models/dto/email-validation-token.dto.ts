import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente le token de validation d'email.
 *
 * Ce DTO est utilisé pour transmettre le token de validation d'email dans le corps de la requête.
 *
 * @example
 * const emailValidationToken: EmailValidationTokenDto = {
 *   token: "abc123token"
 * };
 */
export class EmailValidationTokenDto {
  @ApiProperty({ description: "Token utilisé pour la validation de l'email", example: "abc123token" })
  @IsNotEmpty({ message: "Le token est requis" })
  @IsString({ message: "Le token doit être une chaîne de caractères" })
  @Expose()
  token: string;
}
