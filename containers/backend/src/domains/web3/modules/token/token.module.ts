import { Module } from '@nestjs/common';
import { TokenController } from './controllers/token.controller';
import { TokenService } from './services/token.service';
import { Web3CommonModule } from '../../common/web3-common.module';

@Module({
  imports: [Web3CommonModule],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
