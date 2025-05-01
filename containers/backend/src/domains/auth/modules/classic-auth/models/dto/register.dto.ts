import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Représente les données d'inscription d'un utilisateur.
 *
 * Ce DTO est utilisé pour créer un nouveau compte en fournissant l'email, le mot de passe et, éventuellement, un email secondaire et un nom.
 *
 * @example
 * const registerData: RegisterDto = {
 *   email: "utilisateur@exemple.com",
 *   password: "motdepassefort",
 *   name: "Nom Utilisateur"
 * };
 */
export class RegisterDto {
  @ApiProperty({ description: "Email de l'utilisateur", format: "email", example: "utilisateur@exemple.com" })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @ApiPropertyOptional({ description: "Email secondaire de l'utilisateur", format: "email", example: "secondaire@exemple.com" })
  @IsOptional()
  @IsEmail()
  @Expose()
  secondaryEmail?: string;

  @ApiProperty({ description: "Mot de passe de l'utilisateur (au moins 6 caractères)", format: "password", example: "motdepassefort" })
  @IsNotEmpty()
  @IsString()
  @Expose()
  password: string;

  @ApiPropertyOptional({ description: "Nom de l'utilisateur", example: "Nom Utilisateur" })
  @IsOptional()
  @IsString()
  @Expose()
  name?: string;
}
