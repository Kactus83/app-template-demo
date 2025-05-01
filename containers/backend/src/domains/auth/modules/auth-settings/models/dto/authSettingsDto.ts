import { ApiProperty } from '@nestjs/swagger';
import { AuthMethodDto } from './authMethod.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type, Expose } from 'class-transformer';

/**
 * Représente les paramètres d'authentification d'un utilisateur.
 *
 * Ce DTO regroupe l'ensemble des méthodes d'authentification ainsi que leur ordre de priorité.
 *
 * @example
 * const authSettings: AuthSettingsDto = {
 *   authMethods: [
 *     { id: 1, method: AuthenticationMethod.EMAIL, methodId: null, order: 1 },
 *     { id: 2, method: AuthenticationMethod.AUTHENTICATOR, methodId: 1, order: 2 }
 *   ]
 * };
 */
export class AuthSettingsDto {
  @ApiProperty({
    type: [AuthMethodDto],
    description: "Liste des méthodes d'authentification avec leur ordre",
    example: [
      {
        id: 1,
        method: 'EMAIL',
        methodId: null,
        order: 1,
      },
      {
        id: 2,
        method: 'AUTHENTICATOR',
        methodId: 1,
        order: 2,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AuthMethodDto)
  @Expose()
  authMethods!: AuthMethodDto[];
}
