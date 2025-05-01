import { Controller, Get, Post, Body, Req, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { Web3UserRepository } from '../../../../../domains/web3/common/repositories/web3-user.repository';
import { SetMaxSupplyDto } from '../models/dto/set-max-supply.dto';

/**
 * Contrôleur du token ERC20 (WEB3).
 *
 * Ce contrôleur permet de récupérer le solde total de tokens pour l'utilisateur authentifié,
 * et de définir la limite maximale d'approvisionnement du token.
 *
 * @example
 * // Envoi d'une requête GET à /token/balance pour obtenir le solde total des tokens de l'utilisateur
 */
@ApiTags('WEB3 - Token')
@ApiBearerAuth()
@Controller('token')
@UseGuards(AuthGuard)
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly web3UserRepository: Web3UserRepository,
  ) {}

  /**
   * Récupère le solde total du token ERC20 pour l'utilisateur authentifié.
   *
   * @param req - Requête HTTP authentifiée.
   * @returns Un objet contenant le solde total sous forme de chaîne.
   */
  @Get('balance')
  @ApiOperation({ summary: 'Obtenir le solde total du token ERC20 pour l\'utilisateur authentifié' })
  @ApiResponse({ status: 200, description: 'Solde total des tokens récupéré avec succès.' })
  @ApiResponse({ status: 400, description: "Aucun wallet Web3 associé à l'utilisateur." })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  async getTotalTokenBalance(@Req() req: IAuthenticatedRequest): Promise<{ balance: string }> {
    try {
      if (!req.user) {
        throw new HttpException('Utilisateur non authentifié.', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.id;
      const user = await this.web3UserRepository.findById(userId);

      if (!user) {
        throw new HttpException('Utilisateur non trouvé.', HttpStatus.NOT_FOUND);
      }

      if (user.web3Accounts.length === 0) {
        throw new HttpException('Aucun wallet Web3 associé à cet utilisateur.', HttpStatus.BAD_REQUEST);
      }

      const walletAddresses = user.web3Accounts.map(account => account.wallet);

      const totalBalance = await this.tokenService.getTotalBalance(walletAddresses);

      return { balance: totalBalance.toString() };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Erreur lors de la récupération du solde total de tokens:', error);
      throw new HttpException('Erreur interne du serveur.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Définit la nouvelle limite maximale d'approvisionnement du token.
   *
   * @param req - Requête HTTP authentifiée.
   * @param setMaxSupplyDto - Données contenant la nouvelle limite maximale.
   * @returns Un objet avec un message de succès.
   */
  @Post('set-max-supply')
  @ApiOperation({ summary: 'Définir la nouvelle limite maximale d\'approvisionnement' })
  @ApiResponse({ status: 200, description: 'Limite maximale définie avec succès.' })
  @ApiResponse({ status: 400, description: 'newMaxSupply est requis.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: "Accès refusé. Vous n'êtes pas le propriétaire." })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  async setMaxSupply(@Req() req: IAuthenticatedRequest, @Body() setMaxSupplyDto: SetMaxSupplyDto): Promise<{ message: string }> {
    try {
      if (!req.user) {
        throw new HttpException('Utilisateur non authentifié.', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.id;
      const user = await this.web3UserRepository.findById(userId);

      if (!user) {
        throw new HttpException('Utilisateur non trouvé.', HttpStatus.NOT_FOUND);
      }

      const ownerAddress = await this.tokenService.getOwner();
      const userWallets = user.web3Accounts.map(account => account.wallet.toLowerCase());
      if (!userWallets.includes(ownerAddress.toLowerCase())) {
        throw new HttpException("Accès refusé. Vous n'êtes pas le propriétaire.", HttpStatus.FORBIDDEN);
      }

      const { newMaxSupply } = setMaxSupplyDto;
      if (newMaxSupply === undefined || newMaxSupply === null) {
        throw new HttpException('newMaxSupply est requis.', HttpStatus.BAD_REQUEST);
      }

      const newMaxSupplyBigInt = BigInt(newMaxSupply);
      await this.tokenService.setMaxSupply(newMaxSupplyBigInt);

      return { message: "Limite maximale d'approvisionnement définie avec succès." };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Erreur lors de la définition de la limite maximale d\'approvisionnement:', error);
      throw new HttpException('Erreur interne du serveur.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Récupère le timestamp de la dernière mise à jour de la limite maximale d'approvisionnement.
   *
   * @returns Un objet contenant le timestamp sous forme de chaîne.
   */
  @Get('get-last-max-supply-changed')
  @ApiOperation({ summary: 'Obtenir le timestamp de la dernière mise à jour de la limite maximale' })
  @ApiResponse({ status: 200, description: 'Timestamp récupéré avec succès.' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  async getLastMaxSupplyChanged(): Promise<{ lastMaxSupplyChanged: string }> {
    try {
      const lastChanged = await this.tokenService.getLastMaxSupplyChanged();
      return { lastMaxSupplyChanged: lastChanged.toString() };
    } catch (error: any) {
      console.error('Erreur lors de la récupération du timestamp de la dernière mise à jour:', error);
      throw new HttpException('Erreur interne du serveur.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Récupère la limite maximale d'approvisionnement actuelle.
   *
   * @returns Un objet contenant la limite maximale sous forme de chaîne.
   */
  @Get('get-max-supply')
  @ApiOperation({ summary: 'Obtenir la limite maximale d\'approvisionnement actuelle' })
  @ApiResponse({ status: 200, description: 'Limite maximale récupérée avec succès.' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  async getMaxSupply(): Promise<{ maxSupply: string }> {
    try {
      const maxSupply = await this.tokenService.getMaxSupply();
      return { maxSupply: maxSupply.toString() };
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la limite maximale:', error);
      throw new HttpException('Erreur interne du serveur.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
