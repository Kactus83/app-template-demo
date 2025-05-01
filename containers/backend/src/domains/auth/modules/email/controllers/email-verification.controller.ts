import { Controller, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { EmailVerificationService } from '../services/email-verification.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EmailValidationTokenDto } from '../models/dto/email-validation-token.dto';

/**
 * @controller EmailVerificationController
 * @description Contrôleur gérant la vérification d'email via token.
 *
 * Cet endpoint POST reçoit le token dans le body (via EmailValidationTokenDto) et met à jour
 * l'état de vérification de l'utilisateur.
 */
@ApiTags('AUTH - Email Verification')
@Controller('')
export class EmailVerificationController {
  constructor(private readonly emailVerificationService: EmailVerificationService) {}

  /**
   * Vérifie un token de vérification d'email et met à jour l'état de vérification de l'utilisateur.
   *
   * @param emailValidationTokenDto DTO contenant le token de vérification.
   * @param res La réponse HTTP.
   */
  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email via token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiBody({ type: EmailValidationTokenDto })
  async verifyEmail(
    @Body() emailValidationTokenDto: EmailValidationTokenDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.emailVerificationService.verifyEmail(emailValidationTokenDto.token);
      res.status(HttpStatus.OK).json({ message: 'Email verified successfully' });
    } catch (error: any) {
      throw new HttpException(
        { message: error.message },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
