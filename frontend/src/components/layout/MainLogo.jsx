import './MainLogo.css'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom';     

const MainLogo = () => {

return<div className="logo-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>;
}

export default MainLogo

