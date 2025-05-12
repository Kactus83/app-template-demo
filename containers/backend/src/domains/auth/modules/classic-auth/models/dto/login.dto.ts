import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Login via email + password
 */
export class EmailLoginDto {
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    format: "email",
    example: "utilisateur@exemple.com",
  })
  @IsEmail()
  @Expose()
  email!: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    format: "password",
    example: "motdepassefort",
  })
  @IsNotEmpty()
  @Expose()
  password!: string;
}

/**
 * Login via username + password
 */
export class UsernameLoginDto {
  @ApiProperty({
    description: "Nom d’utilisateur (username)",
    example: "user123",
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  username!: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    format: "password",
    example: "motdepassefort",
  })
  @IsNotEmpty()
  @Expose()
  password!: string;
}