import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ description: 'Biographie de l’utilisateur', required: false })
  bio?: string;

  @ApiProperty({ description: 'URL Twitter', required: false })
  twitterUrl?: string;

  @ApiProperty({ description: 'URL LinkedIn', required: false })
  linkedInUrl?: string;

  @ApiProperty({ description: 'URL Facebook', required: false })
  facebookUrl?: string;

  @ApiProperty({ description: 'URL de la bannière', required: false })
  bannerUrl?: string;

  constructor(partial: Partial<UserProfileDto>) {
    Object.assign(this, partial);
  }
}
