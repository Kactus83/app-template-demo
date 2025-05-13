import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { validate } from 'class-validator';

import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { ITrackedRequest } from '../../../../../core/models/interfaces/tracked-request.interface';
import { IRequestMetadata } from '../../../../../core/models/interfaces/request-metadata.interface';

import { ChangeEmailDto } from '../models/dto/change-email.dto';
import { ConfirmEmailChangeDto } from '../models/dto/confirm-email-change.dto';
import { ConfirmSecondaryEmailDeletionDto } from '../models/dto/confirm-secondary-email-deletion.dto';

import { EmailChangeService } from '../services/email-change.service';
import { AuthUserRepository } from '../../../common/repositories/auth-user.repository';
import { AuthMethodsHistoryService } from '../../../common/services/auth-methods-history.service';
import {
  AuthMethodsHistoryType,
  ChangeInitiator,
} from '@prisma/client';

@ApiTags('AUTH - Email Change')
@Controller()
export class EmailChangeController {
  constructor(
    private readonly emailChangeService: EmailChangeService,
    private readonly authUserRepo: AuthUserRepository,
    private readonly historyService: AuthMethodsHistoryService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('change-email')
  async requestEmailChange(
    @Req() req: IAuthenticatedRequest,
    @Body() dto: ChangeEmailDto,
  ): Promise<{ message: string }> {
    const errors = await validate(dto);
    if (errors.length) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    try {
      await this.emailChangeService.requestEmailChange(req.user.id, dto.newEmail);
      return { message: 'Email change confirmation sent' };
    } catch (err: any) {
      throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post('confirm-email-change')
  async confirmEmailChange(
    @Body() dto: ConfirmEmailChangeDto,
    @Req() req: ITrackedRequest & IAuthenticatedRequest,
  ): Promise<{ message: string }> {
    const errors = await validate(dto);
    if (errors.length) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    try {
      // 1️⃣ Lire l’ancien email
      const userId = req.user.id;
      const oldEmail = req.user.email!;

      // 2️⃣ Laisser le service gérer la validation du token et la mise à jour
      const newEmail = await this.emailChangeService.confirmEmailChange(dto.token);
      
      // 4️⃣ Historiser l’ancien et le nouveau email
      const meta: IRequestMetadata = req.metadata;
      await this.historyService.recordRemoval(
        userId,
        AuthMethodsHistoryType.EMAIL,
        oldEmail,
        ChangeInitiator.SELF,
        { ipAddress: meta.network.ipAddress, userAgent: meta.network.userAgent },
      );
      await this.historyService.recordAddition(
        userId,
        AuthMethodsHistoryType.EMAIL,
        newEmail,
        ChangeInitiator.SELF,
        { ipAddress: meta.network.ipAddress, userAgent: meta.network.userAgent },
      );

      return { message: 'Email has been changed successfully' };
    } catch (err: any) {
      throw new HttpException(err.message, err.status || HttpStatus.FORBIDDEN);
    }
  }

  @UseGuards(AuthGuard)
  @Post('change-secondary-email')
  async requestSecondaryEmailChange(
    @Req() req: IAuthenticatedRequest,
    @Body() dto: ChangeEmailDto,
  ): Promise<{ message: string }> {
    const errors = await validate(dto);
    if (errors.length) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    try {
      await this.emailChangeService.requestSecondaryEmailChange(req.user.id, dto.newEmail);
      return { message: 'Secondary email change confirmation sent' };
    } catch (err: any) {
      throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post('confirm-secondary-email-change')
  async confirmSecondaryEmailChange(
    @Body() dto: ConfirmSecondaryEmailDeletionDto,
    @Req() req: ITrackedRequest & IAuthenticatedRequest,
  ): Promise<{ message: string }> {
    const errors = await validate(dto);
    if (errors.length) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    try {
      // 1️⃣ Lire l’ancien email secondaire
      const userId = req.user.id;
      const oldEmail = req.user.secondaryEmail!;

      // 2️⃣ Laisser le service gérer la validation du token et la mise à jour
      const newEmail = await this.emailChangeService.confirmSecondaryEmailChange(dto.token);

      // 4️⃣ Historiser l’ancien et le nouveau email
      const meta: IRequestMetadata = req.metadata;
      await this.historyService.recordRemoval(
        userId,
        AuthMethodsHistoryType.EMAIL,
        oldEmail,
        ChangeInitiator.SELF,
        { ipAddress: meta.network.ipAddress, userAgent: meta.network.userAgent },
      );
      await this.historyService.recordAddition(
        userId,
        AuthMethodsHistoryType.EMAIL,
        newEmail,
        ChangeInitiator.SELF,
        { ipAddress: meta.network.ipAddress, userAgent: meta.network.userAgent },
      );

      return { message: 'Secondary email has been changed successfully' };
    } catch (err: any) {
      throw new HttpException(err.message, err.status || HttpStatus.FORBIDDEN);
    }
  }
}