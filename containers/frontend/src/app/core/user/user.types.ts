import { UserDto } from '@custom/common/models/dto/user.dto';

export interface User extends UserDto {
  /** Identifiant unique (toujours présent en UI) */
  id: number;

  /** Email principal (toujours présent en UI) */
  email: string;

  /** Nom concatété a partir des autres infos */
  name: string;

  /** Nom d’utilisateur (toujours présent en UI) */
  username: string;

  /** Prénom (toujours présent en UI) */
  firstName: string;

  /** Nom de famille (toujours présent en UI) */
  lastName: string;

  /** URL de l’avatar (toujours présent en UI) */
  avatar: string;

  /** Statut (toujours présent en UI) */
  status: string;
}
