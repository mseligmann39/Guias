import { createContext, useContext } from 'react';
import type { User } from '@/types';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<unknown>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}