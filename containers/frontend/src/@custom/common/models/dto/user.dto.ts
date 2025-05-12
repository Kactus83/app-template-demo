export class UserDto {
  /** Identifiant unique */
  id!: number;

  /** Email principal (peut être null) */
  email!: string | null;

  /** Nom d’utilisateur (peut être null) */
  username!: string | null;

  /** Email principal vérifié ? */
  isEmailVerified!: boolean;

  /** Email secondaire (peut être null) */
  secondaryEmail!: string | null;

  /** Email secondaire vérifié ? */
  isSecondaryEmailVerified!: boolean;

  /** Prénom (peut être null) */
  firstName!: string | null;

  /** Nom de famille (peut être null) */
  lastName!: string | null;

  /** URL de l’avatar (peut être null) */
  avatar!: string | null;

  /** Statut (online/offline…) (peut être null) */
  status!: string | null;

  /** Rôles */
  roles!: string[];

  /** Date de création */
  createdAt!: Date;

  /** Date de dernière mise à jour */
  updatedAt!: Date;
}
