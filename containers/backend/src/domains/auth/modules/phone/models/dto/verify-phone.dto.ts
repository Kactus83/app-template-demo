import { IsString, Length, IsPhoneNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données pour vérifier un numéro de téléphone.
 *
 * Ce DTO est utilisé pour valider un numéro de téléphone en fournissant le numéro au format E.164
 * et le code de vérification reçu par SMS.
 *
 * @example
 * const verifyPhone: VerifyPhoneDto = {
 *   phoneNumber: "+1234567890",
 *   token: "12345678"
 * };
 */
export class VerifyPhoneDto {
  @ApiProperty({ description: "Numéro de téléphone au format E.164", example: "+1234567890" })
  @IsString()
  @IsPhoneNumber(undefined, { message: "Le numéro de téléphone doit être valide" })
  @Expose()
  phoneNumber: string;

  @ApiProperty({ description: "Code de vérification reçu par SMS (code de 8 chiffres)", example: "12345678" })
  @IsString()
  @Length(8, 8, { message: "Le token doit être un code de 8 chiffres" })
  @Expose()
  token: string;
}
