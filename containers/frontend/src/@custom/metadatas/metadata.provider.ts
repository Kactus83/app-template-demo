import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { metadataInterceptor } from './interceptors/metadata.interceptor';

/**
 * @provider metadata.provider.ts
 * @description
 * Fournit à HttpClient un intercepteur fonctionnel `metadataInterceptor`
 * qui ajoute automatiquement les métadonnées client à chaque requête.
 *
 * @returns {Array<Provider | EnvironmentProviders>}
 */
export const provideMetadata = (): Array<Provider | EnvironmentProviders> => [
  provideHttpClient(
    withInterceptors([metadataInterceptor])
  ),
];
