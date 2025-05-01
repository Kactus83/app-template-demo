import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

/**
 * Représente un compte OAuth.
 *
 * Ce DTO contient les informations relatives à un compte OAuth,
 * telles que l'identifiant, le fournisseur, l'identifiant fourni par le fournisseur,
 * l'email associé ainsi que les tokens et les dates de création/mise à jour.
 *
 * @example
 * const oauthAccount: OAuthAccountDto = {
 *   id: 1,
 *   provider: "google",
 *   providerId: "123456789",
 *   email: "user@example.com",
 *   accessToken: "accesstokenexemple",
 *   refreshToken: null,
 *   createdAt: new Date("2023-01-01T12:00:00Z"),
 *   updatedAt: new Date("2023-06-01T12:00:00Z")
 * };
 */
export class OAuthAccountDto {
  @ApiProperty({ description: "Identifiant unique du compte OAuth", example: 1 })
  @IsNumber()
  @Expose()
  id: number;

  @ApiProperty({ description: "Nom du fournisseur OAuth (ex: google, github, facebook)", example: "google" })
  @IsString()
  @Expose()
  provider: string;

  @ApiProperty({ description: "Identifiant unique fourni par le fournisseur OAuth", example: "123456789" })
  @IsString()
  @Expose()
  providerId: string;

  @ApiProperty({ description: "Adresse email associée au compte OAuth", example: "user@example.com" })
  @IsString()
  @Expose()
  email: string;

  @ApiProperty({ description: "Token d'accès OAuth", example: "accesstokenexemple", nullable: true })
  @Expose()
  accessToken: string | null;

  @ApiProperty({ description: "Token de rafraîchissement OAuth (optionnel)", example: null, nullable: true })
  @Expose()
  refreshToken: string | null;

  @ApiProperty({ description: "Date de création du compte OAuth", type: String, format: 'date-time', example: "2023-01-01T12:00:00Z" })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: "Dernière mise à jour du compte OAuth", type: String, format: 'date-time', example: "2023-06-01T12:00:00Z" })
  @Expose()
  updatedAt: Date;
}
