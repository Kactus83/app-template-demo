import { Injectable } from '@nestjs/common';
import { NavigationService } from './modules/navigation/services/navigation.service';
import { NavigationItemDto } from './modules/navigation/models/dto/navigationItem.dto';
import { Navigation } from '@prisma/client';
import { IAppDomain } from './IAppDomain';

/**
 * Service du domaine App pour la gestion de la navigation.
 * Sert de façade pour exposer les fonctionnalités de navigation aux autres modules.
 */
@Injectable()
export class AppService implements IAppDomain {

    todo: string = "Implémenter les methode spour VersionModule, afin de permettre l'ajout d'un version de coeur de metier"

  constructor(private readonly navigationService: NavigationService) {}

  /**
   * Enregistre un nouvel élément de navigation pour le type spécifié.
   *
   * @param type - Type de navigation ('USER' ou 'ADMIN')
   * @param item - Élément de navigation à enregistrer.
   * @returns La navigation mise à jour.
   */
  async registerNavigationItem(type: 'USER' | 'ADMIN', item: NavigationItemDto): Promise<Navigation> {
    return this.navigationService.registerNavigationItem(type, item);
  }
}
