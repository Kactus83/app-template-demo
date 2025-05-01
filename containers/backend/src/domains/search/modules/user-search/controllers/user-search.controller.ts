import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserSearchDto } from '../models/dto/user-search.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserSearchService } from '../services/user-search.service';

@ApiTags('SEARCH - Users')
@Controller('users')
export class UserSearchController {
  constructor(private readonly userSearchService: UserSearchService) {}

  @Post()
  @ApiOperation({ summary: 'Search users by query' })
  @ApiResponse({ status: 200, description: 'Users found successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or search error' })
  async searchUsers(@Body('query') query: string): Promise<UserSearchDto[]> {
    try {
      return await this.userSearchService.searchUsers(query);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
