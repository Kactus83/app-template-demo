import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsInt, IsArray, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Represents the payload of a JSON Web Token (JWT).
 *
 * This DTO is used to encapsulate the user identification data that is embedded in a JWT.
 * @category Core
 * @category DTOs
 *
 * @example
 * const jwtPayload: JwtPayloadDto = {
 *   userId: 123,
 *   roles: [UserRole.ADMIN, UserRole.USER],
 * };
 */
export class JwtPayloadDto {
  @ApiProperty({
    description: "Unique identifier of the user",
    example: 123,
  })
  @IsInt()
  @Expose()
  userId!: number;

  @ApiProperty({
    description: "Roles assigned to the user",
    example: [UserRole.ADMIN, UserRole.USER],
    isArray: true,
    enum: UserRole,
  })
  @IsArray()
  @IsEnum(UserRole, { each: true })
  @Expose()
  roles!: UserRole[];
}
