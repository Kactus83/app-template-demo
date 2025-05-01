import { IsString, IsOptional, Matches, IsArray, ValidateNested } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Web3WalletSignatureDto } from '../../../web3/models/dto/web3-wallet-signature.dto';

/**
 * Représente les données de validation d'une demande MFA.
 *
 * Ce DTO est utilisé pour valider une demande MFA en fournissant divers codes ou signatures :
 * - Mot de passe (optionnel)
 * - Code envoyé par email (8 chiffres)
 * - Code envoyé par téléphone (8 chiffres)
 * - Code généré par l'application d'authentification (6 chiffres)
 * - Signatures web3 (pour la validation MFA web3)
 *
 * @example
 * const validationData: MFAValidationData = {
 *   password: "monmotdepasse",
 *   emailCode: "12345678",
 *   phoneCode: "87654321",
 *   authenticatorCode: "123456",
 *   web3Signatures: [/* objets Web3WalletSignatureDto * /]
 * };
 */
export class MFAValidationData {
  @ApiPropertyOptional({ description: "Mot de passe pour la validation MFA", example: "monmotdepasse" })
  @IsOptional()
  @IsString()
  @Expose()
  password?: string;

  @ApiPropertyOptional({ description: "Code envoyé par email (8 chiffres)", example: "12345678" })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: "Le code email doit être un nombre à 8 chiffres." })
  @Expose()
  emailCode?: string;

  @ApiPropertyOptional({ description: "Code envoyé par téléphone (8 chiffres)", example: "87654321" })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: "Le code téléphone doit être un nombre à 8 chiffres." })
  @Expose()
  phoneCode?: string;

  @ApiPropertyOptional({ description: "Code généré par l'application d'authentification (6 chiffres)", example: "123456" })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, { message: "Le code d'authentificateur doit être un nombre à 6 chiffres." })
  @Expose()
  authenticatorCode?: string;

  @ApiPropertyOptional({ description: "Signatures web3 pour la validation MFA", type: [Web3WalletSignatureDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Web3WalletSignatureDto)
  @Expose()
  web3Signatures?: Web3WalletSignatureDto[];
}
