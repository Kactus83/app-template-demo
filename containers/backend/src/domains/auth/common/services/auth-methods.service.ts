import { Injectable } from '@nestjs/common';
import { IAuthMethodService } from '../../../../domains/auth/modules/MFA/models/interfaces/IAuthMethodService';

@Injectable()
export class AuthMethodsService {
  private services: IAuthMethodService[] = [];

  /**
   * Enregistre un service MFA s'il n'est pas déjà enregistré.
   * @param service Service à enregistrer
   */
  registerMethod(service: IAuthMethodService) {
    if (!this.services.find(s => s.authModuleName === service.authModuleName)) {
      console.log(`Registering MFA service: ${service.authModuleName}`);
      this.services.push(service);
    }
  }

  /**
   * Retourne la liste des services MFA enregistrés.
   * @returns Tableau des services enregistrés
   */
  getServices(): IAuthMethodService[] {
    console.log('Returning MFA services', this.services);
    return this.services;
  }
}
