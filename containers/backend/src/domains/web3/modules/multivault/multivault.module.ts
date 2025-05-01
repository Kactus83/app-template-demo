import { Module, forwardRef } from '@nestjs/common';
import { MultiVaultController } from './controllers/multivault.controller';
import { MultiVaultService } from './services/multivault.service';
import { Web3CommonModule } from '../../common/web3-common.module';

@Module({
  imports: [
    forwardRef(() => Web3CommonModule),
  ],
  controllers: [MultiVaultController],
  providers: [MultiVaultService],
  exports: [MultiVaultService],
})
export class MultiVaultModule {}
