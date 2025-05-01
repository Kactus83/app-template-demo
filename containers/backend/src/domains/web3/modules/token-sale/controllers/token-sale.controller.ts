import { Controller, Get, Post, Body, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { TokenSaleService } from '../services/token-sale.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { Web3UserRepository } from '../../../../../domains/web3/common/repositories/web3-user.repository';
import { SetTokenDto } from '../models/dto/set-token.dto';
import { SetRateDto } from '../models/dto/set-rate.dto';
import { WithdrawTokensDto } from '../models/dto/withdraw-tokens.dto';
import { WithdrawETHDto } from '../models/dto/withdraw-ETH.dto';

/**
 * Contrôleur de vente de tokens (TokenSale) pour le module WEB3.
 *
 * Ce contrôleur permet de :
 * - Définir l'adresse du contrat Token
 * - Définir le taux de vente (nombre de tokens par ETH)
 * - Retirer des ETH et des tokens vers le portefeuille de l'application
 * - Récupérer le taux de vente et l'adresse du contrat Token
 *
 * @example
 * // Pour définir l'adresse du token, envoyer une requête POST à /tokensale/setToken avec { token: "0xABC123..." }
 */
@ApiTags('WEB3 - TokenSale')
@ApiBearerAuth()
@Controller('tokensale')
@UseGuards(AuthGuard)
export class TokenSaleController {
  constructor(
    private readonly tokenSaleService: TokenSaleService,
    private readonly web3UserRepository: Web3UserRepository,
  ) {}

  /**
   * Définit l'adresse du contrat Token.
   *
   * Vérifie que l'utilisateur est authentifié et qu'il est propriétaire.
   *
   * @param req - Requête HTTP authentifiée.
   * @param setTokenDto - Données contenant l'adresse du token.
   * @returns Un objet avec un message de succès.
   */
  @Post('setToken')
  @ApiOperation({ summary: "Définir l'adresse du contrat Token" })
  @ApiResponse({ status: 200, description: "Adresse du token définie avec succès." })
  @ApiResponse({ status: 400, description: "L'adresse du token est requise." })
  @ApiResponse({ status: 401, description: "Non autorisé." })
  @ApiResponse({ status: 403, description: "Accès refusé, vous n'êtes pas le propriétaire." })
  @ApiResponse({ status: 500, description: "Erreur interne du serveur." })
  async setToken(
    @Req() req: IAuthenticatedRequest,
    @Body() setTokenDto: SetTokenDto
  ): Promise<{ message: string }> {
    try {
      if (!req.user) {
        throw new HttpException('Utilisateur non authentifié.', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.id;
      const user = await this.web3UserRepository.findById(userId);

      if (!user) {
        throw new HttpException('Utilisateur non trouvé.', HttpStatus.NOT_FOUND);
      }

      const ownerAddress = await this.tokenSaleService.getOwner();
      const userWallets = user.web3Accounts.map(account => account.wallet.toLowerCase());
      if (!userWallets.includes(ownerAddress.toLowerCase())) {
        throw new HttpException("Accès refusé. Vous n'êtes pas le propriétaire.", HttpStatus.FORBIDDEN);
      }

      const { token } = setTokenDto;
      if (!token) {
        throw new HttpException("L'adresse du token est requise.", HttpStatus.BAD_REQUEST);
      }

      await this.tokenSaleService.setToken(token);
      return { message: "Adresse du token définie avec succès." };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Erreur lors de la définition de l'adresse du token:", error);
      throw new HttpException('Erreur interne du serveur.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Définit le taux de vente (tokens par ETH).
   *
   * Vérifie que l'utilisateur est authentifié et propriétaire.
   *
   * @param req - Requête HTTP authentifiée.
   * @param setRateDto - Données contenant le nouveau taux.
   * @returns Un objet avec un message de succès.
   */
  @Post('setRate')
  @ApiOperation({ summary: 'Définir le taux de vente (tokens par ETH)' })
  @ApiResponse({ status: 200, description: 'Taux de vente défini avec succès.' })
  @ApiResponse({ status: 400, description: 'Le taux est requis.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: "Accès refusé, vous n'êtes pas le propriétaire." })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  async setRate(
    @Req() req: IAuthenticatedRequest,
    @Body() setRateDto: SetRateDto
  ): Promise<{ message: string }> {
    try {
      if (!req.user) {
        throw new HttpException('Utilisateur non authentifié.', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.id;
      const user = await this.web3UserRepository.findById(userId);

      if (!user) {
        throw new HttpException('Utilisateur non trouvé.', HttpStatus.NOT_FOUND);
      }

      const ownerAddress = await this.tokenSaleService.getOwner();
      const userWallets = user.web3Accounts.map(account => account.wallet.toLowerCase());
      if (!userWallets.includes(ownerAddress.toLowerCase())) {
        throw new HttpException("Accès refusé. Vous n'êtes pas le propriétaire.", HttpStatus.FORBIDDEN);
      }

      const { rate } = setRateDto;
      if (rate === undefined || rate === null) {
        throw new HttpException('Le taux est requis.', HttpStatus.BAD_REQUEST);
      }

      const rateBigInt = BigInt(rate);
      await this.tokenSaleService.setRate(rateBigInt);
      return { message: 'Taux de vente défini avec succès.' };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Erreur lors de la définition du taux de vente:", error);
      throw new HttpException('Erreur interne du serveur.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retire une certaine quantité d'ETH depuis le contrat.
   *
   * Vérifie que l'utilisateur est authentifié et propriétaire.
   *
   * @param req - Requête HTTP authentifiée.
   * @param withdrawETHDto - Données contenant le montant à retirer (en wei).
   * @returns Un objet avec un message de succès.
   */
  @Post('withdrawETH')
  @ApiOperation({ summary: "Retirer une certaine quantité d'ETH depuis le contrat" })
  @ApiResponse({ status: 200, description: 'ETH retiré avec succès.' })
  @ApiResponse({ status: 400, description: 'Le montant est requis.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: "Accès refusé, vous n'êtes pas le propriétaire." })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  async withdrawETH(
    @Req() req: IAuthenticatedRequest,
    @Body() withdrawETHDto: WithdrawETHDto
  ): Promise<{ message: string }> {
    try {
      if (!req.user) {
        throw new HttpException('Utilisateur non authentifié.', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.id;
      const user = await this.web3UserRepository.findById(userId);

      if (!user) {
        throw new HttpException('Utilisateur non trouvé.', HttpStatus.NOT_FOUND);
      }

      const ownerAddress = await this.tokenSaleService.getOwner();
      const userWallets = user.web3Accounts.map(account => account.wallet.toLowerCase());
      if (!userWallets.includes(ownerAddress.toLowerCase())) {
        throw new HttpException("Accès refusé. Vous n'êtes pas le propriétaire.", HttpStatus.FORBIDDEN);
      }

      const { amount } = withdrawETHDto;
      if (amount === undefined || amount === null) {
        throw new HttpException('Le montant est requis.', HttpStatus.BAD_REQUEST);
      }

      const amountBigInt = BigInt(amount);
      await this.tokenSaleService.withdrawETH(amountBigInt);
      return { message: 'ETH retiré avec succès.' };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Erreur lors du retrait d'ETH:", error);
      throw new HttpException('Erreur interne du serveur.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retire une certaine quantité de tokens depuis le contrat.
   *
   * Vérifie que l'utilisateur est authentifié et propriétaire.
   *
   * @param req - Requête HTTP authentifiée.
   * @param withdrawTokensDto - Données contenant le montant de tokens à retirer.
   * @returns Un objet avec un message de succès.
   */
  @Post('withdrawTokens')
  @ApiOperation({ summary: "Retirer une certaine quantité de tokens depuis le contrat" })
  @ApiResponse({ status: 200, description: 'Tokens retirés avec succès.' })
  @ApiResponse({ status: 400, description: 'Le montant est requis.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: "Accès refusé, vous n'êtes pas le propriétaire." })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  async withdrawTokens(
    @Req() req: IAuthenticatedRequest,
    @Body() withdrawTokensDto: WithdrawTokensDto
  ): Promise<{ message: string }> {
    try {
      if (!req.user) {
        throw new HttpException('Utilisateur non authentifié.', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.id;
      const user = await this.web3UserRepository.findById(userId);

      if (!user) {
        throw new HttpException('Utilisateur non trouvé.', HttpStatus.NOT_FOUND);
      }

      const ownerAddress = await this.tokenSaleService.getOwner();
      const userWallets = user.web3Accounts.map(account => account.wallet.toLowerCase());
      if (!userWallets.includes(ownerAddress.toLowerCase())) {
        throw new HttpException("Accès refusé. Vous n'êtes pas le propriétaire.", HttpStatus.FORBIDDEN);
      }

      const { amount } = withdrawTokensDto;
      if (amount === undefined || amount === null) {
        throw new HttpException('Le montant est requis.', HttpStatus.BAD_REQUEST);
      }

      const amountBigInt = BigInt(amount);
      await this.tokenSaleService.withdrawTokens(amountBigInt);
      return { message: 'Tokens retirés avec succès.' };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Erreur lors du retrait de tokens:", error);
      throw new HttpException('Erreur interne du serveur.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Récupère le taux de vente actuel (nombre de tokens par ETH).
   *
   * @returns Un objet contenant le taux de vente sous forme de chaîne.
   */
  @Get('rate')
  @ApiOperation({ summary: 'Obtenir le taux de vente actuel (tokens par ETH)' })
  @ApiResponse({ status: 200, description: 'Taux de vente récupéré avec succès.' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  async getRate(): Promise<{ rate: string }> {
    try {
      const rate = await this.tokenSaleService.getRate();
      return { rate: rate.toString() };
    } catch (error: any) {
      console.error("Erreur lors de la récupération du taux de vente:", error);
      throw new HttpException('Erreur interne du serveur.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Récupère l'adresse du contrat Token.
   *
   * @returns Un objet contenant l'adresse du contrat Token.
   */
  @Get('tokenAddress')
  @ApiOperation({ summary: "Obtenir l'adresse du contrat Token" })
  @ApiResponse({ status: 200, description: "Adresse du contrat Token récupérée avec succès." })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  async getTokenAddress(): Promise<{ tokenAddress: string }> {
    try {
      const tokenAddress = await this.tokenSaleService.getTokenAddress();
      return { tokenAddress };
    } catch (error: any) {
      console.error("Erreur lors de la récupération de l'adresse du token:", error);
      throw new HttpException('Erreur interne du serveur.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
