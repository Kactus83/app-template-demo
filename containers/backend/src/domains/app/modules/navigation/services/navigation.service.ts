import { Injectable, OnModuleInit } from '@nestjs/common';
import { initialAdminNavigation } from '../config/adminNavigation.config';
import { initialUserNavigation } from '../config/userNavigation.config'; 
import { NavigationRepository } from '../repositories/navigation.repository';
import { NavigationDto } from '../models/dto/navigation.dto';
import { NavigationItemDto } from '../models/dto/navigationItem.dto';
import { Navigation } from '@prisma/client';
import { INavigationModule } from '../models/interfaces/INavigationModule';

@Injectable()
export class NavigationService implements INavigationModule, OnModuleInit {
  constructor(private readonly navigationRepository: NavigationRepository) {}

  async onModuleInit(): Promise<void> {
    await this.initializeNavigation();
  }

  /**
   * Initialise la navigation pour les utilisateurs et administrateurs si non existante.
   */
  async initializeNavigation(): Promise<void> {
    const userNavigation = await this.navigationRepository.getNavigationByType('USER');
    if (!userNavigation) {
      await this.navigationRepository.createNavigation(initialUserNavigation);
    }
    const adminNavigation = await this.navigationRepository.getNavigationByType('ADMIN');
    if (!adminNavigation) {
      await this.navigationRepository.createNavigation(initialAdminNavigation);
    }
  }

  /**
   * Récupère la navigation pour un type donné.
   *
   * @param type - 'USER' ou 'ADMIN'
   * @returns La navigation correspondante.
   */
  async getNavigation(type: 'USER' | 'ADMIN'): Promise<Navigation> {
    const navigation = await this.navigationRepository.getNavigationByType(type);
    if (!navigation) {
      throw new Error(`Navigation data for type ${type} not found.`);
    }
    return navigation;
  }

  /**
   * Met à jour la navigation pour un type donné.
   *
   * @param type - 'USER' ou 'ADMIN'
   * @param data - Données de navigation à mettre à jour.
   * @returns La navigation mise à jour.
   */
  async updateNavigation(type: 'USER' | 'ADMIN', data: NavigationDto): Promise<Navigation> {
    return this.navigationRepository.updateNavigation(type, data);
  }

  /**
   * Enregistre un nouvel élément de navigation dans la navigation par défaut.
   *
   * @param type - 'USER' ou 'ADMIN'
   * @param item - Élément de navigation à enregistrer.
   * @returns La navigation mise à jour.
   */
  async registerNavigationItem(type: 'USER' | 'ADMIN', item: NavigationItemDto): Promise<Navigation> {
    const currentNavigation = await this.getNavigation(type);
    // On ajoute l'élément dans le layout 'default'
    const updatedDefault = [...(currentNavigation.default as unknown as NavigationItemDto[]), item];
    return this.navigationRepository.updateNavigation(type, { default: updatedDefault });
  }
}
