
import { createContext, useState } from 'react';
import axios from 'axios';

// Exporta el contexto para que el hook lo importe
export const AuthContext = createContext();

// Define la URL base del backend SIN /api
const backendUrl = 'http://localhost:8000'; 
// Define la URL base de la API CON /api
const apiUrl = `${backendUrl}/api`; 

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Configura Axios para enviar cookies
    axios.defaults.withCredentials = true;
    // YA NO establecemos baseURL globalmente
    // axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

    const login = async (email, password) => {
        // Usa la URL base del backend para csrf-cookie y login
        await axios.get(`${backendUrl}/sanctum/csrf-cookie`); 
        await axios.post(`${backendUrl}/login`, { email, password }); 

        // Usa la URL de la API para obtener datos del usuario
        const { data } = await axios.get(`${apiUrl}/user`); 
        setUser(data);
    };

    const register = async (name, email, password, password_confirmation) => {
        // Usa la URL base del backend
        await axios.get(`${backendUrl}/sanctum/csrf-cookie`); 
        await axios.post(`${backendUrl}/register`, { name, email, password, password_confirmation }); 

        // Reutiliza la función login (que ya maneja URLs correctas)
        await login(email, password);
    };

    const logout = async () => {
        try {
            // Usa la URL base del backend
            await axios.post(`${backendUrl}/logout`); 
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};