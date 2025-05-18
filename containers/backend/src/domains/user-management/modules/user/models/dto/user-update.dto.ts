import { IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Représente les données pour la mise à jour du profil d'un utilisateur.
 *
 * Ce DTO est utilisé lors de la modification du nom, de l'avatar ou du statut d'un utilisateur.
 *
 * @example
 * const updateData: UserUpdateDto = {
 *   name: "Jane Doe",
 *   avatar: "https://example.com/avatar.png",
 *   status: "online"
 * };
 */
export class UserUpdateDto {
  @ApiPropertyOptional({ description: "Nom de l'utilisateur", maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Expose()
  firstName?: string;

  @ApiPropertyOptional({ description: "Prénom de l'utilisateur", maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Expose()
  lastName?: string;

  @ApiPropertyOptional({ description: "URL de l'avatar de l'utilisateur" })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: "L'avatar doit être une URL valide" })
  @Expose()
  avatar?: string;

  @ApiPropertyOptional({ description: "Statut de l'utilisateur (en ligne, hors ligne, occupé, invisible)" })
  @IsOptional()
  @IsString()
  @Expose()
  status?: string;
}