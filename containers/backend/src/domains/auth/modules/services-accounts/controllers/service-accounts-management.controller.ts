import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiParam,
  } from '@nestjs/swagger';
  import { plainToInstance } from 'class-transformer';
  import { AuthGuard } from '../../../../../core/guards/auth.guard';
  import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
  import { CreateServiceAccountDto } from '../models/dto/create-service-account.dto';
  import { UpdateServiceAccountDto } from '../models/dto/update-service-account.dto';
  import { ServiceAccountDto } from '../models/dto/service-account.dto';
  import { ServiceAccountsManagementService } from '../services/service-accounts-management.service';
import { CreateServiceAccountResponseDto } from '../models/dto/create-service-account-response.dto';
  
  /**
   * Controller pour la gestion des Service Accounts.
   * Routes protégées par JWT utilisateur.
   * @category Domains/Auth
   */
  @ApiTags('AUTH - Service Accounts')
  @Controller('')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  export class ServiceAccountsManagementController {
    constructor(
      private readonly management: ServiceAccountsManagementService,
    ) {}
  
    /**
     * Crée un nouveau compte de service pour l’utilisateur authentifié.
     */
    @Post()
    @ApiOperation({ summary: 'Create a new service account' })
    @ApiResponse({ status: 201, description: 'Service account created.' })
    async create(
      @Req() req: IAuthenticatedRequest,
      @Body() dto: CreateServiceAccountDto,
    ): Promise<CreateServiceAccountResponseDto> {
      const userId = req.user.id;
      const result = await this.management.create(userId, dto);
      return plainToInstance(CreateServiceAccountResponseDto, result);
    }
  
    /**
     * Liste tous les comptes de service de l’utilisateur.
     */
    @Get()
    @ApiOperation({ summary: 'List service accounts' })
    @ApiResponse({ status: 200, description: 'List of service accounts.' })
    async list(
      @Req() req: IAuthenticatedRequest,
    ): Promise<ServiceAccountDto[]> {
      const userId = req.user.id;
      return this.management.list(userId);
    }
  
    /**
     * Met à jour un compte de service existant.
     */
    @Put(':id')
    @ApiOperation({ summary: 'Update a service account' })
    @ApiParam({ name: 'id', description: 'UUID of the service account' })
    @ApiResponse({ status: 200, description: 'Service account updated.' })
    async update(
      @Param('id') id: string,
      @Body() dto: UpdateServiceAccountDto,
    ): Promise<ServiceAccountDto> {
      return this.management.update(id, dto);
    }
  
    /**
     * Révoque (supprime) un compte de service.
     */
    @Delete(':id')
    @ApiOperation({ summary: 'Revoke a service account' })
    @ApiParam({ name: 'id', description: 'UUID of the service account' })
    @ApiResponse({ status: 204, description: 'Service account revoked.' })
    async revoke(@Param('id') id: string): Promise<void> {
      await this.management.revoke(id);
    }
  
    /**
     * Fait tourner le secret d’un compte de service et retourne le nouveau secret brut.
     */
    @Post(':id/rotate')
    @ApiOperation({ summary: 'Rotate secret of a service account' })
    @ApiParam({ name: 'id', description: 'UUID of the service account' })
    @ApiResponse({ status: 200, description: 'New client secret.' })
    async rotate(
      @Param('id') id: string,
    ): Promise<{ clientSecret: string }> {
      return this.management.rotateSecret(id);
    }
  }