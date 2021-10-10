import { UserDto } from './entities.dto';

export interface TokenResponseDto {
  access_token: string;
  data: UserDto;
}

export interface LoginResponseDto extends TokenResponseDto {
  refresh_token: string;
}
