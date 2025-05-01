import { Module } from '@nestjs/common';
import { SearchCommonModule } from '../../common/search-common.module';
import { UserSearchController } from './controllers/user-search.controller';
import { UserSearchService } from './services/user-search.service';
import { UserSearchRepository } from './repositories/user-search.repository';

@Module({
  imports: [SearchCommonModule],
  controllers: [UserSearchController],
  providers: [UserSearchService, UserSearchRepository],
  exports: [UserSearchService],
})
export class UserSearchModule {}
