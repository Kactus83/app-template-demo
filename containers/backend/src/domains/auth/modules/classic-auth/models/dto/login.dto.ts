import { IsEmail, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données de connexion d'un utilisateur.
 *
 * Ce DTO est utilisé pour l'authentification en fournissant l'email et le mot de passe.
 *
 * @example
 * const loginData: LoginDto = {
 *   email: "utilisateur@exemple.com",
 *   password: "motdepassefort"
 * };
 */
export class LoginDto {
  @ApiProperty({ description: "Email de l'utilisateur", format: "email", example: "utilisateur@exemple.com" })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({ description: "Mot de passe de l'utilisateur", format: "password", example: "motdepassefort" })
  @IsNotEmpty()
  @Expose()
  password: string;
}
