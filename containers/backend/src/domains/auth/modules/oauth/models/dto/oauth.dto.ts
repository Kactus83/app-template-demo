import { IsString, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Représente les informations de connexion OAuth.
 *
 * Ce DTO est utilisé pour connecter un utilisateur via un fournisseur OAuth,
 * en fournissant le nom du fournisseur, le token d'accès et éventuellement le token de rafraîchissement.
 *
 * @example
 * const oauthLogin: OAuthLoginDto = {
 *   provider: "google",
 *   accessToken: "accesstokenexemple",
 *   refreshToken: "optionalrefreshtoken"
 * };
 */
export class OAuthLoginDto {
  @ApiProperty({ description: "Nom du fournisseur OAuth (ex: google, github, facebook)", example: "google" })
  @IsString()
  @Expose()
  provider: string;

  @ApiProperty({ description: "Token d'accès OAuth", example: "accesstokenexemple" })
  @IsString()
  @Expose()
  accessToken: string;

  @ApiPropertyOptional({ description: "Token de rafraîchissement OAuth (optionnel)", example: "optionalrefreshtoken" })
  @IsOptional()
  @IsString()
  @Expose()
  refreshToken?: string;
}
