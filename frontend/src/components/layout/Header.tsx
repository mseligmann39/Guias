// Componente que representa el header principal de la aplicación
// Importamos las librerías necesarias
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import MainLogo from "./MainLogo";
import { useAuth } from "../../context/auth";

// Función que devuelve el componente Header
function Header() {

  // Obtenemos el usuario y la función logout
  const { user, logout } = useAuth();

  // Obtenemos la función navigate para redirigir al usuario después del logout
  const navigate = useNavigate();

  // Función que se encarga de cerrar la sesión
  const handleLogout = async () => {
    try {
      // Cerramos la sesión
      await logout();
      // Redirigimos al home después del logout
      navigate('/');
    } catch (error) {
      console.error('Error en handleLogout:', error);
      // Aquí podrías mostrar un mensaje al usuario si lo deseas
    }
  };

  return (
    <header className="main-header">
      <MainLogo/>
      <nav>
        {
          // Si el usuario existe (está logueado)
          user ? (
            // Mostramos el nombre del usuario y los enlaces a su perfil y para cerrar la sesión
            <>
              <span>Bienvenido, {user.name}!</span>
              <Link to="/profile">  Mi perfil  </Link>
              <button onClick={handleLogout} className="logout-button">  Cerrar sesion  </button>
            </>
          ) : (
            // Si el usuario es null (no está logueado)
            // Mostramos el enlace para iniciar sesión
            <>
              <Link to="/login">Iniciar Sesión</Link>
            </>
          )
        }
      </nav>
    </header>
  );
}

// Exportamos el componente Header
export default Header;

