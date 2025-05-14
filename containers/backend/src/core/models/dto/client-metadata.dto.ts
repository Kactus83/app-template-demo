import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsString, IsEnum } from 'class-validator';

/**
 * Enum pour le type d’appareil.
 */
export enum DeviceType {
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  MOBILE = 'mobile',
}

/**
 * Données de métadonnées du client (navigateur et appareil).
 *
 * @category Core
 * @subcategory DTOs
 */
export class ClientMetadataDto {
  @ApiProperty({
    description: 'Horodatage de l’appel (ISO 8601)',
    example: '2025-05-14T12:34:56.789Z',
  })
  @IsISO8601()
  timestamp!: string;

  @ApiProperty({
    description: 'Langue + région du navigateur',
    example: 'en-US',
  })
  @IsString()
  locale!: string;

  @ApiProperty({
    description: 'Fuseau horaire client',
    example: 'Europe/Paris',
  })
  @IsString()
  timeZone!: string;

  @ApiProperty({
    description: 'Chaîne User-Agent complète',
  })
  @IsString()
  userAgent!: string;

  @ApiProperty({
    description: 'Nom du navigateur',
    example: 'Chrome',
  })
  @IsString()
  browserName!: string;

  @ApiProperty({
    description: 'Version du navigateur',
    example: '113.0.5672.127',
  })
  @IsString()
  browserVersion!: string;

  @ApiProperty({
    description: "Nom du système d’exploitation",
    example: 'Windows',
  })
  @IsString()
  osName!: string;

  @ApiProperty({
    description: "Version du système d’exploitation",
    example: '10.0',
  })
  @IsString()
  osVersion!: string;

  @ApiProperty({
    description: 'Type d’appareil',
    example: DeviceType.DESKTOP,
    enum: DeviceType,
  })
  @IsEnum(DeviceType)
  deviceType!: DeviceType;

  @ApiProperty({
    description: 'Résolution écran (largeur x hauteur)',
    example: '1920x1080',
  })
  @IsString()
  screenResolution!: string;
}
