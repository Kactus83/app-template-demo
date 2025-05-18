import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

import {
  UserDto,
  UpdateUserDto,
  UserPreferencesDto,
  UpdateUserPreferencesDto,
  UserProfileDto,
  UpdateUserProfileDto,
} from '@custom/user/models/dto/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly _base = `${environment.apiUrl}/user-management/user`;

  /**
   * GET /user-management/user
   */
  getCurrentUser(): Observable<UserDto> {
    return this._http.get<UserDto>(this._base);
  }

  /**
   * PATCH /user-management/user
   */
  updateUser(dto: UpdateUserDto): Observable<UserDto> {
    return this._http.patch<UserDto>(this._base, dto);
  }

  /**
   * PATCH /user-management/user/avatar
   * @param file Fichier image choisi par l'utilisateur
   */
  updateAvatar(file: File): Observable<UserDto> {
    const form = new FormData();
    form.append('avatar', file);
    return this._http.patch<UserDto>(`${this._base}/avatar`, form);
  }

  /**
   * GET /user-management/user/preferences
   */
  getPreferences(): Observable<UserPreferencesDto> {
    return this._http.get<UserPreferencesDto>(`${this._base}/preferences`);
  }

  /**
   * PATCH /user-management/user/preferences
   */
  updatePreferences(dto: UpdateUserPreferencesDto): Observable<UserPreferencesDto> {
    return this._http.patch<UserPreferencesDto>(`${this._base}/preferences`, dto);
  }

  /**
   * GET /user-management/user/profile
   */
  getProfile(): Observable<UserProfileDto> {
    return this._http.get<UserProfileDto>(`${this._base}/profile`);
  }

  /**
   * PATCH /user-management/user/profile
   */
  updateProfile(dto: UpdateUserProfileDto): Observable<UserProfileDto> {
    return this._http.patch<UserProfileDto>(`${this._base}/profile`, dto);
  }
}
