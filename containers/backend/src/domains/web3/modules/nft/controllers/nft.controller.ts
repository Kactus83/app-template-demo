import { Controller, Get, Param, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { NFTService } from '../services/nft.service';
import { Web3UserRepository } from '../../../../../domains/web3/common/repositories/web3-user.repository';

/**
 * Contrôleur des Non Fungible Tokens (NFT).
 *
 * Ce contrôleur permet d'obtenir, par exemple, le solde total de NFT ERC1155 pour un token donné.
 *
 * @example
 * // Envoi d'une requête GET à /nft/balance/1 pour obtenir le solde total du NFT ayant tokenId "1"
 */
@ApiTags('WEB3 - Non Fungible Tokens')
@ApiBearerAuth()
@Controller('nft')
@UseGuards(AuthGuard)
export class NFTController {
  constructor(
    private readonly nftService: NFTService,
    private readonly web3UserRepository: Web3UserRepository,
  ) {}

  /**
   * Récupère le solde total de NFT ERC1155 pour un tokenId donné.
   *
   * @param req - Requête HTTP authentifiée.
   * @param tokenId - Identifiant du token NFT.
   * @returns Un objet contenant le solde total sous forme de chaîne.
   * @throws Une exception HTTP en cas d'erreur (utilisateur non authentifié, utilisateur non trouvé, etc.).
   */
  @Get('balance/:tokenId')
  @ApiOperation({ summary: 'Obtenir le solde total de NFT ERC1155 pour un tokenId donné' })
  @ApiResponse({ status: 200, description: 'Solde total de NFT récupéré avec succès.' })
  @ApiResponse({ status: 400, description: 'Paramètres manquants ou tokenId invalide.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  @ApiParam({ name: 'tokenId', description: 'Identifiant du token NFT', example: "1" })
  async getTotalNFTBalance(
    @Req() req: IAuthenticatedRequest,
    @Param('tokenId') tokenId: string,
  ): Promise<{ balance: string }> {
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

      if (!tokenId) {
        throw new HttpException('tokenId est requis.', HttpStatus.BAD_REQUEST);
      }

      const tokenIdBigInt = BigInt(tokenId);
      const walletAddresses = user.web3Accounts.map(account => account.wallet);

      const totalBalance = await this.nftService.getTotalBalance(walletAddresses, tokenIdBigInt);

      return { balance: totalBalance.toString() };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Erreur lors de la récupération du solde total de NFTs:', error);
      throw new HttpException('Erreur interne du serveur.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
