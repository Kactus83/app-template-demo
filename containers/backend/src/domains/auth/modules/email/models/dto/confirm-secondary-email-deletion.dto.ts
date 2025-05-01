import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données de confirmation de suppression d'un email secondaire.
 *
 * Ce DTO est utilisé pour transmettre le token de confirmation lors de la suppression de l'email secondaire.
 *
 * @example
 * const confirmSecondaryEmailDeletion: ConfirmSecondaryEmailDeletionDto = {
 *   token: "xyz789token"
 * };
 */
export class ConfirmSecondaryEmailDeletionDto {
  @ApiProperty({ description: "Token de confirmation de suppression de l'email secondaire", example: "xyz789token" })
  @IsString({ message: "Le token doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "Le token est requis" })
  @Expose()
  token: string;
}
