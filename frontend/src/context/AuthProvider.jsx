// AuthProvider.jsx
import React, { useState, useEffect } from "react";
import { AuthContext } from './AuthContext'; // Importa desde el nuevo archivo
import api from "./api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Asegura cookies CSRF y de sesión antes de la primera llamada
        await api.get("/sanctum/csrf-cookie");
        const res = await api.get("/api/user");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email, password) => {
    await api.get("/sanctum/csrf-cookie");
    const res = await api.post("/login", { email, password });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
  };

  const register = async (name, email, password, password_confirmation) => {
    await api.get("/sanctum/csrf-cookie");
    const res = await api.post("/register", {
      name,
      email,
      password,
      password_confirmation,
    });
    setUser(res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};