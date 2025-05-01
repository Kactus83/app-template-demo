import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données pour définir le taux de vente dans le contrat de vente de token.
 *
 * Ce DTO est utilisé pour fixer le nouveau taux de vente (nombre de tokens par ETH).
 *
 * @example
 * const setRate: SetRateDto = {
 *   rate: "500"
 * };
 */
export class SetRateDto {
  @ApiProperty({ description: "Nouveau taux de vente (tokens par ETH)", example: "500" })
  @IsString()
  @IsNotEmpty()
  @Expose()
  rate: string;
}
