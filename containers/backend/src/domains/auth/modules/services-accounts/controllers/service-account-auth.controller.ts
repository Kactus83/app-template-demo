import {
  Controller,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { IssueTokenDto } from '../models/dto/issue-token.dto';
import { ServiceAccountAuthService } from '../services/service-account-auth.service';
import { plainToInstance } from 'class-transformer';
import { ITrackedRequest } from '../../../../../core/models/interfaces/tracked-request.interface';
import { IssueTokenResponseDto } from '../models/dto/issue-token-response.dto';

/**
 * Controller pour l’authentification des Service Accounts (client_credentials).
 * Route publique.
 * @category Domains/Auth
 */
@ApiTags('AUTH - Service Account Auth')
@Controller()
export class ServiceAccountAuthController {
  constructor(
    private readonly auth: ServiceAccountAuthService,
  ) {}

  /**
   * Émet un JWT via le flux client_credentials.
   */
  @Post('token')
  @ApiOperation({ summary: 'Issue token via client_credentials' })
  @ApiResponse({ status: 200, description: 'Token issued.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async issueToken(
    @Req() req: ITrackedRequest,
    @Body() dto: IssueTokenDto,
  ): Promise<IssueTokenResponseDto> {
    const ip = req.metadata.network.ipAddress;
    const result = await this.auth.issueToken(dto, ip);
    const response = {
      token: result.access_token,
    };
    return plainToInstance(IssueTokenResponseDto, response);
  }
}