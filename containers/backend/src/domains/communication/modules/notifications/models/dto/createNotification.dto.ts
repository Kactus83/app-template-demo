import { IsString, IsOptional, IsBoolean, IsUrl, IsDate } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Représente les données nécessaires pour créer une nouvelle notification.
 *
 * Ce DTO est utilisé lors de l'ajout d'une nouvelle notification avec un titre et une heure obligatoires,
 * et des détails optionnels tels que la description, l'icône, l'image, le lien et les indicateurs d'état.
 *
 * @example
 * const newNotification: CreateNotificationDto = {
 *   title: "Nouveau message",
 *   time: new Date("2022-07-15T10:00:00Z"),
 *   description: "Vous avez reçu un nouveau message.",
 *   link: "https://example.com/messages"
 * };
 */
export class CreateNotificationDto {
  @ApiProperty({ description: "Titre de la notification" })
  @IsString()
  @Expose()
  title!: string;

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

  @ApiProperty({ description: "Date et heure de la notification", type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
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

  @ApiPropertyOptional({ description: "Indique si la notification a été lue" })
  @IsOptional()
  @IsBoolean()
  @Expose()
  read?: boolean;
}
