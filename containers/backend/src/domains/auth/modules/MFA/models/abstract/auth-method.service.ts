import { Injectable } from '@nestjs/common';
import { AuthenticationMethod } from '@prisma/client';
import { IAuthMethodService } from 'src/domains/auth/modules/MFA/models/interfaces/IAuthMethodService';
import { AuthMethodsService } from '../../../../common/services/auth-methods.service';

@Injectable()
export abstract class AuthMethodService implements IAuthMethodService {
  public authModuleName: AuthenticationMethod;

  constructor(
    private readonly mfaAuthMethodsService: AuthMethodsService,
    name: AuthenticationMethod,
  ) {
    // Enregistrement automatique dans AuthMethodsService
    this.authModuleName = name;
    console.log('Registering MFA method', this.authModuleName);
    this.mfaAuthMethodsService.registerMethod(this);
  }

  /**
   * Démarre le processus MFA pour un utilisateur spécifique.
   * @param userId ID de l'utilisateur
   * @returns Promesse qui se résout sans résultat
   */
  abstract requestMFA(userId: number): Promise<void>;

  /**
   * Valide les données MFA pour un utilisateur.
   * @param userId ID de l'utilisateur
   * @param data Données nécessaires à la validation
   * @returns True si validation réussie, False sinon
   */
  abstract validateMFA(userId: number, data: any): Promise<boolean>;
}
