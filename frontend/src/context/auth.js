// src/context/auth.js
import { useContext } from "react";
// Importa el contexto real desde donde se define el Provider
import { AuthContext } from "./AuthContext"; // Ajusta la ruta si es necesario

// El hook consume el contexto importado
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        // Es buena práctica añadir un error si se usa fuera del Provider
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};