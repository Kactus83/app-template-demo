import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente la signature d'un portefeuille Web3.
 *
 * Ce DTO est utilisé pour transmettre la signature associée à un portefeuille Ethereum.
 *
 * @example
 * const walletSignature: Web3WalletSignatureDto = {
 *   wallet: "0xAbc123...",
 *   signature: "signatureexemple"
 * };
 */
export class Web3WalletSignatureDto {
  @ApiProperty({ description: "Adresse du portefeuille Ethereum", example: "0xAbc123..." })
  @IsString()
  @Expose()
  wallet: string;

  @ApiProperty({ description: "Signature du portefeuille", example: "signatureexemple" })
  @IsString()
  @Expose()
  signature: string;
}
