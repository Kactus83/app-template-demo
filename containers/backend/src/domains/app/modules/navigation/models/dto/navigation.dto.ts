import { IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { NavigationType } from '@prisma/client';
import { NavigationItemDto } from './navigationItem.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents the navigation configuration.
 *
 * This DTO encapsulates different navigation layouts (compact, default, futuristic, horizontal)
 * for a specific navigation type (e.g., USER or ADMIN).
 *
 * @example
 * const navigation: NavigationDto = {
 *   type: NavigationType.USER,
 *   compact: [/* NavigationItemDto items * /],
 *   default: [/* NavigationItemDto items * /],
 *   futuristic: [/* NavigationItemDto items * /],
 *   horizontal: [/* NavigationItemDto items * /],
 * };
 */
export class NavigationDto {
  @ApiProperty({
    enum: NavigationType,
    description: 'Le type de navigation (USER ou ADMIN)',
  })
  @IsEnum(NavigationType)
  @Expose()
  type!: NavigationType;

  @ApiProperty({
    type: [NavigationItemDto],
    description: "Les éléments de navigation pour le layout 'compact'",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavigationItemDto)
  @Expose()
  compact!: NavigationItemDto[];

  @ApiProperty({
    type: [NavigationItemDto],
    description: "Les éléments de navigation pour le layout 'default'",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavigationItemDto)
  @Expose()
  default!: NavigationItemDto[];

  @ApiProperty({
    type: [NavigationItemDto],
    description: "Les éléments de navigation pour le layout 'futuristic'",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavigationItemDto)
  @Expose()
  futuristic!: NavigationItemDto[];

  @ApiProperty({
    type: [NavigationItemDto],
    description: "Les éléments de navigation pour le layout 'horizontal'",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavigationItemDto)
  @Expose()
  horizontal!: NavigationItemDto[];
}
