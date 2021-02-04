import { UserDto } from './user.dto';

export interface TokenResponseDto {
  access_token: string;
  data: UserDto;
}