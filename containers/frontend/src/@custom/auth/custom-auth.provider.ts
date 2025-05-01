import { EnvironmentProviders, Provider, provideEnvironmentInitializer, inject } from '@angular/core';
import { AuthCoreService } from '@custom/auth/common/services/core-auth.service';

/**
 * @module provideCustomAuth
 * @description
 * Provider custom pour s'assurer que AuthCoreService est bien injecté et initialisé.
 *
 * Comme AuthCoreService est utilisé par votre AuthService custom et d'autres composants,
 * on le fournit ici de manière similaire aux autres providers du projet.
 *
 * Vous pouvez appeler cette fonction dans votre appConfig AVANT d'appeler provideAuth.
 */
export const provideCustomAuth = (): Array<Provider | EnvironmentProviders> => {
  return [
    // L'initializer force l'injection et l'initialisation d'AuthCoreService dès le lancement
    provideEnvironmentInitializer(() => inject(AuthCoreService)),
  ];
};
