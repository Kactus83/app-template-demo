import { Controller, Post, Get, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { Contract } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ContractService } from '../services/contract.service';

/**
 * Contrôleur des contrats Web3.
 *
 * Ce contrôleur permet de gérer les opérations sur les contrats :
 * - Création d'un nouveau contrat
 * - Récupération d'un contrat par nom ou par adresse
 * - Récupération de la liste de tous les contrats
 * - Mise à jour d'un contrat existant
 * - Suppression d'un contrat
 *
 * @example
 * // Pour créer un contrat, envoyer une requête POST à /contracts avec { name, address, abi }
 */
@ApiTags('WEB3 - Contracts')
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  /**
   * Créer un nouveau contrat.
   *
   * @param body - Objet contenant le nom, l'adresse et l'ABI du contrat.
   * @returns Un objet contenant un message de succès et le contrat créé.
   */
  @Post()
  @ApiOperation({ summary: 'Créer un nouveau contrat' })
  @ApiResponse({ status: 201, description: 'Contrat créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async createContract(@Body() body: { name: string; address: string; abi: any }): Promise<{ message: string; contract: Contract }> {
    try {
      const { name, address, abi } = body;
      const createdContract = await this.contractService.createContract(name, address, abi);
      return { message: 'Contrat créé avec succès', contract: createdContract };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Récupérer un contrat par son nom.
   *
   * @param name - Nom du contrat.
   * @returns Le contrat correspondant.
   */
  @Get('/:name')
  @ApiOperation({ summary: 'Récupérer un contrat par son nom' })
  @ApiResponse({ status: 200, description: 'Contrat récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Contrat non trouvé' })
  @ApiParam({ name: 'name', description: 'Nom du contrat', example: 'MonContrat' })
  async getContractByName(@Param('name') name: string): Promise<Contract> {
    const contract = await this.contractService.getContractByName(name);
    if (!contract) throw new HttpException('Contrat non trouvé', HttpStatus.NOT_FOUND);
    return contract;
  }

  /**
   * Récupérer un contrat par son adresse.
   *
   * @param address - Adresse du contrat.
   * @returns Le contrat correspondant.
   */
  @Get('/address/:address')
  @ApiOperation({ summary: 'Récupérer un contrat par son adresse' })
  @ApiResponse({ status: 200, description: 'Contrat récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Contrat non trouvé' })
  @ApiParam({ name: 'address', description: "Adresse du contrat", example: "0xAbc123..." })
  async getContractByAddress(@Param('address') address: string): Promise<Contract> {
    const contract = await this.contractService.getContractByAddress(address);
    if (!contract) throw new HttpException('Contrat non trouvé', HttpStatus.NOT_FOUND);
    return contract;
  }

  /**
   * Récupérer la liste de tous les contrats.
   *
   * @returns Un tableau de contrats.
   */
  @Get()
  @ApiOperation({ summary: 'Lister tous les contrats' })
  @ApiResponse({ status: 200, description: 'Contrats récupérés avec succès' })
  async getAllContracts(): Promise<Contract[]> {
    return await this.contractService.getAllContracts();
  }

  /**
   * Mettre à jour un contrat existant.
   *
   * @param id - Identifiant du contrat.
   * @param data - Données partielles à mettre à jour.
   * @returns Le contrat mis à jour.
   */
  @Put('/:id')
  @ApiOperation({ summary: 'Mettre à jour un contrat existant' })
  @ApiResponse({ status: 200, description: 'Contrat mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Contrat non trouvé' })
  @ApiParam({ name: 'id', description: "Identifiant du contrat", example: 1 })
  async updateContract(@Param('id') id: number, @Body() data: Partial<Contract>): Promise<Contract> {
    const updatedContract = await this.contractService.updateContract(id, data);
    if (!updatedContract) throw new HttpException('Contrat non trouvé', HttpStatus.NOT_FOUND);
    return updatedContract;
  }

  /**
   * Supprimer un contrat.
   *
   * @param id - Identifiant du contrat à supprimer.
   * @returns Un objet contenant un message de succès et le contrat supprimé.
   */
  @Delete('/:id')
  @ApiOperation({ summary: 'Supprimer un contrat' })
  @ApiResponse({ status: 200, description: 'Contrat supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Contrat non trouvé' })
  @ApiParam({ name: 'id', description: "Identifiant du contrat", example: 1 })
  async deleteContract(@Param('id') id: number): Promise<{ message: string; contract: Contract }> {
    const deletedContract = await this.contractService.deleteContract(id);
    if (!deletedContract) throw new HttpException('Contrat non trouvé', HttpStatus.NOT_FOUND);
    return { message: 'Contrat supprimé avec succès', contract: deletedContract };
  }
}
