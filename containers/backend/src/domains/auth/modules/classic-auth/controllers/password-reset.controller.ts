import {
  Controller,
  Post,
  Body,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PasswordResetService } from '../services/password-reset.service';
import { PasswordResetTokenRepository } from '../repositories/password-reset-token.repository';
import { AuthUserRepository } from '../../../common/repositories/auth-user.repository';
import { PasswordHistoryRepository } from '../repositories/password-history.repository';
import { RequestPasswordResetDto } from '../models/dto/request-password-reset.dto';
import { ResetPasswordDto } from '../models/dto/passwordReset.dto';
import { ITrackedRequest } from '../../../../../core/models/interfaces/tracked-request.interface';
import { ChangeInitiator, PasswordChangeReason } from '@prisma/client';

@ApiTags('AUTH - Password Reset')
@Controller()
export class PasswordResetController {
  constructor(
    private readonly passwordResetService: PasswordResetService,
    private readonly tokenRepo: PasswordResetTokenRepository,
    private readonly authUserRepo: AuthUserRepository,
    private readonly passwordHistoryRepo: PasswordHistoryRepository,
  ) {}

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  async requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
  ): Promise<{ message: string }> {
    try {
      await this.passwordResetService.requestPasswordReset(dto);
      return { message: 'Password reset email sent' };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password has been reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() req: ITrackedRequest,
  ): Promise<{ message: string }> {
    try {
      // 1️⃣ Récupérer et valider le token
      const tokenData = await this.tokenRepo.findByToken(dto.token);
      if (!tokenData) {
        throw new Error('Invalid or expired token');
      }

      // 2️⃣ Récupérer l’utilisateur et son ancien hash
      const user = await this.authUserRepo.findById(tokenData.userId);
      if (!user || !user.password) {
        throw new Error('User not found or no password set');
      }
      const oldHash = user.password;

      // 3️⃣ Appliquer le reset (hash + update + suppression du token + notification)
      await this.passwordResetService.resetPassword(dto);

      // 4️⃣ Enregistrer dans PasswordHistory
      await this.passwordHistoryRepo.create({
        userId: tokenData.userId,
        password: oldHash,
        changedBy: ChangeInitiator.SELF,
        reason: PasswordChangeReason.RESET_TOKEN,
        ipAddress: req.metadata.network.ipAddress,
        meta: {
          userAgent: req.metadata.network.userAgent,
          timestamp: req.metadata.timestamp.toISOString(),
        },
      });

      return { message: 'Password has been reset successfully' };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}