import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données pour retirer des ETH vers le portefeuille de l'application.
 *
 * Ce DTO est utilisé pour spécifier le montant d'ETH à retirer, exprimé en wei.
 *
 * @example
 * const withdrawETH: WithdrawETHDto = {
 *   amount: "1000000000000000000"
 * };
 */
export class WithdrawETHDto {
  @ApiProperty({ description: "Montant d'ETH à retirer (en wei)", example: "1000000000000000000" })
  @IsString()
  @IsNotEmpty()
  @Expose()
  amount: string;
}
