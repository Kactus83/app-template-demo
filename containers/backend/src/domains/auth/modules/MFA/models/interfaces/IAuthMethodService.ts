import { PartialMFARequestResponseDto } from "src/domains/auth/modules/MFA/models/dto/MFARequestResponseDto";
import { MFAValidationData } from "src/domains/auth/modules/MFA/models/dto/MFAValidationData";
import { AuthenticationMethod } from '@prisma/client';

export interface IAuthMethodService {
  authModuleName: AuthenticationMethod;
  
  /**
   * Demande la validation MFA pour une action spécifique
   * @param user Utilisateur concerné
   * @param action Action sécurisée à valider
   */
  requestMFA(userId: number): Promise<void | PartialMFARequestResponseDto>;

  /**
   * Valide les données reçues pour une action spécifique
   * @param user Utilisateur concerné
   * @param action Action sécurisée à valider
   * @param data Données de validation (ex: code MFA, token, etc.)
   */
  validateMFA(userId: number, data: MFAValidationData): Promise<boolean>;
}