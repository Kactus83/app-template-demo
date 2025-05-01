export class UserDto {
  id: number;
  email: string | null;
  isEmailVerified: boolean;
  secondaryEmail: string | null;
  isSecondaryEmailVerified: boolean;
  name: string | null;
  avatar: string | null;
  status: string | null;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}
