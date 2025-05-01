import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Représente les données d'un authenticator en base de donnée.
 *
 * Ce DTO est utilisé pour configurer un authenticator, en précisant le secret, l'état d'activation et l'URL du QR code.
 *
 * @example
 * const authenticator: AuthenticatorDto = {
 *   secret: "ABC123DEF456",
 *   enabled: true,
 *   qrCodeURL: "https://exemple.com/qrcode.png"
 * };
 */
export class AuthenticatorDto {
  @ApiProperty({ description: "Secret de l'authenticator", example: "ABC123DEF456" })
  @IsString()
  @Expose()
  secret: string;

  @ApiPropertyOptional({ description: "Indique si l'authenticator est activé", example: true })
  @IsOptional()
  @IsBoolean()
  @Expose()
  enabled?: boolean;

  @ApiProperty({ description: "URL du QR Code associé à l'authenticator", example: "https://exemple.com/qrcode.png" })
  @IsString()
  @Expose()
  qrCodeURL: string;
}
