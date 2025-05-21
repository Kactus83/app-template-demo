/**
 * Payload pour PATCH /users/me
 */
export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  avatar?: string; // URL
  status?: string;
}

/**
 * DTO renvoyé par GET /users/me/preferences
 */
export interface UserPreferencesDto {
  locale: string;              // ex. "fr"
  timezone: string;            // ex. "Europe/Paris"
  theme: 'light' | 'dark';
}

/**
 * Payload pour PATCH /users/me/preferences
 */
export interface UpdateUserPreferencesDto {
  locale?: string;
  timezone?: string;
  theme?: 'light' | 'dark';
}

/**
 * DTO renvoyé par GET /users/me/profile
 */
export interface UserProfileDto {
  bio?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
  facebookUrl?: string;
  bannerUrl?: string;
}

/**
 * Payload pour PATCH /users/me/profile
 */
export interface UpdateUserProfileDto {
  bio?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
  facebookUrl?: string;
  bannerUrl?: string;
}
