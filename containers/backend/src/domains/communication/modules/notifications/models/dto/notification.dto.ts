import { IsInt, IsString, IsOptional, IsBoolean, IsUrl, IsDate } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Représente une notification telle qu'elle est stockée ou renvoyée par le système.
 *
 * Ce DTO est utilisé pour présenter les détails de la notification, y compris son identifiant,
 * son contenu, les liens multimédias, l'heure et les indicateurs d'état.
 *
 * @example
 * const notification: NotificationDto = {
 *   id: 42,
 *   title: "Alerte Système",
 *   description: "Votre session va bientôt expirer.",
 *   time: new Date("2022-07-15T10:00:00Z"),
 *   useRouter: false,
 *   read: false
 * };
 */
export class NotificationDto {
  @ApiProperty({ description: "Identifiant unique de la notification", example: 42 })
  @IsInt()
  @Expose()
  id!: number;

  @ApiProperty({ description: "Titre de la notification", example: "System Alert" })
  @IsString()
  @Expose()
  title!: string;

  @ApiPropertyOptional({ description: "Description de la notification", example: "Your session will expire soon." })
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

  @ApiProperty({ description: "Date et heure de la notification", type: String, format: 'date-time' })
  @IsDate()
  @Expose()
  time!: Date;

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

  @ApiProperty({ description: "Indique si la notification a été lue", example: false })
  @IsBoolean()
  @Expose()
  read!: boolean;
}
