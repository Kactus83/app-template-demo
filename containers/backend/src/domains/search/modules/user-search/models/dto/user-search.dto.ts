import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsEmail, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Représente un résultat de recherche utilisateur simplifié.
 *
 * Ce DTO est utilisé pour retourner des informations de base sur l'utilisateur lors des opérations de recherche.
 *
 * @example
 * const resultatRechercheUtilisateur: UserSearchDto = new UserSearchDto({
 *   id: 1,
 *   name: "John Doe",
 *   email: "john.doe@example.com",
 *   avatar: "https://example.com/avatar.jpg"
 * });
 */
export class UserSearchDto {
  @ApiProperty({ description: "Identifiant unique de l'utilisateur", example: 1 })
  @IsInt()
  @Expose()
  id: number;

  @ApiPropertyOptional({ description: "Nom de l'utilisateur", example: "John Doe" })
  @IsOptional()
  @IsString()
  @Expose()
  name: string | null;

  @ApiPropertyOptional({ description: "Email de l'utilisateur", format: 'email', example: "john.doe@example.com" })
  @IsOptional()
  @IsEmail()
  @Expose()
  email: string | null;

  @ApiPropertyOptional({ description: "URL de l'avatar de l'utilisateur", example: "https://example.com/avatar.jpg" })
  @IsOptional()
  @IsString()
  @Expose()
  avatar: string | null;
}
