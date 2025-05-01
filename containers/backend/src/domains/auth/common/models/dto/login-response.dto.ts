import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../../../../core/models/dto/user.dto';

/**
 * Représente la réponse de connexion.
 *
 * Ce DTO contient les données de l'utilisateur authentifié ainsi que le JWT d'authentification.
 *
 * @example
 * const loginResponse: LoginResponseDto = {
 *   user: { id: 1, email: "user@example.com", ... },
 *   token: "jwt-token-exemple"
 * };
 */
export class LoginResponseDto {
  @ApiProperty({ description: "Données de l'utilisateur authentifié", type: UserDto })
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({ description: "JWT pour l'authentification", example: "jwt-token-exemple" })
  @Expose()
  token: string;
}
