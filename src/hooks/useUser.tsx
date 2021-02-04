import React, { createContext, useContext, useState } from 'react';
import { UserContextInitialStateDto } from './dtos/user-context-initial-state.dto';
 
const initialState: UserContextInitialStateDto = {
  user: null
};
const UserContext = createContext(initialState);
 
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
 
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
 
export const useUser = () => useContext(UserContext);