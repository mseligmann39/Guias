import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  console.log(
    "Configurando Axios con BaseURL:",
    import.meta.env.VITE_API_BASE_URL
  );

  const login = async (loginId, password) => {
    console.log("Axios baseURL en login:", axios.defaults.baseURL);

    try {
      // 1. Obtener cookie
      await axios.get(
        `${import.meta.env.VITE_API_BASE_URL.replace(
          "/api/",
          ""
        )}/sanctum/csrf-cookie`
      );

      // 2. Intentar Login
      await axios.post("/login", {
  login_id: loginId, // <-- CORREGIDO
  password,
});

      // 3. Si el login tuvo éxito, obtener datos del usuario
      const { data } = await axios.get("/user");
      setUser(data);
      
    } catch (error) {
      // 4. Si algo falla (ej. contraseña incorrecta 422, o 401)
      console.error("Error en el login:", error);
      // Aquí podrías manejar el estado de error para mostrarlo en la UI
      setUser(null); // Asegurarse de que el usuario no esté seteado
      throw error; // Lanzar el error para que el componente (LoginPage) lo atrape
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    await axios.get(
        `${import.meta.env.VITE_API_BASE_URL.replace(
          "/api/",
          ""
        )}/sanctum/csrf-cookie`
      );
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
