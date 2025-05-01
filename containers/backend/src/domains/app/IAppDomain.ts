import { INavigationModule } from './modules/navigation/models/interfaces/INavigationModule';
import { IVersionModule } from './modules/version/models/interfaces/IVersionModule';

/**
 * Interface du domaine App.
 * Regroupe les interfaces des modules sous App pour exposer une interface globale.
 */
export interface IAppDomain extends INavigationModule, IVersionModule {
  // Rassemble les fonctionnalités exposées par les modules.
}
