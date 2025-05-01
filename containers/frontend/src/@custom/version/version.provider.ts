import { EnvironmentProviders, Provider, inject, provideEnvironmentInitializer } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { VersionService } from '@custom/version/services/version.service';
import { versionInterceptor } from '@custom/version/interceptors/version.interceptor';

/**
 * @provider version.provider.ts
 * @description Provider pour initialiser le VersionService, définir le cookie "frontend_version" 
 *              dès le démarrage de l'application, et forcer l'envoi des cookies avec chaque requête HTTP.
 *
 * Ce provider réalise deux actions principales :
 * 1. Il configure HttpClient pour utiliser le versionInterceptor, qui ajoute withCredentials: true 
 *    à chaque requête. Cela garantit que le cookie sera envoyé au backend.
 * 2. Il utilise un Environment Initializer pour injecter le VersionService, récupérer la version du frontend
 *    et écrire le cookie "frontend_version" dans le navigateur (avec path=/ et des options adaptées).
 *
 * Ainsi, le middleware backend pourra retrouver ce cookie sur chaque requête.
 *
 * Remarque : Dans un environnement cross-origin (ex. Angular sur http://localhost:4200 et backend sur http://localhost:3000),
 *           le cookie défini côté client est lié à l'origine de l'application Angular.
 *           Pour que le cookie soit transmis au backend, il est essentiel de :
 *           - Utiliser withCredentials: true sur les requêtes HTTP,
 *           - Configurer le cookie avec des options compatibles (SameSite et Secure),
 *           - Et éventuellement utiliser un proxy pour partager la même origine.
 *
 * @returns {Array<Provider | EnvironmentProviders>} Liste des providers à ajouter dans le bootstrap.
 */
export const provideVersion = (): Array<Provider | EnvironmentProviders> => {
    return [
        // Configure HttpClient pour utiliser le versionInterceptor qui force withCredentials: true
        provideHttpClient(withInterceptors([versionInterceptor])),
        // Initialisation de l'environnement pour définir le cookie "frontend_version"
        provideEnvironmentInitializer(() => {
            const versionService = inject(VersionService);
            const frontendVersion = versionService.getFrontendVersion();

            // Détermine si la connexion est sécurisée
            const isSecure = window.location.protocol === 'https:';
            // Configure les options de cookie :
            // - En HTTPS, on peut utiliser SameSite=None et Secure pour les requêtes cross-site.
            // - En HTTP, on utilise SameSite=Lax pour maximiser la transmission du cookie.
            const cookieOptions = isSecure ? 'SameSite=None; Secure' : 'SameSite=Lax';

            // Définition du cookie "frontend_version" accessible sur l'ensemble du domaine
            document.cookie = `frontend_version=${frontendVersion}; path=/; ${cookieOptions}`;
        }),
    ];
};
