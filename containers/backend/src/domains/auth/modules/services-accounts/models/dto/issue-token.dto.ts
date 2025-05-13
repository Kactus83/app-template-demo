import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO pour la demande de token via client_credentials.
 */
export class IssueTokenDto {
  @ApiProperty({ description: 'Client ID public', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  readonly clientId!: string;

  @ApiProperty({ description: 'Secret du client', example: 's3cr3Tk3y!' })
  @IsNotEmpty()
  @IsString()
  readonly clientSecret!: string;
}