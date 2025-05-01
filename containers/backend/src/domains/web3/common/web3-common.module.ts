import { Module, forwardRef } from '@nestjs/common';
import { CommunicationDomain } from '../../../domains/communication/communication.domain';
import { ContractController } from './controllers/contract.controller';
import { ContractService } from './services/contract.service';
import { ContractRepository } from './repositories/contract.repository';
import { Web3UserRepository } from './repositories/web3-user.repository';
import { Web3Service } from './services/web3.service';

@Module({
  imports: [forwardRef(() => CommunicationDomain)],
  controllers: [ContractController],
  providers: [
    Web3Service,
    ContractService,
    ContractRepository,
    Web3UserRepository,
  ],
  exports: [
    Web3Service,
    ContractService,
    ContractRepository,
    Web3UserRepository,
  ],
})
export class Web3CommonModule {}
