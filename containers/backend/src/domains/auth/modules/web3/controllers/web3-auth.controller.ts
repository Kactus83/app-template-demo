import { Controller, Post, Delete, Body, Param, Req, Res, HttpStatus, UseGuards, Logger, HttpException } from '@nestjs/common';
import { Web3AuthService } from '../services/web3-auth.service';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../../../../../core/models/dto/user.dto';
import { LoginResponseDto } from '../../../../../domains/auth/common/models/dto/login-response.dto';
import { Web3WalletSignatureDto } from '../models/dto/web3-wallet-signature.dto';

@ApiTags('AUTH - Web3')
@Controller('')
@UseGuards(AuthGuard)
export class Web3AuthController {
  private readonly logger = new Logger(Web3AuthController.name);

  constructor(private readonly web3AuthService: Web3AuthService) {}

  @Post('request-nonce')
  async requestNonce(@Body('wallet') wallet: string, @Res() res: Response): Promise<void> {
    try {
      const nonce = await this.web3AuthService.generateNonce(wallet);
      this.logger.log(`Nonce generated for wallet: ${wallet}`);
      res.status(HttpStatus.OK).json({ nonce });
    } catch (error) {
      this.logger.error('Error generating nonce:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @ApiResponse({ status: 200, description: 'Authentication successful.', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async authenticate(@Body() web3LoginDto: Web3WalletSignatureDto): Promise<LoginResponseDto> { 
    try {
      const { user, token } = await this.web3AuthService.authenticate(web3LoginDto.wallet, web3LoginDto.signature);
      this.logger.log(`Authentication successful for wallet: ${web3LoginDto.wallet}`);
      const userDto = plainToInstance(UserDto, user);
      return { user: userDto, token };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('add-wallet/request-nonce')
  async requestAddWalletNonce(@Req() req: IAuthenticatedRequest, @Body('wallet') wallet: string, @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const nonce = await this.web3AuthService.generateAddWalletNonce(userId, wallet);
      this.logger.log(`Add wallet nonce generated for user: ${userId}`);
      res.status(HttpStatus.OK).json({ nonce });
    } catch (error) {
      this.logger.error('Error generating add wallet nonce:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  @Post('add-wallet')
  async addWallet(@Req() req: IAuthenticatedRequest, @Body() web3AddWalletDto: Web3WalletSignatureDto, @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const web3Account = await this.web3AuthService.addWallet(userId, web3AddWalletDto.wallet, web3AddWalletDto.signature);
      this.logger.log(`Web3 wallet added for user: ${userId}`);
      res.status(HttpStatus.OK).json({ message: 'Web3 wallet added successfully', web3Account });
    } catch (error) {
      this.logger.error('Error adding wallet:', error.message);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Delete('remove-wallet/:wallet')
  async removeWallet(@Req() req: IAuthenticatedRequest, @Param('wallet') wallet: string, @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      await this.web3AuthService.removeWallet(userId, wallet);
      this.logger.log(`Web3 wallet removed for user: ${userId}`);
      res.status(HttpStatus.OK).json({ message: 'Web3 wallet removed successfully' });
    } catch (error) {
      this.logger.error('Error removing wallet:', error.message);
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}