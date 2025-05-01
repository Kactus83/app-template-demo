/**
 * @interceptor VersionInterceptor
 * @description Intercepteur HTTP qui s'assure que chaque requête inclut withCredentials: true et que le cookie
 * "frontend_version" est présent dans le navigateur.
 *
 * À chaque requête, cet intercepteur vérifie si le cookie "frontend_version" existe.
 * S'il n'existe pas, il le définit à partir de la version du frontend fournie par le VersionService.
 * Ensuite, il clone la requête pour forcer l'envoi des cookies avec withCredentials: true.
 *
 * Pour que cela fonctionne dans un contexte cross-origin, le backend doit autoriser les credentials via CORS
 * (Access-Control-Allow-Credentials: true).
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { VersionService } from '@custom/version/services/version.service';

// Fonction utilitaire pour vérifier la présence du cookie "frontend_version"
function hasFrontendVersionCookie(): boolean {
    return document.cookie
        .split(';')
        .map(cookie => cookie.trim())
        .some(cookie => cookie.startsWith('frontend_version='));
}

export const versionInterceptor: HttpInterceptorFn = (req, next) => {
    // Si le cookie "frontend_version" n'est pas présent, le définir
    if (!hasFrontendVersionCookie()) {
        const versionService = inject(VersionService);
        const frontendVersion = versionService.getFrontendVersion();
        // Définition du cookie avec les options recommandées (path=/; SameSite=Lax par défaut)
        document.cookie = `frontend_version=${frontendVersion}; path=/; SameSite=Lax`;
    }
    
    // S'assurer que la requête inclut withCredentials: true
    const clonedRequest = req.withCredentials ? req : req.clone({ withCredentials: true });
    return next(clonedRequest);
};
