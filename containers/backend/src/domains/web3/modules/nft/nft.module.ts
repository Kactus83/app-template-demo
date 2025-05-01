import { Module } from '@nestjs/common';
import { NFTController } from './controllers/nft.controller';
import { NFTService } from './services/nft.service';
import { Web3CommonModule } from '../../common/web3-common.module';

@Module({
  imports: [Web3CommonModule],
  controllers: [NFTController],
  providers: [NFTService],
  exports: [NFTService],
})
export class NFTModule {}
