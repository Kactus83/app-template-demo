import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente les données nécessaires pour supprimer un vault.
 *
 * Ce DTO est utilisé pour supprimer un vault en fournissant son nom.
 *
 * @example
 * const deleteVault: DeleteVaultDto = {
 *   name: "NomDuVault"
 * };
 */
export class DeleteVaultDto {
  @ApiProperty({ description: "Nom du vault à supprimer", example: "NomDuVault" })
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;
}
