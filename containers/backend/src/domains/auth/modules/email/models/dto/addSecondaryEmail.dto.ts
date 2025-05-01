import { IsEmail, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données pour ajouter un email secondaire à l'utilisateur.
 *
 * Ce DTO est utilisé pour transmettre l'adresse email secondaire à ajouter.
 *
 * @example
 * const addSecondaryEmail: AddSecondaryEmailDto = {
 *   secondaryEmail: "user.secondary@example.com"
 * };
 */
export class AddSecondaryEmailDto {
  @ApiProperty({ description: "Adresse email secondaire de l'utilisateur", format: 'email', example: "user.secondary@example.com" })
  @IsEmail({}, { message: "Format d'email invalide" })
  @IsNotEmpty({ message: "L'email secondaire est requis" })
  @Expose()
  secondaryEmail: string;
}
