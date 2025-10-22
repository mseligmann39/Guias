import { useState } from "react";
import axios from "axios";
// Importamos el contexto que definimos en el otro archivo
import { AuthContext } from "./auth.js";

// 1. La URL base de la API (ej: http://127.0.0.1:8000/api)
const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, ""); // Quita la barra final si existe

// 2. La URL base del backend (ej: http://127.0.0.1:8000)
// Usaremos esto SOLO para la cookie CSRF
const backendBaseUrl = apiBaseUrl.replace("/api", ""); // Da "http://127.0.0.1:8000"

// Configuración por defecto de Axios:
axios.defaults.withCredentials = true;
axios.defaults.baseURL = apiBaseUrl; // <-- Todo usará /api por defecto

console.log("Configurando Axios con BaseURL (API):", apiBaseUrl);
console.log("URL de Backend (para CSRF):", backendBaseUrl);

// Esta es ahora la ÚNICA exportación del archivo
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Función separada para la cookie

  const getCsrfToken = async () => {
    try {
      // Llama a la URL de backend (sin /api) para la cookie
      await axios.get(`${backendBaseUrl}/sanctum/csrf-cookie`);
    } catch (error) {
      console.error("Error al obtener la cookie CSRF:", error); // Si esto falla (404, 403), el login/register fallará con 419.
      throw new Error(
        "No se pudo obtener la cookie CSRF. ¿El backend está corriendo y CORS está bien configurado?"
      );
    }
  };

  const login = async (loginId, password) => {
    try {
      // 1. Obtener cookie (de la URL web)
      await getCsrfToken(); // 2. Intentar Login (usa la baseURL /api)

      await axios.post("/login", {
        // Llama a /api/login
        login_id: loginId,
        password,
      }); // 3. Obtener datos del usuario (usa la baseURL /api)

      const { data } = await axios.get("/user"); // Llama a /api/user
      setUser(data);
    } catch (error) {
      console.error("Error en el login:", error);
      setUser(null);
      throw error;
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      // 1. Obtener cookie (de la URL web)
      await getCsrfToken(); // 2. Registrar (usa la baseURL /api)
      await axios.post("/register", {
        // Llama a /api/register
        name,
        email,
        password,
        password_confirmation,
      }); // 3. Hacemos login (que ya obtiene el usuario)

      await login(email, password);
    } catch (error) {
      console.error("Error en el registro:", error);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // 1. Obtener cookie (de la URL web)
      await getCsrfToken(); // 2. Logout (usa la baseURL /api)
      await axios.post("/logout"); // Llama a /api/logout
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    // Usamos el AuthContext importado
    <AuthContext.Provider value={{ user, login, register, logout }}>
       {children} {" "}
    </AuthContext.Provider>
  );
};

// Ya no hay 'export const useAuth' aquí.
// La única exportación es 'AuthProvider'.
