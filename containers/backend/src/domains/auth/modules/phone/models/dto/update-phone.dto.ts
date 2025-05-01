import { IsString, IsOptional, IsBoolean, Matches } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Représente les données pour mettre à jour un numéro de téléphone.
 *
 * Ce DTO permet de modifier le numéro de téléphone et son statut de vérification.
 *
 * @example
 * const updatePhone: UpdatePhoneDto = {
 *   phoneNumber: "+0987654321",
 *   isVerified: true
 * };
 */
export class UpdatePhoneDto {
  @ApiPropertyOptional({ 
    description: "Nouveau numéro de téléphone (format E.164)", 
    pattern: "^\\+?[1-9]\\d{1,14}$", 
    example: "+0987654321" 
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: "Le numéro de téléphone doit être au format E.164" })
  @Expose()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: "Statut de vérification du numéro de téléphone", example: true })
  @IsOptional()
  @IsBoolean()
  @Expose()
  isVerified?: boolean;
}
