import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente la réinitialisation effective du mot de passe.
 *
 * Ce DTO est utilisé pour définir un nouveau mot de passe à l'aide d'un token de réinitialisation.
 *
 * @example
 * const resetPassword: ResetPasswordDto = {
 *   token: "abcd1234",
 *   newPassword: "nouveaumotdepasse"
 * };
 */
export class ResetPasswordDto {
  @ApiProperty({ description: "Jeton de réinitialisation de mot de passe", example: "abcd1234" })
  @IsNotEmpty()
  @IsString()
  @Expose()
  token: string;

  @ApiProperty({ description: "Nouveau mot de passe (au moins 6 caractères)", minLength: 6, example: "nouveaumotdepasse" })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
  @Expose()
  newPassword: string;
}
