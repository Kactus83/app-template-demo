import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données pour définir la nouvelle limite maximale d'approvisionnement d'un token.
 *
 * Ce DTO est utilisé pour modifier la limite maximale d'approvisionnement dans le contrat de token.
 *
 * @example
 * const setMaxSupply: SetMaxSupplyDto = {
 *   newMaxSupply: "1000000"
 * };
 */
export class SetMaxSupplyDto {
  @ApiProperty({ description: "Nouvelle limite maximale d'approvisionnement", example: "1000000" })
  @IsString()
  @IsNotEmpty()
  @Expose()
  newMaxSupply: string;
}
