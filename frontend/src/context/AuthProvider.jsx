// AuthProvider.jsx
import React, { useState, useEffect } from "react";
import { AuthContext } from './AuthContext'; // Importa desde el nuevo archivo
import api from "./api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/api/user")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
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
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};