/* 

 * Este componente se encarga de renderizar el logo principal de la p gina.

 */
import './MainLogo.css'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom';

const MainLogo = () => {

  return (
    <div className="logo-container">
      {/* Enlace a la p gina principal */}
      <Link to="/" className="logo">
        {/* Imagen del logo */}
        <img src={logo} alt="Logo" className="logo-img" />
      </Link>
    </div>
  );
}

export default MainLogo;

