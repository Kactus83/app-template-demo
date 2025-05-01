import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

/**
 * Représente un compte Web3 associé à un utilisateur.
 *
 * Ce DTO contient les informations d'un compte Web3, notamment son identifiant, l'adresse du portefeuille Ethereum
 * et la date de création du compte.
 *
 * @example
 * const web3Account: Web3AccountDto = {
 *   id: 1,
 *   wallet: "0xAbc123...",
 *   createdAt: new Date("2023-01-01T12:00:00Z")
 * };
 */
export class Web3AccountDto {
  @ApiProperty({ description: "Identifiant unique du compte Web3", example: 1 })
  @IsNumber()
  @Expose()
  id: number;

  @ApiProperty({ description: "Adresse du portefeuille Ethereum", example: "0xAbc123..." })
  @IsString()
  @Expose()
  wallet: string;

  @ApiProperty({
    description: "Date de création du compte Web3",
    type: String,
    format: 'date-time',
    example: "2023-01-01T12:00:00Z"
  })
  @Expose()
  createdAt: Date;
}
