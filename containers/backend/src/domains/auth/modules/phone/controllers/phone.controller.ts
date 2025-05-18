import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { plainToClass } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';
import { validate } from 'class-validator';

import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { ITrackedRequest } from '../../../../../core/models/interfaces/tracked-request.interface';
import { IRequestMetadata } from '../../../../../core/models/interfaces/request-metadata.interface';

import { PhoneService } from '../services/phone.service';
import { AddPhoneDto } from '../models/dto/add-phone.dto';
import { VerifyPhoneDto } from '../models/dto/verify-phone.dto';
import { UpdatePhoneDto } from '../models/dto/update-phone.dto';
import { PhoneDto } from '../models/dto/phone.dto';

import { AuthMethodsHistoryService } from '../../../common/services/auth-methods-history.service';
import { AuthMethodsHistoryType, ChangeInitiator } from '@prisma/client';

@ApiTags('AUTH - Phone')
@Controller('')
@UseGuards(AuthGuard)
export class PhoneController {
  private readonly logger = new Logger(PhoneController.name);

  constructor(
    private readonly phoneService: PhoneService,
    private readonly historyService: AuthMethodsHistoryService,
  ) {}

  @Post()
  async addPhone(
    @Req() req: IAuthenticatedRequest & ITrackedRequest,
    @Body() addPhoneDto: AddPhoneDto,
    @Res() res: Response,
  ): Promise<void> {
    const errors = await validate(addPhoneDto);
    if (errors.length) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid phone data', errors });
      return;
    }

    try {
      const userId = req.user.id;
      this.logger.log(`Adding phone ${addPhoneDto.phoneNumber} for user ${userId}`);

      const phone = await this.phoneService.addPhone(userId, addPhoneDto);
      const phoneDto = plainToClass(PhoneDto, phone);

      // Enregistrer l’ajout dans l’historique
      const meta: IRequestMetadata = req.metadata;
      await this.historyService.recordAddition(
        userId,
        AuthMethodsHistoryType.PHONE,
        phone.phoneNumber,
        ChangeInitiator.SELF,
        {
          ipAddress: meta.network.ipAddress,
          userAgent: meta.network.userAgent,
        },
      );

      res
        .status(HttpStatus.CREATED)
        .json({ message: 'Numéro de téléphone ajouté avec succès', phone: phoneDto });
    } catch (error: any) {
      this.logger.error(`Error adding phone: ${error.message}`);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('verify')
  async verifyPhone(
    @Body() verifyPhoneDto: VerifyPhoneDto,
    @Res() res: Response,
  ): Promise<void> {
    const errors = await validate(verifyPhoneDto);
    if (errors.length) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid verification data', errors });
      return;
    }

    try {
      const phone = await this.phoneService.verifyPhone(verifyPhoneDto);
      const phoneDto = plainToClass(PhoneDto, phone);

      res
        .status(HttpStatus.OK)
        .json({ message: 'Numéro de téléphone vérifié avec succès', phone: phoneDto });
    } catch (error: any) {
      this.logger.error(`Error verifying phone: ${error.message}`);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Put(':id')
  async updatePhone(
    @Param('id') id: string,
    @Body() updatePhoneDto: UpdatePhoneDto,
    @Res() res: Response,
  ): Promise<void> {
    const errors = await validate(updatePhoneDto);
    if (errors.length) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid update data', errors });
      return;
    }

    try {
      const phoneId = parseInt(id, 10);
      const phone = await this.phoneService.updatePhone(phoneId, updatePhoneDto);
      const phoneDto = plainToClass(PhoneDto, phone);

      res
        .status(HttpStatus.OK)
        .json({ message: 'Numéro de téléphone mis à jour avec succès', phone: phoneDto });
    } catch (error: any) {
      this.logger.error(`Error updating phone: ${error.message}`);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Delete(':id')
  async deletePhone(
    @Req() req: IAuthenticatedRequest & ITrackedRequest,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const phoneId = parseInt(id, 10);
      const phone = await this.phoneService.deletePhone(phoneId);
      const phoneDto = plainToClass(PhoneDto, phone);

      // Enregistrer la suppression dans l’historique
      const userId = req.user.id;
      const meta: IRequestMetadata = req.metadata;
      await this.historyService.recordRemoval(
        userId,
        AuthMethodsHistoryType.PHONE,
        phone.phoneNumber,
        ChangeInitiator.SELF,
        {
          ipAddress: meta.network.ipAddress,
          userAgent: meta.network.userAgent,
        },
      );

      res
        .status(HttpStatus.OK)
        .json({ message: 'Numéro de téléphone supprimé avec succès', phone: phoneDto });
    } catch (error: any) {
      this.logger.error(`Error deleting phone: ${error.message}`);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get()
  async getAllPhones(
    @Req() req: IAuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const phones = await this.phoneService.getAllPhones(userId);
      const phoneDtos = phones.map(p => plainToClass(PhoneDto, p));

      res.status(HttpStatus.OK).json({ phones: phoneDtos });
    } catch (error: any) {
      this.logger.error(`Error retrieving phones: ${error.message}`);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
