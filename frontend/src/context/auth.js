import { createContext, useContext } from "react";

// 1. Definir el contexto
export const AuthContext = createContext();

// 2. Definir el hook para consumir el contexto
export const useAuth = () => useContext(AuthContext);