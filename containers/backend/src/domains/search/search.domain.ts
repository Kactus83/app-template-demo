import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UserSearchModule } from './modules/user-search/user-search.module';
import { SearchCommonModule } from './common/search-common.module';

@Module({
  imports: [
    SearchCommonModule,
    RouterModule.register([
      { path: 'search', module: UserSearchModule },
    ]),
    UserSearchModule,
  ],
})
export class SearchDomain {}
