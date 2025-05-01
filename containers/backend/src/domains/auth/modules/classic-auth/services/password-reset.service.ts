import { Injectable } from '@nestjs/common';
import { PasswordResetTokenRepository } from '../repositories/password-reset-token.repository';
import { ResetPasswordDto } from '../models/dto/passwordReset.dto';
import * as bcrypt from 'bcrypt';
import { CommunicationService } from '../../../../../domains/communication/communication.service';
import { EmailSenderService } from '../../../../../domains/auth/common/services/email-sender.service';
import { AuthUserRepository } from '../../../../../domains/auth/common/repositories/auth-user.repository';
import { RequestPasswordResetDto } from '../models/dto/request-password-reset.dto';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly authUserRepository: AuthUserRepository,
    private readonly emailService: EmailSenderService,
    private readonly notificationService: CommunicationService,
  ) {}

  async requestPasswordReset(passwordResetDto: RequestPasswordResetDto): Promise<void> {
    const user = await this.authUserRepository.findByEmail(passwordResetDto.email);

    if (!user) {
      throw new Error('User not found');
    }

    const token = await this.passwordResetTokenRepository.createToken(user.id);

    // Send password reset email using EmailService
    await this.emailService.sendPasswordResetEmail(user.name, user.email, token.token);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const tokenData = await this.passwordResetTokenRepository.findByToken(resetPasswordDto.token);

    if (!tokenData) {
      throw new Error('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    await this.authUserRepository.updatePassword(tokenData.userId, hashedPassword);

    // Delete the token after successful reset
    await this.passwordResetTokenRepository.delete(tokenData.id);

    // Send notification
    await this.notificationService.createNotification(tokenData.userId, {
      title: 'Password Changed',
      description: 'Your password has been changed successfully.',
      time: new Date(),
      read: false,
    });
  }
}
