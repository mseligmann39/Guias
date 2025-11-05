import React, { useEffect, useState } from 'react';
import api from './api';
import { AuthContext, type AuthContextValue } from './AuthContext';
import type { User } from '@/types';

interface Props { children: React.ReactNode }

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        await api.get('/sanctum/csrf-cookie');
        const res = await api.get<User>('/api/user');
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, []);

  const login: AuthContextValue['login'] = async (email, password) => {
    await api.get('/sanctum/csrf-cookie');
    const res = await api.post<{ user: User }>('/login', { email, password });
    setUser(res.data.user);
    return res.data;
  };

  const logout: AuthContextValue['logout'] = async () => {
    await api.post('/logout');
    setUser(null);
  };

  const register: AuthContextValue['register'] = async (
    name,
    email,
    password,
    password_confirmation
  ) => {
    await api.get('/sanctum/csrf-cookie');
    const res = await api.post<{ user: User }>('/register', {
      name,
      email,
      password,
      password_confirmation,
    });
    setUser(res.data.user);
    return res.data;
  };

  const value: AuthContextValue = { user, loading, login, logout, register };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;