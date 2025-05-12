import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Données d'inscription pour un nouvel utilisateur.
 */
export class RegisterDto {
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    format: "email",
    example: "utilisateur@exemple.com",
  })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email!: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur (au moins 6 caractères)",
    format: "password",
    example: "motdepassefort",
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  password!: string;

  @ApiPropertyOptional({
    description: "Nom d’utilisateur (username)",
    example: "user123",
  })
  @IsOptional()
  @IsString()
  @Expose()
  username?: string;

  @ApiPropertyOptional({
    description: "Prénom de l'utilisateur",
    example: "John",
  })
  @IsOptional()
  @IsString()
  @Expose()
  firstName?: string;

  @ApiPropertyOptional({
    description: "Nom de famille de l'utilisateur",
    example: "Doe",
  })
  @IsOptional()
  @IsString()
  @Expose()
  lastName?: string;

  @ApiPropertyOptional({
    description: "Email secondaire de l'utilisateur",
    format: "email",
    example: "secondaire@exemple.com",
  })
  @IsOptional()
  @IsEmail()
  @Expose()
  secondaryEmail?: string;
}