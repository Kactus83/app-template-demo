import { AuthenticationMethod } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsEnum, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Représente une méthode d'authentification individuelle.
 *
 * Ce DTO définit les informations d'une méthode d'authentification, utile notamment pour la MFA
 * et la priorisation des moyens d'authentification.
 *
 * @example
 * const authMethod: AuthMethodDto = {
 *   id: 1,
 *   method: AuthenticationMethod.EMAIL,
 *   methodId: null,
 *   order: 1
 * };
 */
export class AuthMethodDto {
  @ApiProperty({ example: 1, description: "ID de la méthode d'authentification" })
  @IsInt()
  @Expose()
  id!: number;

  @ApiProperty({
    example: 'EMAIL',
    description: "Type de méthode d'authentification",
    enum: AuthenticationMethod,
  })
  @IsEnum(AuthenticationMethod, { message: "Méthode d'authentification invalide" })
  @Expose()
  method!: AuthenticationMethod;

  @ApiProperty({ example: null, description: "ID associé à la méthode (si applicable)", nullable: true })
  @IsOptional()
  @IsInt()
  @Expose()
  methodId!: number | null;

  @ApiProperty({ example: 1, description: "Ordre de priorité de la méthode" })
  @IsInt()
  @Expose()
  order!: number;
}
