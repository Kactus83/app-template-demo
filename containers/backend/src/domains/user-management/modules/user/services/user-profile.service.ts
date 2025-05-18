import { Injectable } from '@nestjs/common';
import { UserProfileRepository } from '../repositories/user-profile.repository';
import { UserProfileDto } from '../repositories/user-profile.dto';
import { UpdateUserProfileDto } from '../repositories/update-user-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(private readonly repo: UserProfileRepository) {}

  async getProfile(userId: number): Promise<UserProfileDto> {
    const profile = await this.repo.findByUserId(userId);
    return new UserProfileDto(profile ?? {});
  }

  async updateProfile(
    userId: number,
    dto: UpdateUserProfileDto,
  ): Promise<UserProfileDto> {
    const updated = await this.repo.upsert(userId, dto);
    return new UserProfileDto(updated);
  }
}
