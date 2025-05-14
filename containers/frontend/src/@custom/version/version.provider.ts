import {
  EnvironmentProviders,
  Provider,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { VersionService } from '@custom/version/services/version.service';
import { VersionInterceptor } from '@custom/version/interceptors/version.interceptor';

/**
 * @provider version.provider.ts
 * @description
 *   - Active l’interception DI-based pour injecter VersionInterceptor
 *   - Initialise VersionService et écrit le cookie "frontend_version"
 *     (withCredentials forcé par l’intercepteur)
 *
 * @returns {Array<Provider | EnvironmentProviders>} Liste des providers à ajouter dans le bootstrap.
 */
export const provideVersion = (): Array<Provider | EnvironmentProviders> => [
  // 1) Configure HttpClient en mode DI-based
  provideHttpClient(withInterceptorsFromDi()),

  // 2) Enregistre VersionInterceptor comme HTTP_INTERCEPTOR
  {
    provide: HTTP_INTERCEPTORS,
    useClass: VersionInterceptor,
    multi: true,
  },

  // 3) Initialise VersionService et écrit le cookie
  provideEnvironmentInitializer(() => {
    const versionService = inject(VersionService);
    const frontendVersion = versionService.getFrontendVersion();

    const isSecure = window.location.protocol === 'https:';
    const cookieOptions = isSecure
      ? 'SameSite=None; Secure'
      : 'SameSite=Lax';

    document.cookie = `frontend_version=${frontendVersion}; path=/; ${cookieOptions}`;
  }),
];
