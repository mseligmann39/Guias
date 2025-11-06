/* 

 * Este componente se encarga de renderizar el logo principal de la p gina.

 */
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom';

const MainLogo = () => {

  return (
    <div className="flex items-center">
      {/* Enlace a la p gina principal */}
      <Link to="/" className="font-[var(--font-heading)] text-2xl text-[var(--color-text-primary)] no-underline">
        {/* Imagen del logo */}
        <img src={logo} alt="Logo" className="w-[150px] h-auto" />
      </Link>
    </div>
  );
}

export default MainLogo;

