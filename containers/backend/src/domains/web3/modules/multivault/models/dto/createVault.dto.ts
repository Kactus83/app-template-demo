import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données nécessaires pour créer un vault.
 *
 * Ce DTO est utilisé pour créer un vault dans le contrat de vault.
 *
 * @example
 * const createVault: CreateVaultDto = {
 *   name: "NomDuVault",
 *   acceptsETH: true,
 *   acceptsToken: false
 * };
 */
export class CreateVaultDto {
  @ApiProperty({ description: "Nom du vault", example: "NomDuVault" })
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty({ description: "Indique si le vault accepte l'ETH", example: true })
  @IsBoolean()
  @Expose()
  acceptsETH: boolean;

  @ApiProperty({ description: "Indique si le vault accepte les tokens", example: false })
  @IsBoolean()
  @Expose()
  acceptsToken: boolean;
}
