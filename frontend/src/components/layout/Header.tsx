// Componente que representa el header principal de la aplicación
// Importamos las librerías necesarias
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLogo from "./MainLogo";
import { useAuth } from "../../context/auth";
import SearchBar from "../ui/SearchBar";

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
    <header className="flex justify-between items-center py-4 px-8 bg-[var(--color-background)] border-b border-[var(--color-accent)] w-full box-border">
      <MainLogo/>
      <SearchBar/>
      <nav className="flex items-center gap-6">
        {
          // Si el usuario existe (está logueado)
          user ? (
            // Mostramos el nombre del usuario y los enlaces a su perfil y para cerrar la sesión
            <>
              <span className="text-[var(--color-text-secondary)]">Bienvenido, {user.name}!</span>
              <Link to="/profile" className="flex items-center justify-center w-10 h-10 text-2xl bg-[var(--color-accent)] rounded-full transition-transform duration-200 hover:scale-110">
                {user.profileIcon || '👤'}
              </Link>
              <button onClick={handleLogout} className="bg-transparent text-[var(--color-text-primary)] border border-[var(--color-primary)] py-2 px-4 rounded cursor-pointer font-[var(--font-body)] transition-all duration-200 hover:bg-[var(--color-primary)] hover:text-[var(--color-text-primary)]">  Cerrar sesion  </button>
            </>
          ) : (
            // Si el usuario es null (no está logueado)
            // Mostramos el enlace para iniciar sesión
            <>
              <Link to="/login" className="text-[var(--color-text-secondary)] no-underline text-base transition-colors duration-200 hover:text-[var(--color-primary)]">Iniciar Sesión</Link>
            </>
          )
        }
      </nav>
    </header>
  );
}

// Exportamos el componente Header
export default Header;

