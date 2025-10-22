import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

  const login = async (email, password) => {
    await axios.get("sanctum/csrf-cookie");

    await axios.post("/login", {
      email,
      password,
    });

    const { data } = await axios.get("/api/user");
    setUser(data);
  };

  const register = async (name, email, password, password_confirmation) => {
    await axios.get("/sanctum/csrf-cookie");
    await axios.post("/register", {
      name,
      email,
      password,
      password_confirmation,
    });

    // Después del registro, hacemos login para obtener los datos
    await login(email, password);
  };
  const logout = async () => {
    try {
      await axios.post("/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null); // Siempre quitamos al usuario del estado, incluso si falla el logout en backend
    }
  };

  // Asegúrate de añadir `logout` al valor del Provider
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente en otros componentes
export const useAuth = () => useContext(AuthContext);
