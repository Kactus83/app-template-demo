import { UserDto } from "@custom/common/models/dto/user.dto";

export interface LoginResponseDto {
  user: UserDto;
  token: string;
}