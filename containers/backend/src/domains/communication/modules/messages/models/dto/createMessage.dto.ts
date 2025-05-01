import { IsString, IsOptional, IsBoolean, IsUrl, IsDate } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Représente les données nécessaires pour créer un message.
 *
 * Ce DTO est utilisé pour ajouter un nouveau message, en précisant le titre, la description et l'heure,
 * ainsi que des informations optionnelles telles que l'icône, l'image, le lien et les indicateurs d'état.
 *
 * @example
 * const nouveauMessage: CreateMessageDto = {
 *   title: "Nouveau Message",
 *   description: "Contenu du message.",
 *   time: new Date("2022-08-01T10:00:00Z"),
 *   icon: "https://exemple.com/icon.png",
 *   image: "https://exemple.com/image.png",
 *   link: "https://exemple.com",
 *   useRouter: true,
 *   read: false
 * };
 */
export class CreateMessageDto {
  @ApiProperty({ description: "Titre du message", example: "Nouveau Message" })
  @IsString()
  @Expose()
  title: string;

  @ApiProperty({ description: "Contenu du message", example: "Contenu du message." })
  @IsString()
  @Expose()
  description: string;

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

  @ApiProperty({ description: "Date et heure du message", type: String, format: 'date-time', example: "2022-08-01T10:00:00Z" })
  @IsDate()
  @Type(() => Date)
  @Expose()
  time: Date;

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
