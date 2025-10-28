// auth.js
import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Cambia la importación

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};