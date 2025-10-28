import { useState } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate, Link } from 'react-router-dom';
import MainLogo from '../components/layout/MainLogo';


/**
 * Página de registro de usuarios
 * @returns {JSX.Element} La página de registro con su formulario
 */
function RegisterPage() {
  // Estados para almacenar la información del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);

  // Función para obtener la función de registro del contexto
  const { register } = useAuth();

  // Función para navegar a otra página
  const navigate = useNavigate();

  // Función para manejar el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // Verificamos que las contraseñas coincidan
    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Intentamos registrar al usuario
      await register(name, email, password, passwordConfirmation);
      // Si se registra con éxito, navegar a la página principal
      navigate('/');
    } catch (err) {
      // Si hay un error, lo mostramos en la pantalla
      setError( err + "Error al registrar. Verifica tus datos.");
    }
  };

  return (
    <div>
      
      {/* Componente MainLogo */}
      <MainLogo/>
      {/* Título de la página */}
      <h1>Registrarse</h1>
      {/* Formulario de registro */}
      <form onSubmit={handleSubmit}>
        {/* Input para el nombre */}
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" required />
        {/* Input para el email */}
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        {/* Input para la contraseña */}
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
        {/* Input para confirmar la contraseña */}
        <input type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} placeholder="Confirmar Contraseña" required />
        {/* Mostrar el error en caso de que haya */}
        {error && <p style={{color: 'red'}}>{error}</p>}
        {/* Botón para enviar el formulario */}
        <button type="submit">Registrarse</button>
      </form>
      {/* Enlace a la página de inicio de sesión */}
      <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
    </div>
  );
}
export default RegisterPage;