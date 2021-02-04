import React, { createContext, useContext } from 'react';
import { LoginResponseDto } from '../shared/dtos/api-responses.dto';

interface UserContextInitialStateDto {
  user: LoginResponseDto | null;
  setUser: React.Dispatch<React.SetStateAction<LoginResponseDto | null>>;
}

export const UserContext = createContext<UserContextInitialStateDto | null>(null);

export const useUserContext = (): UserContextInitialStateDto => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('useUserContext must be used within the useUserContext.Provider');
  }
  return userContext;
};
