import { Injectable, Logger } from '@nestjs/common';
import { Authenticator } from '@prisma/client';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { CommunicationService } from '../../../../../domains/communication/communication.service';
import { AuthenticatorRepository } from '../repositories/authenticator.repository';

@Injectable()
export class AuthenticatorService {
  private readonly logger = new Logger(AuthenticatorService.name);

  constructor(
    private readonly authenticatorRepository: AuthenticatorRepository,
    private readonly communicationService: CommunicationService,
  ) {}

  /**
   * Creates a new authenticator and generates a QR code URL.
   * @param userId - The ID of the user for whom the authenticator is created.
   * @returns The authenticator and QR code URL.
   */
  async createAuthenticator(userId: number): Promise<{ authenticator: Authenticator, qrCodeUrl: string }> {
    try {
      const secret = authenticator.generateSecret();
      const otpauthUrl = authenticator.keyuri(`U${userId}`, 'AuthBoilerplate', secret);
      const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
      const authenticatorData = await this.authenticatorRepository.create(userId, secret, qrCodeUrl);
      return { authenticator: authenticatorData, qrCodeUrl };
    } catch (error) {
      this.logger.error('Error creating authenticator', error);
      throw new Error('Failed to create authenticator');
    }
  }

  /**
   * Enables the authenticator for a user.
   * @param userId - The ID of the user enabling the authenticator.
   * @param totpCode - The TOTP code to validate.
   * @returns The updated authenticator.
   */
  async enableAuthenticator(userId: number, totpCode: string): Promise<Authenticator> {
    try {
      const authenticatorData = await this.authenticatorRepository.findByUserId(userId);
      if (!authenticatorData) throw new Error('Authenticator not found');
      if (!authenticator.check(totpCode, authenticatorData.secret)) throw new Error('Invalid TOTP code');
      
      const updatedAuthenticator = await this.authenticatorRepository.enable(userId);
      await this.communicationService.createNotification(userId, {
        title: 'Information',
        description: 'You have successfully enabled authenticator.',
        time: new Date(),
        read: false,
      });
      return updatedAuthenticator;
    } catch (error) {
      this.logger.error('Error enabling authenticator', error);
      throw new Error('Failed to enable authenticator');
    }
  }

  /**
   * Disables the authenticator for a user.
   * @param userId - The ID of the user disabling the authenticator.
   * @returns The updated authenticator.
   */
  async disableAuthenticator(userId: number): Promise<Authenticator> {
    try {
      const updatedAuthenticator = await this.authenticatorRepository.disable(userId);
      await this.communicationService.createNotification(userId, {
        title: 'Warning',
        description: 'You have disabled your authenticator.',
        time: new Date(),
        read: false,
      });
      return updatedAuthenticator;
    } catch (error) {
      this.logger.error('Error disabling authenticator', error);
      throw new Error('Failed to disable authenticator');
    }
  }

  /**
   * Deletes the authenticator for a user.
   * @param userId - The ID of the user deleting the authenticator.
   */
  async deleteAuthenticator(userId: number): Promise<void> {
    try {
      await this.authenticatorRepository.delete(userId);
      await this.communicationService.createNotification(userId, {
        title: 'Warning!',
        description: 'You have deleted your authenticator.',
        time: new Date(),
        read: false,
      });
    } catch (error) {
      this.logger.error('Error deleting authenticator', error);
      throw new Error('Failed to delete authenticator');
    }
  }

  /**
   * Retrieves the authenticator for a user.
   * @param userId - The ID of the user to retrieve the authenticator for.
   * @returns The authenticator or null if not found.
   */
  async getAuthenticator(userId: number): Promise<Authenticator | null> {
    try {
      return this.authenticatorRepository.findByUserId(userId);
    } catch (error) {
      this.logger.error('Error retrieving authenticator', error);
      throw new Error('Failed to retrieve authenticator');
    }
  }

  /**
   * Updates the secret of an authenticator.
   * @param userId - The ID of the user updating the secret.
   * @param newSecret - The new secret to update.
   * @returns The updated authenticator.
   */
  async updateAuthenticatorSecret(userId: number, newSecret: string): Promise<Authenticator> {
    try {
      return this.authenticatorRepository.updateSecret(userId, newSecret);
    } catch (error) {
      this.logger.error('Error updating authenticator secret', error);
      throw new Error('Failed to update authenticator secret');
    }
  }

  /**
   * Checks if a given TOTP code is valid for a user.
   * @param userId - The ID of the user to validate.
   * @param totpCode - The TOTP code to validate.
   * @returns True if valid, false otherwise.
   */
  async checkTotp(userId: number, totpCode: string): Promise<boolean> {
    try {
      const authenticatorData = await this.authenticatorRepository.findByUserId(userId);
      if (!authenticatorData) throw new Error('Authenticator not found');
      return authenticator.check(totpCode, authenticatorData.secret);
    } catch (error) {
      this.logger.error('Error validating TOTP code', error);
      throw new Error('Failed to validate TOTP code');
    }
  }
}
