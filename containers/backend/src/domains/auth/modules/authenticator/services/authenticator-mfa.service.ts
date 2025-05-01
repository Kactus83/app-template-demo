import { Injectable } from '@nestjs/common';
import { AuthenticatorService } from './authenticator.service';
import { MFAValidationData } from '../../MFA/models/dto/MFAValidationData';
import { AuthenticationMethod } from '@prisma/client';
import { AuthMethodService } from '../../MFA/models/abstract/auth-method.service';
import { AuthMethodsService } from '../../../common/services/auth-methods.service';

@Injectable()
export class AuthenticatorMFAService extends AuthMethodService {

  constructor(
    private readonly authenticatorService: AuthenticatorService,
    private readonly authMethodsService: AuthMethodsService,
  ) {
    super(authMethodsService, AuthenticationMethod.AUTHENTICATOR);
  }

  async requestMFA(userId: number): Promise<void> {
    // Pour l'Authenticator, aucune action spécifique n'est nécessaire pour initier le MFA
    return;
  }

  async validateMFA(userId: number, data: MFAValidationData): Promise<boolean> {
    if (!data.authenticatorCode) {
      return false;
    }
    return this.authenticatorService.checkTotp(userId, data.authenticatorCode);
  }
}