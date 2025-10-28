import React from "react";
import { Link, useNavigate} from "react-router-dom";
import "./Header.css";
import MainLogo from "./MainLogo";
import { useAuth } from "../../context/auth";


function Header() {

const { user, logout } = useAuth(); // Obtén el usuario y la función logout

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/'); // Opcional: redirige al home después del logout
    };

  return (
    <header className="main-header">
      <MainLogo/>
      <nav>
                {user ? (
                    // Si el usuario existe (está logueado)
                    <>
                        <span>Bienvenido, {user.name}!</span>   
                        <Link to="/profile">  Mi perfil  </Link>   
                        <button onClick={handleLogout} className="logout-button">  Cerrar sesion  </button>
                    </>
                ) : (
                    // Si el usuario es null (no está logueado)
                    <>
                        <Link to="/login">Iniciar Sesión</Link>
                    </>
                )}
            </nav>
    </header>
  );
}

export default Header;
