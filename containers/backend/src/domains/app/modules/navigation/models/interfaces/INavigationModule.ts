import { NavigationItemDto } from '../dto/navigationItem.dto';
import { Navigation } from '@prisma/client';

/**
 * Interface du module de navigation.
 * Expose les méthodes pour gérer l'enregistrement des éléments de navigation.
 */
export interface INavigationModule {
  /**
   * Enregistre un nouvel élément de navigation pour le type spécifié.
   *
   * @param type - Le type de navigation ('USER' ou 'ADMIN').
   * @param item - L'élément de navigation à enregistrer.
   * @returns La navigation mise à jour.
   */
  registerNavigationItem(type: 'USER' | 'ADMIN', item: NavigationItemDto): Promise<Navigation>;
}
