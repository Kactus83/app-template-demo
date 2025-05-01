import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { Web3CommonModule } from './common/web3-common.module';
import { TokenModule } from './modules/token/token.module';
import { NFTModule } from './modules/nft/nft.module';
import { TokenSaleModule } from './modules/token-sale/token-sale.module';
import { MultiVaultModule } from './modules/multivault/multivault.module';

@Module({
  imports: [
    Web3CommonModule,
    RouterModule.register([
      { path: 'web3', module: TokenModule },
      { path: 'web3', module: NFTModule },
      { path: 'web3', module: TokenSaleModule },
      { path: 'web3', module: MultiVaultModule },
    ]),
    TokenModule,
    NFTModule,
    TokenSaleModule,
    MultiVaultModule,
  ],
})
export class Web3Domain {}
