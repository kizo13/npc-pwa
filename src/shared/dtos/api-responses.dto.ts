import { NpcDto, UserDto } from './entities.dto';

export interface TokenResponseDto {
  access_token: string;
  data: UserDto;
}

export interface LoginResponseDto extends TokenResponseDto {
  refresh_token: string;
}

export interface PaginatedDto {
  data: unknown[];
  page: number;
  limit: number;
  totalCount: number;
}

export interface NpcsPaginatedDto extends PaginatedDto {
  data: NpcDto[];
}
