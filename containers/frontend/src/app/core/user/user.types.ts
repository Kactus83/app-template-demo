import { UserDto } from "@custom/common/models/dto/user.dto";

export interface User extends UserDto {
    id: number;
    name: string;
    email: string;
    avatar: string;
    status: string;
}
