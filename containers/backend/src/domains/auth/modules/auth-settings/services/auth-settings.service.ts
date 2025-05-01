import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { AuthSettingsDto } from '../models/dto/authSettingsDto';
import { AuthenticationMethod } from '@prisma/client';
import { AuthSettingsRepository } from '../repository/auth-settings.repository';
import { CommunicationService } from '../../../../../domains/communication/communication.service';
import { AuthMethodDto } from '../models/dto/authMethod.dto';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';

@Injectable()
export class AuthSettingsService {
  constructor(
    private readonly authSettingsRepository: AuthSettingsRepository,
    private readonly userRepository: AuthUserRepository,
    @Inject(forwardRef(() => CommunicationService))
    private readonly communicationService: CommunicationService
  ) {}

  async updateAuthMethod(
    userId: number,
    method: AuthenticationMethod,
    methodId?: number,
    order?: number
  ): Promise<void> {
    const existingMethods = await this.authSettingsRepository.findAuthMethodsByUserId(userId);

    const methodToUpdate = existingMethods.find((m) => m.method === method && m.methodId === methodId);

    if (methodToUpdate) {
      await this.authSettingsRepository.updateAuthMethod(userId, methodToUpdate.id, method, methodId, order);
    } else {
      await this.authSettingsRepository.addAuthMethod(userId, method, methodId);
    }

    await this.communicationService.createNotification(userId, {
      title: 'Information',
      description: `You have successfully updated your authentication method to ${method}.`,
      time: new Date(),
      read: false,
    });
  }

  async disableAuthMethod(userId: number, methodId: number): Promise<void> {
    const existingMethods = await this.authSettingsRepository.findAuthMethodsByUserId(userId);

    const methodToDisable = existingMethods.find((m) => m.id === methodId);

    if (!methodToDisable) {
      throw new Error(`Authentication method not found.`);
    }

    await this.authSettingsRepository.disableAuthMethod(userId, methodToDisable.id);

    const remainingMethods = existingMethods.filter((m) => m.id !== methodToDisable.id);
    for (let i = 0; i < remainingMethods.length; i++) {
      await this.authSettingsRepository.updateAuthMethod(
        userId,
        remainingMethods[i].id,
        remainingMethods[i].method,
        remainingMethods[i].methodId,
        i + 1
      );
    }

    await this.communicationService.createNotification(userId, {
      title: 'Warning',
      description: `You have disabled your authentication method.`,
      time: new Date(),
      read: false,
    });
  }

  async getAuthSettings(userId: number): Promise<AuthSettingsDto> {
    const userAuthMethods = await this.authSettingsRepository.findAuthMethodsByUserId(userId);

    const authMethodsDto: AuthMethodDto[] = userAuthMethods.map((method) => ({
      id: method.id,
      method: method.method,
      methodId: method.methodId,
      order: method.order,
    }));

    return { authMethods: authMethodsDto };
  }
}
