import { ApiProperty } from '@nestjs/swagger';

export class UserPreferencesDto {
  @ApiProperty({ description: 'Locale de l’utilisateur' })
  locale!: string;

  @ApiProperty({ description: 'Fuseau horaire' })
  timezone!: string;

  @ApiProperty({ description: 'Thème de l’interface' })
  theme!: string;

  constructor(partial: Partial<UserPreferencesDto>) {
    Object.assign(this, partial);
  }
}
