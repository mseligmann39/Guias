import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo.png";

function Header() {
  return (
    <header className="main-header">
      <div className="logo-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>
      {/* <nav className='main=nav'>
                <ul>
                    <li><Link to='/guides'>Guias</Link></li>
                    <li><Link to='/games'>Juegos</Link></li>
                    <li><Link to='/about'>Sobre nosotros</Link></li>
                    <li><Link to='/contact'>Contacto</Link></li>
                </ul>
            </nav> */}

      <div className="user-actions">
        <button className="login-button">Iniciar sesión</button>
      </div>
    </header>
  );
}

export default Header;
