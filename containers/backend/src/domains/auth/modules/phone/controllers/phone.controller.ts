import { Controller, Post, Put, Delete, Get, Body, Param, Req, Res, HttpStatus, UseGuards, Logger } from '@nestjs/common';
import { PhoneService } from '../services/phone.service';
import { Response } from 'express';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { AddPhoneDto } from '../models/dto/add-phone.dto';
import { VerifyPhoneDto } from '../models/dto/verify-phone.dto';
import { UpdatePhoneDto } from '../models/dto/update-phone.dto';
import { PhoneDto } from '../models/dto/phone.dto';
import { plainToClass } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AUTH - Phone')
@Controller('')
@UseGuards(AuthGuard) 
export class PhoneController {
  private readonly logger = new Logger(PhoneController.name);

  constructor(private readonly phoneService: PhoneService) {}

  /**
   * Ajoute un nouveau numéro de téléphone pour l'utilisateur.
   * @param req Requête HTTP.
   * @param res Réponse HTTP.
   * @returns Réponse avec le numéro de téléphone ajouté.
   */
  @Post()
  async addPhone(
    @Req() req: IAuthenticatedRequest,
    @Body() addPhoneDto: AddPhoneDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      this.logger.log(`Request body: ${JSON.stringify(addPhoneDto)}`);

      const userId = req.user.id;
      this.logger.log(`Ajout du numéro de téléphone ${addPhoneDto.phoneNumber} pour l'utilisateur ${userId}`);

      const phone = await this.phoneService.addPhone(userId, addPhoneDto);

      const phoneDto = plainToClass(PhoneDto, phone);

      res.status(HttpStatus.CREATED).json({ message: 'Numéro de téléphone ajouté avec succès', phone: phoneDto });
    } catch (error: any) {
      this.logger.error(`Erreur lors de l'ajout du numéro de téléphone: ${error.message}`);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  /**
   * Vérifie un numéro de téléphone avec un token.
   * @param verifyPhoneDto DTO contenant le token de vérification et le numéro de téléphone.
   * @param res Réponse HTTP.
   * @returns Réponse avec le statut de la vérification.
   */
  @Post('verify')
  async verifyPhone(
    @Body() verifyPhoneDto: VerifyPhoneDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const phone = await this.phoneService.verifyPhone(verifyPhoneDto);

      const phoneDto = plainToClass(PhoneDto, phone);

      res.status(HttpStatus.OK).json({ message: 'Numéro de téléphone vérifié avec succès', phone: phoneDto });
    } catch (error: any) {
      this.logger.error(`Erreur lors de la vérification du numéro de téléphone: ${error.message}`);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  /**
   * Met à jour un numéro de téléphone.
   * @param id ID du numéro de téléphone.
   * @param updatePhoneDto DTO contenant les champs à mettre à jour.
   * @param res Réponse HTTP.
   * @returns Réponse avec le numéro de téléphone mis à jour.
   */
  @Put(':id')
  async updatePhone(
    @Param('id') id: string,
    @Body() updatePhoneDto: UpdatePhoneDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const phoneId = parseInt(id, 10);
      const phone = await this.phoneService.updatePhone(phoneId, updatePhoneDto);

      const phoneDto = plainToClass(PhoneDto, phone);

      res.status(HttpStatus.OK).json({ message: 'Numéro de téléphone mis à jour avec succès', phone: phoneDto });
    } catch (error: any) {
      this.logger.error(`Erreur lors de la mise à jour du numéro de téléphone: ${error.message}`);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  /**
   * Supprime un numéro de téléphone.
   * @param id ID du numéro de téléphone à supprimer.
   * @param res Réponse HTTP.
   * @returns Réponse avec le statut de la suppression.
   */
  @Delete(':id')
  async deletePhone(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const phoneId = parseInt(id, 10);

      const phone = await this.phoneService.deletePhone(phoneId);

      const phoneDto = plainToClass(PhoneDto, phone);

      res.status(HttpStatus.OK).json({ message: 'Numéro de téléphone supprimé avec succès', phone: phoneDto });
    } catch (error: any) {
      this.logger.error(`Erreur lors de la suppression du numéro de téléphone: ${error.message}`);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  /**
   * Récupère tous les numéros de téléphone de l'utilisateur.
   * @param req Requête HTTP.
   * @param res Réponse HTTP.
   * @returns Réponse avec la liste des numéros de téléphone.
   */
  @Get()
  async getAllPhones(
    @Req() req: IAuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const userId = req.user.id;

      const phones = await this.phoneService.getAllPhones(userId);

      const phoneDtos = phones.map(phone => plainToClass(PhoneDto, phone));

      res.status(HttpStatus.OK).json({ phones: phoneDtos });
    } catch (error: any) {
      this.logger.error(`Erreur lors de la récupération des numéros de téléphone: ${error.message}`);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}