import { TokenResponseDto } from './token-response.dto';

export interface LoginResponseDto extends TokenResponseDto {
  refresh_token: string;
}