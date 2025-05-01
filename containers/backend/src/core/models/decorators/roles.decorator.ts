import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

/**
 * Key utilisée pour stocker les rôles dans les métadonnées.
 * @category Core
 * @category Constants
 */
export const ROLES_KEY = 'roles';

/**
 * Décorateur personnalisé pour définir les rôles requis sur un endpoint.
 * @category Core
 * @category Decorators
 *
 * @param {...UserRole[]} roles - Liste des rôles autorisés.
 * @returns Le décorateur qui affecte la métadonnée.
 */
export const ROLES = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
