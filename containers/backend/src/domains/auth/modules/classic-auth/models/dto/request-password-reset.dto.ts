import { IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente la demande de réinitialisation de mot de passe.
 *
 * Ce DTO est utilisé pour demander une réinitialisation de mot de passe via l'email.
 *
 * @example
 * const passwordReset: PasswordResetDto = {
 *   email: "utilisateur@exemple.com"
 * };
 */
export class RequestPasswordResetDto {
  @ApiProperty({ description: "Email de l'utilisateur pour demander une réinitialisation de mot de passe", format: "email", example: "utilisateur@exemple.com" })
  @IsEmail()
  @Expose()
  email: string;
}