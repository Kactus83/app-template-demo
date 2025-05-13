import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO pour la demande de token via client_credentials.
 */
export class IssueTokenResponseDto {
  @ApiProperty({ description: 'Token pour le service', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  readonly token!: string;
}