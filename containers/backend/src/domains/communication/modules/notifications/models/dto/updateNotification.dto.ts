import { IsString, IsOptional, IsBoolean, IsUrl, IsDate } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Représente les données pour la mise à jour d'une notification existante.
 *
 * Ce DTO est utilisé pour modifier les détails d'une notification, tels que son titre,
 * description, liens multimédias, heure et indicateurs d'état.
 *
 * @example
 * const updateNotification: UpdateNotificationDto = {
 *   title: "Alerte mise à jour",
 *   read: true
 * };
 */
export class UpdateNotificationDto {
  @ApiPropertyOptional({ description: "Titre de la notification" })
  @IsOptional()
  @IsString()
  @Expose()
  title?: string;

  @ApiPropertyOptional({ description: "Description de la notification" })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @ApiPropertyOptional({ description: "URL de l'icône associée à la notification" })
  @IsOptional()
  @IsString()
  @Expose()
  icon?: string;

  @ApiPropertyOptional({ description: "URL de l'image associée à la notification" })
  @IsOptional()
  @IsString()
  @Expose()
  image?: string;

  @ApiPropertyOptional({ description: "Date et heure de la notification", type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose()
  time?: Date;

  @ApiPropertyOptional({ description: "Lien optionnel associé à la notification", format: 'uri' })
  @IsOptional()
  @IsUrl()
  @Expose()
  link?: string;

  @ApiPropertyOptional({ description: "Indique si le lien doit utiliser le router de l'application" })
  @IsOptional()
  @IsBoolean()
  @Expose()
  useRouter?: boolean;

  @ApiPropertyOptional({ description: "Indique si la notification a été lue" })
  @IsOptional()
  @IsBoolean()
  @Expose()
  read?: boolean;
}
