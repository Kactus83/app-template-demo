import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PasswordResetService } from '../services/password-reset.service';
import { ResetPasswordDto } from '../models/dto/passwordReset.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestPasswordResetDto } from '../models/dto/request-password-reset.dto';

@ApiTags('AUTH - Password Reset')
@Controller('')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  async requestPasswordReset(@Body() passwordResetDto: RequestPasswordResetDto): Promise<{ message: string }> {
    try {
      await this.passwordResetService.requestPasswordReset(passwordResetDto);
      return { message: 'Password reset email sent' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password has been reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    try {
      await this.passwordResetService.resetPassword(resetPasswordDto);
      return { message: 'Password has been reset successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
