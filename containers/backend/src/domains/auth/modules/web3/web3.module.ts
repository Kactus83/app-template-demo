import { Module, forwardRef } from '@nestjs/common';
import { Web3AuthController } from './controllers/web3-auth.controller';
import { Web3AuthService } from './services/web3-auth.service';
import { NonceRepository } from './repositories/nonce.repository';
import { Web3AccountRepository } from './repositories/web3-account.repository';
import { ConfigModule } from '@nestjs/config';
import { CommunicationDomain } from '../../../../domains/communication/communication.domain';
import { Web3MFAService } from './services/web3-mfa.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    forwardRef(() => CommonModule),
    forwardRef(() => CommunicationDomain),
    ConfigModule,
  ],
  controllers: [Web3AuthController],
  providers: [Web3AuthService, NonceRepository, Web3AccountRepository, Web3MFAService],
  exports: [Web3MFAService],
})
export class Web3Module {}
