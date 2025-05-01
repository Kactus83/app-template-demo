import { IsString, IsOptional, IsBoolean, IsUrl, IsDate } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Représente les données pour mettre à jour un message existant.
 *
 * Ce DTO permet de modifier un message existant en actualisant le titre, la description,
 * l'icône, l'image, l'heure, le lien et les indicateurs d'état.
 *
 * @example
 * const miseAJourMessage: UpdateMessageDto = {
 *   title: "Titre mis à jour",
 *   read: true
 * };
 */
export class UpdateMessageDto {
  @ApiPropertyOptional({ description: "Titre du message", example: "Titre mis à jour" })
  @IsOptional()
  @IsString()
  @Expose()
  title?: string;

  @ApiPropertyOptional({ description: "Contenu du message", example: "Contenu mis à jour du message." })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @ApiPropertyOptional({ description: "URL de l'icône associée au message", example: "https://exemple.com/icon.png" })
  @IsOptional()
  @IsString()
  @Expose()
  icon?: string;

  @ApiPropertyOptional({ description: "URL de l'image associée au message", example: "https://exemple.com/image.png" })
  @IsOptional()
  @IsString()
  @Expose()
  image?: string;

  @ApiPropertyOptional({ description: "Date et heure du message", type: String, format: 'date-time', example: "2022-08-01T10:00:00Z" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose()
  time?: Date;

  @ApiPropertyOptional({ description: "Lien optionnel associé au message", format: 'uri', example: "https://exemple.com" })
  @IsOptional()
  @IsUrl()
  @Expose()
  link?: string;

  @ApiPropertyOptional({ description: "Indique si le routeur doit être utilisé", example: true })
  @IsOptional()
  @IsBoolean()
  @Expose()
  useRouter?: boolean;

  @ApiPropertyOptional({ description: "Indique si le message a été lu", example: false })
  @IsOptional()
  @IsBoolean()
  @Expose()
  read?: boolean;
}
