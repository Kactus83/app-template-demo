/**
 * @module NavigationModule
 * @include navigation-module.md
 *
 * Ce barrel regroupe les éléments du module de navigation du domaine "App".
 * Il inclut la configuration, les contrôleurs, les modèles et les répertoires associés.
 */
export * from './navigation.module';
export * from './config/adminNavigation.config';
export * from './config/userNavigation.config';
export * from './controllers/navigation.controller';
export * from './models/dto/navigation.dto';
export * from './models/dto/navigationItem.dto';
export * from './models/interfaces/INavigationModule';
export * from './repositories/navigation.repository';
export * from './services/navigation.service';
