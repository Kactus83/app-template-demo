import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AddSecondaryEmailDto } from '../models/dto/addSecondaryEmail.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { EmailService } from '../services/email.service';
import { UserDto } from '../../../../../core/models/dto/user.dto';
import { ApiTags } from '@nestjs/swagger';

/**
 * @controller EmailController
 * @description Contrôleur gérant les opérations sur l'email secondaire.
 *
 * Il permet d'ajouter, de supprimer et de confirmer la suppression d'un email secondaire pour l'utilisateur authentifié.
 */
@ApiTags('AUTH - Email')
@Controller('')
@UseGuards(AuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Ajoute un email secondaire à l'utilisateur authentifié.
   *
   * @param req La requête HTTP authentifiée.
   * @param res La réponse HTTP.
   * @param addSecondaryEmailDto DTO contenant l'email secondaire à ajouter.
   */
  @Post('add-secondary-email')
  async addSecondaryEmail(
    @Req() req: IAuthenticatedRequest,
    @Res() res: Response,
    @Body() addSecondaryEmailDto: AddSecondaryEmailDto,
  ): Promise<void> {
    try {
      const errors = await validate(addSecondaryEmailDto);
      if (errors.length > 0) {
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
      }
      const userId = req.user!.id;
      const updatedUser = await this.emailService.addSecondaryEmail(
        userId,
        addSecondaryEmailDto.secondaryEmail,
      );
      const userDto = plainToClass(UserDto, updatedUser);
      res.status(HttpStatus.OK).json({
        message: 'Secondary email added successfully',
        user: userDto,
      });
    } catch (error: any) {
      throw new HttpException(
        { message: error.message },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Supprime un email secondaire de l'utilisateur authentifié.
   *
   * @param req La requête HTTP authentifiée.
   * @param res La réponse HTTP.
   */
  @Post('delete-secondary-email')
  async deleteSecondaryEmail(
    @Req() req: IAuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const updatedUser = await this.emailService.deleteSecondaryEmail(userId);
      const userDto = plainToClass(UserDto, updatedUser);
      res.status(HttpStatus.OK).json({
        message: 'Secondary email deleted successfully',
        user: userDto,
      });
    } catch (error: any) {
      throw new HttpException(
        { message: error.message },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Confirme la suppression de l'email secondaire de l'utilisateur authentifié.
   *
   * @param body Objet contenant le token de confirmation.
   * @param res La réponse HTTP.
   */
  @Post('confirm-secondary-email-deletion')
  async confirmSecondaryEmailDeletion(
    @Body() body: { token: string },
    @Res() res: Response,
  ): Promise<void> {
    try {
      const { token } = body;
      await this.emailService.confirmSecondaryEmailDeletion(token);
      res.status(HttpStatus.OK).json({
        message: 'Secondary email deletion confirmed successfully',
      });
    } catch (error: any) {
      throw new HttpException(
        { message: error.message },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
