import { SetMetadata } from '@nestjs/common';
import { SecureAction } from '@prisma/client';

/**
 * Clé metadata pour indiquer qu’une route nécessite un token MFA.
 * @category Core
 * @category Decorators
 */
export const MFA_KEY = 'mfa';

/**
 * Décorateur pour protéger une route par MFA.
 * @param action Action sécurisée requise (SecureAction).
 */
export const MFA = (action: SecureAction) => SetMetadata(MFA_KEY, action);
