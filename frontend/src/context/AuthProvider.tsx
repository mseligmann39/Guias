import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api, { getCsrfCookie } from './api';
import { AuthContext, type AuthContextValue } from './AuthContext';
import type { User } from '@/types';

interface Props { children: React.ReactNode }

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Intentar obtener el usuario actual si existe un token guardado (token-based)
        const token = localStorage.getItem('token');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await api.get<User>('/me');
          setUser(res.data);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Si hay error 401 o cualquier otro, asumimos que no hay sesión
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, []);

  const login: AuthContextValue['login'] = async (email, password) => {
    try {
      // Sanctum SPA flow: get CSRF cookie then POST to web login route (/login)
      const csrfRes = await getCsrfCookie();
      console.log('sanctum/csrf-cookie response:', csrfRes && csrfRes.status);
      try {
        console.log('document.cookie before login:', typeof document !== 'undefined' ? document.cookie : 'no document');
      } catch (e) {
        console.warn('Cannot read document.cookie in this environment', e);
      }

      const res = await api.post<{ user: User; token: string }>('/login', { email, password });
      console.log('POST /login response status:', res.status, 'data:', res.data);
      const { token, user } = res.data;

      // Guardar el token en localStorage (opcional, token can be used for API calls)
      localStorage.setItem('token', token);

      // Actualizar el header de autorización para llamadas API
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout: AuthContextValue['logout'] = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      // Asegurarse que el token está en los headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Intentar hacer logout usando la ruta web (/logout) — Sanctum will use session cookie
      const logoutRes = await api.post('/logout');
      console.log('POST /logout response:', logoutRes && logoutRes.status, logoutRes && logoutRes.data);
      try {
        console.log('document.cookie after logout:', typeof document !== 'undefined' ? document.cookie : 'no document');
      } catch (e) {
        console.warn('Cannot read document.cookie in this environment', e);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const register: AuthContextValue['register'] = async (
    name,
    email,
    password,
    password_confirmation
  ) => {
    const res = await api.post<{ user: User }>('/register', {
      name,
      email,
      password,
      password_confirmation,
    });
    // Después del registro el backend puede devolver el usuario (y opcionalmente token)
    setUser(res.data.user);
  };

  const refreshUser: AuthContextValue['refreshUser'] = async () => {
    try {
      const res = await api.get<User>('/me');
      setUser(res.data);
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    refreshUser,
  } as AuthContextValue;
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;