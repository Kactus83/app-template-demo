import { IsOptional, IsArray, IsEnum, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { AuthenticationMethod } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


/**
 * Représente la réponse MFA pour une connexion web3.
 *
 * Ce DTO contient les informations du portefeuille web3 et le nonce associé.
 *
 * @example
 * const web3Response: Web3MFARequestResponseDto = {
 *   web3Wallet: "0xABC123",
 *   web3Nonce: "nonce123"
 * };
 */
export class Web3MFARequestResponseDto {
    @ApiProperty({ description: "Adresse du portefeuille web3", example: "0xABC123" })
    @IsString()
    @Expose()
    web3Wallet: string;
  
    @ApiProperty({ description: "Nonce associé pour la vérification MFA web3", example: "nonce123" })
    @IsString()
    @Expose()
    web3Nonce: string;
}

/**
 * Représente la réponse partielle pour une demande MFA spécifique aux portefeuilles web3.
 *
 * Ce DTO permet de transmettre une liste de réponses MFA propres aux portefeuilles web3.
 *
 * @example
 * const partialResponse: PartialMFARequestResponseDto = {
 *   web3MFARequestResponse: [
 *     { web3Wallet: "0xABC123", web3Nonce: "nonce123" }
 *   ]
 * };
 */
export class PartialMFARequestResponseDto {
  @ApiPropertyOptional({
    description: "Réponses MFA spécifiques aux portefeuilles web3",
    type: [Web3MFARequestResponseDto],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Web3MFARequestResponseDto)
  @Expose()
  web3MFARequestResponse?: Web3MFARequestResponseDto[];
}

/**
 * Représente la réponse d'une demande MFA.
 *
 * Ce DTO fournit la liste des méthodes d'authentification disponibles ainsi que, le cas échéant,
 * les informations spécifiques pour une demande MFA via web3.
 *
 * @example
 * const mfaResponse: MFARequestResponseDto = {
 *   authMethods: ["EMAIL", "AUTHENTICATOR"],
 *   web3MFARequestResponse: [
 *     { web3Wallet: "0xABC123", web3Nonce: "nonce123" }
 *   ]
 * };
 */
export class MFARequestResponseDto {
  @ApiProperty({
    description: "Liste des méthodes d'authentification disponibles",
    isArray: true,
    enum: AuthenticationMethod,
    example: ["EMAIL", "AUTHENTICATOR"],
  })
  @IsArray()
  @IsEnum(AuthenticationMethod, { each: true })
  @Expose()
  authMethods: AuthenticationMethod[];

  @ApiPropertyOptional({
    description: "Réponses spécifiques pour une demande MFA via web3",
    type: [Web3MFARequestResponseDto],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Web3MFARequestResponseDto)
  @Expose()
  web3MFARequestResponse?: Web3MFARequestResponseDto[];
}
