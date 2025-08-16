'use client';
import { getToken, getUserCookies } from '@/services/auth';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AppContextType {
  userContext: User | null;
  setUserContext: Dispatch<SetStateAction<User | null>>;
  isAuth: boolean;
}

export const AppContext = createContext<AppContextType>({
    userContext: null,
    setUserContext: () => {},
    isAuth: false,
})

export const useAppContext = () => {
  return useContext(AppContext);
};
export default function AppProvider({ children }: { children: React.ReactNode }) {
  const accessToken = getToken('access_token');
  const isAuth = Boolean(accessToken);
  const [userContext, setUserContext] = useState<User | null>(null);

  useEffect(() => {
    const user = getUserCookies();
    setUserContext(user);
  }, []);

  return (
    <AppContext.Provider
      value={{
        userContext,
        setUserContext,
        isAuth
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
