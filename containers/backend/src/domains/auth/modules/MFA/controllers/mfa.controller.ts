import { Controller, Post, Body, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { MFAService } from '../services/mfa.service';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { MFARequestDto } from '../models/dto/MFARequestDto';
import { MFAValidationData } from '../models/dto/MFAValidationData';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';

@ApiTags('AUTH - MultiFactor Authentication')
@ApiBearerAuth()
@Controller('')
@UseGuards(AuthGuard)
export class MFAController {
  constructor(private readonly mfaService: MFAService) {}

  @Post('request')
  @ApiOperation({ summary: 'Initier une demande MFA' })
  @ApiResponse({ status: 200, description: 'Demande MFA initiée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides ou erreur lors de l\'initiation' })
  async requestMFA(
    @Req() req: IAuthenticatedRequest,
    @Body() mfaRequestDto: MFARequestDto,
    @Res() res: Response
  ): Promise<void> {
    const userId = (req.user as any).id;
    try {
      const responseDto = await this.mfaService.initiateMFA(userId, mfaRequestDto.secureActionType);
      res.status(HttpStatus.OK).json(responseDto);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('validate')
  @ApiOperation({ summary: 'Valider une demande MFA' })
  @ApiResponse({ status: 200, description: 'MFA validée avec succès' })
  @ApiResponse({ status: 400, description: 'Token MFA invalide ou expiré' })
  async validateMFA(
    @Req() req: IAuthenticatedRequest,
    @Body() mfaValidationData: MFAValidationData,
    @Res() res: Response
  ): Promise<void> {
    const userId = (req.user as any).id;
    try {
      const isValid = await this.mfaService.validateMFA(userId, mfaValidationData);
      if (isValid) {
        const token = await this.mfaService.generateJWTAfterMFA(userId);
        res.status(HttpStatus.OK).json({ message: 'MFA validée avec succès.', token });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Token MFA invalide ou expiré.' });
      }
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
