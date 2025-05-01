import { IsEmail, IsString, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données pour ajouter une authentification classique (email et mot de passe).
 *
 * Ce DTO est utilisé pour associer une authentification par email et mot de passe à un compte.
 *
 * @example
 * const classicAuth: AddClassicAuthDto = {
 *   email: "utilisateur@exemple.com",
 *   password: "motdepassefort"
 * };
 */
export class AddClassicAuthDto {
  @ApiProperty({ description: "Adresse email de l'utilisateur", format: 'email', example: "utilisateur@exemple.com" })
  @IsEmail({}, { message: "Format d'email invalide" })
  @Expose()
  email: string;

  @ApiProperty({ description: "Mot de passe de l'utilisateur", minLength: 6, example: "motdepassefort" })
  @IsString({ message: "Le mot de passe doit être une chaîne de caractères" })
  @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
  @Expose()
  password: string;
}
