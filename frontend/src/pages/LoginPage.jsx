import { useState } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import MainLogo from '../components/layout/MainLogo';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError("Error al iniciar sesión.");
    }
  };

  return (
    <>
    
    <MainLogo/>
    <h1>Iniciar Sesión</h1>
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button type="submit">Iniciar sesión</button>
      <p>¿No tienes una cuenta? <a href="/register">Regístrate aquí</a></p>
    </form>
  </>);
}

export default LoginPage;