import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChangeEmailDto } from '../models/dto/change-email.dto';
import { ConfirmEmailChangeDto } from '../models/dto/confirm-email-change.dto';
import { validate } from 'class-validator';
import { EmailChangeService } from '../services/email-change.service';
import { ConfirmSecondaryEmailDeletionDto } from '../models/dto/confirm-secondary-email-deletion.dto';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';

/**
 * @controller EmailChangeController
 * @description Contrôleur gérant les opérations de changement d'email.
 *
 * Il fournit des endpoints pour :
 * - Demander un changement d'email
 * - Confirmer le changement d'email
 * - Demander un changement d'email secondaire
 * - Confirmer le changement d'email secondaire
 */
@ApiTags('AUTH - Email Change')
@Controller('')
export class EmailChangeController {
  constructor(private readonly emailChangeService: EmailChangeService) {}

  /**
   * Demande de changement d'email pour un utilisateur authentifié.
   *
   * @param req La requête HTTP authentifiée.
   * @param changeEmailDto DTO contenant le nouvel email.
   * @returns Un message de confirmation.
   */
  @UseGuards(AuthGuard)
  @Post('change-email')
  async requestEmailChange(
    @Req() req: IAuthenticatedRequest,
    @Body() changeEmailDto: ChangeEmailDto,
  ): Promise<{ message: string }> {
    try {
      const errors = await validate(changeEmailDto);
      if (errors.length > 0) {
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
      }
      const userId = req.user['id'];
      await this.emailChangeService.requestEmailChange(userId, changeEmailDto.newEmail);
      return { message: 'Email change confirmation sent' };
    } catch (error: any) {
      throw new HttpException(
        { message: error.message },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Confirmation du changement d'email avec un token.
   *
   * @param confirmEmailChangeDto DTO contenant le token de confirmation.
   * @returns Un message de succès.
   */
  @Post('confirm-email-change')
  async confirmEmailChange(
    @Body() confirmEmailChangeDto: ConfirmEmailChangeDto,
  ): Promise<{ message: string }> {
    try {
      const errors = await validate(confirmEmailChangeDto);
      if (errors.length > 0) {
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
      }
      await this.emailChangeService.confirmEmailChange(confirmEmailChangeDto.token);
      return { message: 'Email has been changed successfully' };
    } catch (error: any) {
      throw new HttpException(
        { message: error.message },
        error.status || HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * Demande de changement d'email secondaire pour un utilisateur authentifié.
   *
   * @param req La requête HTTP authentifiée.
   * @param changeEmailDto DTO contenant le nouvel email secondaire.
   * @returns Un message de confirmation.
   */
  @UseGuards(AuthGuard)
  @Post('change-secondary-email')
  async requestSecondaryEmailChange(
    @Req() req: IAuthenticatedRequest,
    @Body() changeEmailDto: ChangeEmailDto,
  ): Promise<{ message: string }> {
    try {
      const errors = await validate(changeEmailDto);
      if (errors.length > 0) {
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
      }
      const userId = req.user['id'];
      await this.emailChangeService.requestSecondaryEmailChange(userId, changeEmailDto.newEmail);
      return { message: 'Email change confirmation sent' };
    } catch (error: any) {
      throw new HttpException(
        { message: error.message },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Confirmation du changement d'email secondaire avec un token.
   *
   * @param confirmSecondaryEmailDeletionDto DTO contenant le token de confirmation.
   * @returns Un message de succès.
   */
  @Post('confirm-secondary-email-change')
  async confirmSecondaryEmailChange(
    @Body() confirmSecondaryEmailDeletionDto: ConfirmSecondaryEmailDeletionDto,
  ): Promise<{ message: string }> {
    try {
      const errors = await validate(confirmSecondaryEmailDeletionDto);
      if (errors.length > 0) {
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
      }
      await this.emailChangeService.confirmSecondaryEmailChange(confirmSecondaryEmailDeletionDto.token);
      return { message: 'Email has been changed successfully' };
    } catch (error: any) {
      throw new HttpException(
        { message: error.message },
        error.status || HttpStatus.FORBIDDEN,
      );
    }
  }
}
