import React, { createContext, useState, useEffect } from "react";
import api from "./api";

// Contexto para compartir la información de autenticación entre componentes
export const AuthContext = createContext();

// Proveedor de autenticación que envuelve a los componentes hijos
export const AuthProvider = ({ children }) => {
  // Estado para almacenar la información del usuario autenticado
  const [user, setUser] = useState(null);

  // Se utiliza para obtener la información del usuario autenticado
  // al montar el componente
  useEffect(() => {
    // Se obtiene la información del usuario autenticado
    api
      .get("/api/user")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    // Se obtiene el token CSRF
    await api.get("/sanctum/csrf-cookie");
    // Se envía la petición para iniciar sesión
    const res = await api.post("/login", { email, password });
    // Se actualiza el estado con la información del usuario autenticado
    setUser(res.data.user);
    // Se devuelve la respuesta
    return res.data;
  };

  // Función para cerrar sesión
  const logout = async () => {
    // Se envía la petición para cerrar sesión
    await api.post("/logout");
    // Se actualiza el estado con null para indicar que no hay usuario autenticado
    setUser(null);
  };

  // Función para registrar un usuario
  const register = async (name, email, password, password_confirmation) => {
    // Se obtiene el token CSRF
    await api.get("/sanctum/csrf-cookie");
    // Se envía la petición para registrar un usuario
    const res = await api.post("/register", {
      name,
      email,
      password,
      password_confirmation,
    });
    // Se actualiza el estado con la información del usuario autenticado
    setUser(res.data.user);
    // Se devuelve la respuesta
    return res.data;
  };

  // Se devuelve el contexto con la información del usuario autenticado y las funciones para iniciar sesión, cerrar sesión y registrar un usuario
  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
