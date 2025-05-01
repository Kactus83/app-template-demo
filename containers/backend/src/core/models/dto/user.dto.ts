import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsEmail, IsBoolean, IsString, IsOptional, IsArray, IsDate } from 'class-validator';
import { UserRole } from '@prisma/client';

/**
 * Represents a user.
 *
 * This DTO defines the structure for user data including contact details,
 * verification flags, profile information, and associated roles.
 * @category Core
 * @category DTOs
 *
 * @example
 * const user: UserDto = {
 *   id: 1,
 *   email: "user@example.com",
 *   isEmailVerified: true,
 *   secondaryEmail: null,
 *   isSecondaryEmailVerified: false,
 *   name: "John Doe",
 *   avatar: "https://example.com/avatar.jpg",
 *   status: "online",
 *   roles: [UserRole.ADMIN, UserRole.USER],
 *   createdAt: new Date("2022-01-01T12:00:00Z"),
 *   updatedAt: new Date("2022-06-01T15:30:00Z")
 * };
 */
export class UserDto {
  @ApiProperty({ description: "Unique identifier of the user", example: 1 })
  @IsInt()
  @Expose()
  id!: number;

  @ApiPropertyOptional({
    description: "Primary email address of the user",
    format: 'email',
    example: "user@example.com",
  })
  @IsOptional()
  @IsEmail()
  @Expose()
  email!: string | null;

  @ApiProperty({ description: "Indicates whether the primary email is verified", example: true })
  @IsBoolean()
  @Expose()
  isEmailVerified!: boolean;

  @ApiPropertyOptional({
    description: "Secondary email address of the user",
    format: 'email',
    example: "user.secondary@example.com",
  })
  @IsOptional()
  @IsEmail()
  @Expose()
  secondaryEmail!: string | null;

  @ApiProperty({ description: "Indicates whether the secondary email is verified", example: false })
  @IsBoolean()
  @Expose()
  isSecondaryEmailVerified!: boolean;

  @ApiPropertyOptional({ description: "Name of the user", example: "John Doe" })
  @IsOptional()
  @IsString()
  @Expose()
  name!: string | null;

  @ApiPropertyOptional({
    description: "URL of the user's avatar",
    example: "https://example.com/avatar.jpg",
  })
  @IsOptional()
  @IsString()
  @Expose()
  avatar!: string | null;

  @ApiPropertyOptional({ description: "Status of the user (e.g., online, offline)", example: "online" })
  @IsOptional()
  @IsString()
  @Expose()
  status!: string | null;

  @ApiProperty({
    description: "Roles associated with the user",
    example: [UserRole.ADMIN, UserRole.USER],
    isArray: true,
    enum: UserRole,
  })
  @IsArray()
  @Expose()
  roles!: UserRole[];

  @ApiProperty({
    description: "Creation date of the user",
    example: "2022-01-01T12:00:00Z",
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Expose()
  createdAt!: Date;

  @ApiProperty({
    description: "Last update date of the user",
    example: "2022-06-01T15:30:00Z",
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Expose()
  updatedAt!: Date;
}
