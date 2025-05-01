import { Module } from '@nestjs/common';
import { TokenSaleController } from './controllers/token-sale.controller';
import { TokenSaleService } from './services/token-sale.service';
import { Web3CommonModule } from '../../common/web3-common.module';

@Module({
  imports: [Web3CommonModule],
  controllers: [TokenSaleController],
  providers: [TokenSaleService],
  exports: [TokenSaleService],
})
export class TokenSaleModule {}
