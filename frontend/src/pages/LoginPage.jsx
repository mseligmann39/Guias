import { useState } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import MainLogo from '../components/layout/MainLogo';


function LoginPage() {
  // Estados para almacenar la información del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth(); // Función para iniciar sesión del contexto
  const navigate = useNavigate(); // Función para redirigir al usuario después del login

  /**
   * Función para manejar el submit del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Intentamos iniciar sesión
      await login(email, password);
      // Si se inicia con éxito, navegar a la página principal
      navigate('/');
    } catch (err) {
      // Si hay un error, lo mostramos en la pantalla
      setError(err + "Error al iniciar sesión.");
    }
  };

  return (
    <>
      {/* Componente MainLogo */}
      <MainLogo/>
      {/* Título de la página */}
      <h1>Iniciar Sesión</h1>
      {/* Formulario de inicio de sesión */}
      <form onSubmit={handleSubmit}>
        {/* Input para el email */}
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        {/* Input para la contraseña */}
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
        {/* Mostramos el error en la pantalla si hay uno */}
        {error && <p style={{color: 'red'}}>{error}</p>}
        {/* Botón para enviar el formulario */}
        <button type="submit">Iniciar sesión</button>
        {/* Enlace para registrar una cuenta */}
        <p>¿No tienes una cuenta? <a href="/register">Regístrate aquí</a></p>
      </form>
    </>);}

export default LoginPage;