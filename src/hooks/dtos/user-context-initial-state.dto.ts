import { Dispatch, SetStateAction } from 'react';
import { LoginResponseDto } from '../../shared/dtos/login-response.dto';

export interface UserContextInitialStateDto {
  user: LoginResponseDto | null;
  setUser?: Dispatch<SetStateAction<null>>;
}