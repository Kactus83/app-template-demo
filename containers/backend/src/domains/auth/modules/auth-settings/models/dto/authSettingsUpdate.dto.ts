import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { AuthenticationMethod } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * Représente la mise à jour des paramètres d'authentification d'un utilisateur.
 *
 * Ce DTO permet de modifier le type, l'ID associé (le cas échéant) et l'ordre de priorité d'une méthode d'authentification.
 *
 * @example
 * const updateAuthSettings: AuthSettingsUpdateDto = {
 *   method: AuthenticationMethod.EMAIL,
 *   methodId: 1,
 *   order: 1
 * };
 */
export class AuthSettingsUpdateDto {
  @ApiProperty({
    example: 'EMAIL',
    description: "Type de méthode d'authentification",
    enum: AuthenticationMethod,
  })
  @IsEnum(AuthenticationMethod, { message: "Méthode d'authentification invalide" })
  @Expose()
  method!: AuthenticationMethod;

  @ApiPropertyOptional({
    example: 1,
    description: "ID associé à la méthode (si applicable)",
    required: false,
  })
  @IsOptional()
  @IsInt({ message: "L'ID de la méthode doit être un entier" })
  @Expose()
  methodId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: "Ordre de priorité pour la méthode (1 pour principale)",
    required: false,
  })
  @IsOptional()
  @IsInt({ message: "L'ordre doit être un entier" })
  @Expose()
  order?: number;
}
