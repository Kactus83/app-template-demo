import { Injectable } from '@nestjs/common';
import { UserPreferencesRepository } from '../repositories/user-preferences.repository';
import { UpdateUserPreferencesDto } from '../models/dto/update-user-preferences.dto';
import { UserPreferencesDto } from '../models/dto/user-preferences.dto';

@Injectable()
export class UserPreferencesService {
  constructor(private readonly repo: UserPreferencesRepository) {}

  async getPreferences(userId: number): Promise<UserPreferencesDto> {
    const prefs = await this.repo.findByUserId(userId);
    // valeurs par défaut si jamais null
    const data = prefs ?? { locale: 'en', timezone: 'UTC', theme: 'light' };
    return new UserPreferencesDto(data);
  }

  async updatePreferences(
    userId: number,
    dto: UpdateUserPreferencesDto,
  ): Promise<UserPreferencesDto> {
    const updated = await this.repo.upsert(userId, dto);
    return new UserPreferencesDto(updated);
  }
}
