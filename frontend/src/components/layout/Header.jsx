import React from "react";
import { Link, useNavigate} from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";


function Header() {

const { user, logout } = useAuth(); // Obtén el usuario y la función logout

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/'); // Opcional: redirige al home después del logout
    };

  return (
    <header className="main-header">
      <div className="logo-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>
      <nav>
                {user ? (
                    // Si el usuario existe (está logueado)
                    <>
                        <span>Bienvenido, {user.name}!</span>
                        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
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
