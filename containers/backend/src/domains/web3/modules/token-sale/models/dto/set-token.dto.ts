import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données pour définir l'adresse du token dans le contrat de vente.
 *
 * Ce DTO est utilisé pour fixer l'adresse du contrat Token qui sera vendu.
 *
 * @example
 * const setToken: SetTokenDto = {
 *   token: "0xABC123..."
 * };
 */
export class SetTokenDto {
  @ApiProperty({ description: "Adresse du contrat TokenContract", example: "0xABC123..." })
  @IsString()
  @IsNotEmpty()
  @Expose()
  token: string;
}
