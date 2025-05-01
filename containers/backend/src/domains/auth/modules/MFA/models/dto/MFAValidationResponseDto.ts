import { IsArray, IsEnum, IsString } from 'class-validator';
import { AuthenticationMethod } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente la réponse de validation d'une demande MFA.
 *
 * Ce DTO est utilisé pour renvoyer la liste des méthodes d'authentification validées ainsi qu'un token.
 *
 * @example
 * const validationResponse: MFAValidationResponseDto = {
 *   authMethods: ["EMAIL", "AUTHENTICATOR"],
 *   token: "token123abc"
 * };
 */
export class MFAValidationResponseDto {
  @ApiProperty({
    description: "Liste des méthodes d'authentification validées",
    isArray: true,
    enum: AuthenticationMethod,
    example: ["EMAIL", "AUTHENTICATOR"],
  })
  @IsArray()
  @IsEnum(AuthenticationMethod, { each: true })
  @Expose()
  authMethods: AuthenticationMethod[];

  @ApiProperty({ description: "Token de validation MFA", example: "token123abc" })
  @IsString()
  @Expose()
  token: string;
}
