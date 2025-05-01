import { Controller, Post, Get, Body, Param, Req, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { CreateVaultDto } from '../models/dto/createVault.dto';
import { DeleteVaultDto } from '../models/dto/deleteVault.dto';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { MultiVaultService } from '../services/multivault.service';
import { Web3UserRepository } from '../../../../../domains/web3/common/repositories/web3-user.repository';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

/**
 * Contrôleur du module MultiVault (WEB3).
 *
 * Ce contrôleur permet de gérer les opérations sur les vaults multi-portefeuilles :
 * - Création d'un vault
 * - Suppression d'un vault
 * - Récupération du type de vault
 * - Récupération des soldes ETH et Token
 * - Récupération des utilisateurs présents dans un vault
 *
 * Ces opérations nécessitent que l'utilisateur soit authentifié et propriétaire.
 */
@ApiTags('WEB3 - MultiVault')
@Controller('multiVault')
@UseGuards(AuthGuard)
export class MultiVaultController {
  constructor(
    private readonly multiVaultService: MultiVaultService,
    private readonly web3UserRepository: Web3UserRepository,
  ) {}

  /**
   * Créer un vault.
   *
   * Vérifie que l'utilisateur est authentifié et propriétaire, puis crée un vault avec les paramètres fournis.
   *
   * @param req - Requête HTTP authentifiée.
   * @param createVaultDto - Données de création du vault.
   * @returns Un objet contenant un message de succès.
   */
  @Post('createVault')
  @ApiOperation({ summary: 'Créer un vault' })
  @ApiResponse({ status: 201, description: 'Vault créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé. Vous n\'êtes pas le propriétaire.' })
  async createVault(@Req() req: IAuthenticatedRequest, @Body() createVaultDto: CreateVaultDto): Promise<{ message: string }> {
    if (!req.user) {
      throw new HttpException('Utilisateur non authentifié.', HttpStatus.UNAUTHORIZED);
    }

    const userId = req.user.id;
    const user = await this.web3UserRepository.findById(userId);
    if (!user) {
      throw new HttpException('Utilisateur non trouvé.', HttpStatus.NOT_FOUND);
    }

    const ownerAddress = await this.multiVaultService.getOwner();
    const userWallets = user.web3Accounts.map(account => account.wallet.toLowerCase());
    if (!userWallets.includes(ownerAddress.toLowerCase())) {
      throw new HttpException("Accès refusé. Vous n'êtes pas le propriétaire.", HttpStatus.FORBIDDEN);
    }

    const { name, acceptsETH, acceptsToken } = createVaultDto;
    if (!name || acceptsETH === undefined || acceptsToken === undefined) {
      throw new HttpException('name, acceptsETH et acceptsToken sont requis.', HttpStatus.BAD_REQUEST);
    }

    await this.multiVaultService.createVault(name, acceptsETH, acceptsToken);
    return { message: 'Vault créé avec succès.' };
  }

  /**
   * Supprimer un vault.
   *
   * Vérifie que l'utilisateur est authentifié et propriétaire, puis supprime le vault dont le nom est fourni.
   *
   * @param req - Requête HTTP authentifiée.
   * @param deleteVaultDto - Données de suppression du vault.
   * @returns Un objet contenant un message de succès.
   */
  @Post('deleteVault')
  @ApiOperation({ summary: 'Supprimer un vault' })
  @ApiResponse({ status: 200, description: 'Vault supprimé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Utilisateur non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé. Vous n\'êtes pas le propriétaire.' })
  async deleteVault(@Req() req: IAuthenticatedRequest, @Body() deleteVaultDto: DeleteVaultDto): Promise<{ message: string }> {
    if (!req.user) {
      throw new HttpException('Utilisateur non authentifié.', HttpStatus.UNAUTHORIZED);
    }

    const userId = req.user.id;
    const user = await this.web3UserRepository.findById(userId);
    if (!user) {
      throw new HttpException('Utilisateur non trouvé.', HttpStatus.NOT_FOUND);
    }

    const ownerAddress = await this.multiVaultService.getOwner();
    const userWallets = user.web3Accounts.map(account => account.wallet.toLowerCase());
    if (!userWallets.includes(ownerAddress.toLowerCase())) {
      throw new HttpException("Accès refusé. Vous n'êtes pas le propriétaire.", HttpStatus.FORBIDDEN);
    }

    const { name } = deleteVaultDto;
    if (!name) {
      throw new HttpException('name est requis.', HttpStatus.BAD_REQUEST);
    }

    await this.multiVaultService.deleteVault(name);
    return { message: 'Vault supprimé avec succès.' };
  }

  /**
   * Récupérer le type d'un vault.
   *
   * @param name - Nom du vault.
   * @returns Un objet contenant le type du vault.
   */
  @Get('getVaultType/:name')
  @ApiOperation({ summary: 'Récupérer le type d\'un vault' })
  @ApiResponse({ status: 200, description: 'Type de vault récupéré avec succès' })
  @ApiParam({ name: 'name', description: "Nom du vault", example: "MonVault" })
  async getVaultType(@Param('name') name: string): Promise<{ vaultType: string }> {
    if (!name) {
      throw new HttpException('name est requis dans les paramètres.', HttpStatus.BAD_REQUEST);
    }
    const vaultType = await this.multiVaultService.getVaultType(name);
    return { vaultType: vaultType.toString() };
  }

  /**
   * Récupérer le solde ETH d'un vault pour un utilisateur donné.
   *
   * @param name - Nom du vault.
   * @param user - Adresse de l'utilisateur.
   * @returns Un objet contenant le solde ETH.
   */
  @Get('getETHBalance/:name/:user')
  @ApiOperation({ summary: 'Récupérer le solde ETH d\'un vault pour un utilisateur' })
  @ApiResponse({ status: 200, description: 'Solde ETH récupéré avec succès' })
  @ApiParam({ name: 'name', description: "Nom du vault", example: "MonVault" })
  @ApiParam({ name: 'user', description: "Adresse de l'utilisateur", example: "0xUserAddress" })
  async getETHBalance(@Param('name') name: string, @Param('user') user: string): Promise<{ ethBalance: string }> {
    if (!name || !user) {
      throw new HttpException('name et user sont requis dans les paramètres.', HttpStatus.BAD_REQUEST);
    }
    const ethBalance = await this.multiVaultService.getETHBalance(name, user);
    return { ethBalance: ethBalance.toString() };
  }

  /**
   * Récupérer le solde de tokens d'un vault pour un utilisateur donné.
   *
   * @param name - Nom du vault.
   * @param user - Adresse de l'utilisateur.
   * @returns Un objet contenant le solde de tokens.
   */
  @Get('getTokenBalance/:name/:user')
  @ApiOperation({ summary: 'Récupérer le solde de tokens d\'un vault pour un utilisateur' })
  @ApiResponse({ status: 200, description: 'Solde de tokens récupéré avec succès' })
  @ApiParam({ name: 'name', description: "Nom du vault", example: "MonVault" })
  @ApiParam({ name: 'user', description: "Adresse de l'utilisateur", example: "0xUserAddress" })
  async getTokenBalance(@Param('name') name: string, @Param('user') user: string): Promise<{ tokenBalance: string }> {
    if (!name || !user) {
      throw new HttpException('name et user sont requis dans les paramètres.', HttpStatus.BAD_REQUEST);
    }
    const tokenBalance = await this.multiVaultService.getTokenBalance(name, user);
    return { tokenBalance: tokenBalance.toString() };
  }

  /**
   * Récupérer la liste des utilisateurs présents dans un vault.
   *
   * @param name - Nom du vault.
   * @returns Un objet contenant la liste des adresses utilisateurs.
   */
  @Get('getUsersInVault/:name')
  @ApiOperation({ summary: 'Récupérer la liste des utilisateurs dans un vault' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs récupérée avec succès' })
  @ApiParam({ name: 'name', description: "Nom du vault", example: "MonVault" })
  async getUsersInVault(@Param('name') name: string): Promise<{ users: string[] }> {
    if (!name) {
      throw new HttpException('name est requis dans les paramètres.', HttpStatus.BAD_REQUEST);
    }
    const users = await this.multiVaultService.getUsersInVault(name);
    return { users };
  }
}
