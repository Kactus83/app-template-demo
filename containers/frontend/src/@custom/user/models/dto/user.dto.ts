/**
 * Données de l’utilisateur principal
 */
export interface UserDto {
  id: number;
  email: string | null;
  username: string | null;
  isEmailVerified: boolean;
  secondaryEmail: string | null;
  isSecondaryEmailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  status: string | null;
  roles: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

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
