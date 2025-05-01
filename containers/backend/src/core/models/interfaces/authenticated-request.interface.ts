import { Request } from 'express';
import { UserWithRelations } from '../types/userWithRelations.type';

/**
 * Interface étendant la requête Express pour y inclure un utilisateur authentifié.
 * (Représente une requête sortie du middleware d'auth)
 * @category Core
 * @interface
 */
export interface IAuthenticatedRequest extends Request {
  user: UserWithRelations;
}
