import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données pour retirer des tokens vers le portefeuille de l'application.
 *
 * Ce DTO est utilisé pour spécifier la quantité de tokens à retirer.
 *
 * @example
 * const withdrawTokens: WithdrawTokensDto = {
 *   amount: "500"
 * };
 */
export class WithdrawTokensDto {
  @ApiProperty({ description: "Quantité de tokens à retirer", example: "500" })
  @IsString()
  @IsNotEmpty()
  @Expose()
  amount: string;
}
