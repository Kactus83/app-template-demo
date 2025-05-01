import { Request } from 'express';
import { LoginResponseDto } from 'src/domains/auth/common/models/dto/login-response.dto';

export interface IOAuthRequest extends Request {
  user?: LoginResponseDto;
}