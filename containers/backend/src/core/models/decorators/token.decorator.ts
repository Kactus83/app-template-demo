import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Décorateur personnalisé pour extraire le token JWT
 * depuis l'en-tête Authorization de la requête HTTP.
 * @category Core
 * @category Decorators
 *
 * @returns {string | null} Le token JWT ou null s'il n'est pas fourni.
 */
export const TOKEN = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    // L'en-tête doit être de la forme "Bearer token"
    const parts = authHeader.split(' ');
    return parts.length === 2 ? parts[1] : null;
  },
);
