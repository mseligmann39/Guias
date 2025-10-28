// Importamos la función useContext de React y el contexto AuthContext
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Exportamos una función que devuelve el contexto de autenticación actual
export const useAuth = () => {
  // Obtenemos el contexto de autenticación actual
  const context = useContext(AuthContext);
  // Si el contexto es undefined, lanzamos un error
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  // Devolvemos el contexto
  return context;
};
