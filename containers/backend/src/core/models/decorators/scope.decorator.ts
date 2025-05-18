import { SetMetadata } from '@nestjs/common';
import { ScopeTarget, ScopePermission } from '@prisma/client';

/**
 * Clé metadata pour indiquer qu’une route nécessite un scope Service Account.
 * @category Core
 * @category Decorators
 */
export const SCOPE_KEY = 'scope';

/**
 * Décorateur pour protéger une route par scope Service Account.
 * @param target Domaine du scope (ScopeTarget).
 * @param permission Permission requise (ScopePermission).
 */
export const SCOPE = (target: ScopeTarget, permission: ScopePermission) =>
  SetMetadata(SCOPE_KEY, { target, permission });
