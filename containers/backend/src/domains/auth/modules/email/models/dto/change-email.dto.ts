import { IsNotEmpty, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données pour changer l'email principal de l'utilisateur.
 *
 * Ce DTO est utilisé pour transmettre le nouvel email lors d'une demande de changement.
 *
 * @example
 * const changeEmail: ChangeEmailDto = {
 *   newEmail: "newuser@example.com"
 * };
 */
export class ChangeEmailDto {
  @ApiProperty({ description: "Nouvelle adresse email pour le changement", format: 'email', example: "newuser@example.com" })
  @IsNotEmpty({ message: "Le nouvel email est requis" })
  @IsEmail({}, { message: "Format d'email invalide" })
  @Expose()
  newEmail: string;
}
