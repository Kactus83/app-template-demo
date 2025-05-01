import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MFAValidationData } from '../../MFA/models/dto/MFAValidationData';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';
import { AuthenticationMethod } from '@prisma/client';
import { AuthMethodService } from '../../MFA/models/abstract/auth-method.service';
import { AuthMethodsService } from '../../../common/services/auth-methods.service';

@Injectable()
export class ClassicAuthMFAService extends AuthMethodService {

  constructor(
    private readonly authUserRepository: AuthUserRepository,
    authMethodsService : AuthMethodsService,
  ) {
    super(authMethodsService, AuthenticationMethod.CLASSIC);
  }

  async requestMFA(userId: number): Promise<void> {
    // Aucune action spécifique nécessaire pour initier le MFA classique
    return;
  }

  async validateMFA(userId: number, data: MFAValidationData): Promise<boolean> {
    if (!data.password) {
      return false;
    }

    const user = await this.authUserRepository.findById(userId);

    if (!user || !user.password) {
      return false;
    }

    return bcrypt.compare(data.password, user.password);
  }
}