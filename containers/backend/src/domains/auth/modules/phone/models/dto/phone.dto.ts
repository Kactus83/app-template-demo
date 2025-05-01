import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean } from 'class-validator';

/**
 * Représente un numéro de téléphone enregistré.
 *
 * Ce DTO contient les informations d'un numéro de téléphone, telles que l'identifiant,
 * l'ID de l'utilisateur associé, le numéro, le statut de vérification et la date de création.
 *
 * @example
 * const phone: PhoneDto = {
 *   id: 1,
 *   userId: 1,
 *   phoneNumber: "+1234567890",
 *   isVerified: false,
 *   createdAt: new Date("2024-05-30T12:34:56.789Z")
 * };
 */
export class PhoneDto {
  @ApiProperty({ description: "Identifiant unique du numéro de téléphone", example: 1 })
  @IsNumber()
  @Expose()
  id: number;

  @ApiProperty({ description: "ID de l'utilisateur propriétaire", example: 1 })
  @IsNumber()
  @Expose()
  userId: number;

  @ApiProperty({ description: "Numéro de téléphone", example: "+1234567890" })
  @IsString()
  @Expose()
  phoneNumber: string;

  @ApiProperty({ description: "Indique si le numéro de téléphone est vérifié", example: false })
  @IsBoolean()
  @Expose()
  isVerified: boolean;

  @ApiProperty({ 
    description: "Date de création du numéro de téléphone", 
    type: String, 
    format: "date-time", 
    example: "2024-05-30T12:34:56.789Z" 
  })
  @Expose()
  createdAt: Date;
}
