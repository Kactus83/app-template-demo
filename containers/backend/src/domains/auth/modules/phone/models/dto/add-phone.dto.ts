import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données pour ajouter un numéro de téléphone.
 *
 * Ce DTO est utilisé pour ajouter un numéro de téléphone au format E.164.
 *
 * @example
 * const addPhone: AddPhoneDto = {
 *   phoneNumber: "+1234567890"
 * };
 */
export class AddPhoneDto {
  @ApiProperty({ 
    description: "Numéro de téléphone à ajouter (format E.164)", 
    pattern: "^\\+?[1-9]\\d{1,14}$", 
    example: "+1234567890" 
  })
  @IsString()
  @Expose()
  phoneNumber: string;
}
