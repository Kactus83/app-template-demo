import { IsOptional, IsString, IsIn, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Represents an item within the navigation structure.
 *
 * This DTO defines the properties of a navigation item including its display text,
 * behavior settings, and potential child items.
 *
 * @example
 * const navItem: NavigationItemDto = {
 *   id: "item1",
 *   title: "Dashboard",
 *   type: "basic",
 *   active: true,
 *   children: []
 * };
 */
export class NavigationItemDto {
  @ApiPropertyOptional({ description: "Identifiant unique de l'élément de navigation." })
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @ApiPropertyOptional({ description: "Titre de l'élément de navigation." })
  @IsOptional()
  @IsString()
  @Expose()
  title?: string;

  @ApiPropertyOptional({ description: "Sous-titre de l'élément de navigation." })
  @IsOptional()
  @IsString()
  @Expose()
  subtitle?: string;

  @ApiProperty({ 
    enum: ['aside', 'basic', 'collapsable', 'divider', 'group', 'spacer'],
    description: "Le type de l'élément de navigation.",
  })
  @IsIn(['aside', 'basic', 'collapsable', 'divider', 'group', 'spacer'])
  @Expose()
  type!: 'aside' | 'basic' | 'collapsable' | 'divider' | 'group' | 'spacer';

  @ApiPropertyOptional({ description: "Indique si l'élément est caché." })
  @IsOptional()
  @IsBoolean()
  @Expose()
  hidden?: boolean;

  @ApiPropertyOptional({ description: "Indique si l'élément est actif." })
  @IsOptional()
  @IsBoolean()
  @Expose()
  active?: boolean;

  @ApiPropertyOptional({ description: "Indique si l'élément est désactivé." })
  @IsOptional()
  @IsBoolean()
  @Expose()
  disabled?: boolean;

  @ApiPropertyOptional({ description: "Texte du tooltip." })
  @IsOptional()
  @IsString()
  @Expose()
  tooltip?: string;

  @ApiPropertyOptional({ description: "Lien associé à l'élément." })
  @IsOptional()
  @IsString()
  @Expose()
  link?: string;

  @ApiPropertyOptional({ description: "Fragment de navigation." })
  @IsOptional()
  @IsString()
  @Expose()
  fragment?: string;

  @ApiPropertyOptional({ description: "Indique si le fragment doit être conservé." })
  @IsOptional()
  @IsBoolean()
  @Expose()
  preserveFragment?: boolean;

  @ApiPropertyOptional({ description: "Indique si le lien est externe." })
  @IsOptional()
  @IsBoolean()
  @Expose()
  externalLink?: boolean;

  @ApiPropertyOptional({ description: "La cible du lien.", enum: ['_blank', '_self', '_parent', '_top'] })
  @IsOptional()
  @IsString()
  @Expose()
  target?: '_blank' | '_self' | '_parent' | '_top' | string;

  @ApiPropertyOptional({ description: "Indique si le lien doit être une correspondance exacte." })
  @IsOptional()
  @IsBoolean()
  @Expose()
  exactMatch?: boolean;

  @ApiPropertyOptional({ description: "Options pour le matching actif." })
  @IsOptional()
  @IsString()
  @Expose()
  isActiveMatchOptions?: string;

  @ApiPropertyOptional({ description: "Classes CSS pour personnaliser l'affichage." })
  @IsOptional()
  @Expose()
  classes?: {
    title?: string;
    subtitle?: string;
    icon?: string;
    wrapper?: string;
  };

  @ApiPropertyOptional({ description: "Icône de l'élément." })
  @IsOptional()
  @IsString()
  @Expose()
  icon?: string;

  @ApiPropertyOptional({ description: "Badge associé à l'élément.", type: Object })
  @IsOptional()
  @Expose()
  badge?: {
    title?: string;
    classes?: string;
  };

  @ApiPropertyOptional({
    description: "Sous-éléments de navigation.",
    type: [NavigationItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavigationItemDto)
  @Expose()
  children?: NavigationItemDto[];

  @ApiPropertyOptional({ description: "Informations additionnelles.", type: Object })
  @IsOptional()
  @Expose()
  meta?: any;
}
