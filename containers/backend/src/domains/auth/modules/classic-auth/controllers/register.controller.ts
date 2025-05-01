import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterService } from '../services/register.service';
import { RegisterDto } from '../models/dto/register.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../../../../../core/models/dto/user.dto';

@ApiTags('AUTH - Register')
@Controller('')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Validation errors.' })
  async register(@Body() registerDto: RegisterDto): Promise<{ message: string; user: UserDto }> {
    try {
      const user = await this.registerService.register(registerDto);
      const userDto = plainToInstance(UserDto, user);
      return { message: 'User registered successfully', user: userDto };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}