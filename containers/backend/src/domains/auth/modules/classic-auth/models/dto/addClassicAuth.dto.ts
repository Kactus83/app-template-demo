import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Ajout d’une méthode de connexion classique par email + mot de passe
 */
export class AddEmailClassicAuthDto {
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    format: 'email',
    example: "utilisateur@exemple.com",
  })
  @IsEmail({}, { message: "Format d'email invalide" })
  @Expose()
  email!: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur (au moins 6 caractères)",
    minLength: 6,
    example: "motdepassefort",
  })
  @IsString({ message: "Le mot de passe doit être une chaîne de caractères" })
  @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
  @Expose()
  password!: string;
}

/**
 * Ajout d’une méthode de connexion classique par username + mot de passe
 */
export class AddUsernameClassicAuthDto {
  @ApiProperty({
    description: "Nom d’utilisateur (username)",
    example: "user123",
  })
  @IsString({ message: "Le nom d’utilisateur doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "Le nom d’utilisateur ne peut pas être vide" })
  @Expose()
  username!: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur (au moins 6 caractères)",
    minLength: 6,
    example: "motdepassefort",
  })
  @IsString({ message: "Le mot de passe doit être une chaîne de caractères" })
  @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
  @Expose()
  password!: string;
}