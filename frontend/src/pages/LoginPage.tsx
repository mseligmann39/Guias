import { useState, FormEvent } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import MainLogo from '../components/layout/MainLogo';

/**
 * Página de inicio de sesión
 * @returns {JSX.Element} El formulario de inicio de sesión
 */
function LoginPage() {
  // Estados para almacenar la información del formulario
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth(); // Función para iniciar sesión del contexto
  const navigate = useNavigate(); // Función para redirigir al usuario después del login

  /**
   * Función para manejar el submit del formulario
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      // Intentamos iniciar sesión
      await login(email, password);
      // Si se inicia con éxito, navegar a la página principal
      navigate('/');
    } catch (err: any) {
      // Si hay un error, lo mostramos en la pantalla
      setError(
        (err && typeof err.message === "string"
          ? err.message + " "
          : "") + 
        "Error al iniciar sesión."
      );
    }
  };

  return (
    <>
      <div className="py-16 px-4">
        {/* Logo centrado */}
        <div className="flex justify-center mb-6">
          <MainLogo/>
        </div>
        {/* Contenedor del formulario */}
        <div className="max-w-md mx-auto bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg p-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6 text-center">Iniciar Sesión</h1>
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded mb-4">{error}</div>
          )}
          {/* Formulario de inicio de sesión */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Input para el email */}
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoComplete="email"
              className="p-3 border border-[var(--color-accent)] rounded text-base bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            />
            {/* Input para la contraseña */}
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              autoComplete="current-password"
              className="p-3 border border-[var(--color-accent)] rounded text-base bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            />
            {/* Botón para enviar el formulario */}
            <button
              type="submit"
              className="mt-2 p-3 bg-[var(--color-primary)] text-[var(--color-text-primary)] border-none rounded text-base cursor-pointer font-bold transition-all duration-200 hover:opacity-90 hover:shadow-[0_0_15px_rgba(231,0,0,0.5)]"
            >
              Iniciar sesión
            </button>
            {/* Enlace para registrar */}
            <p className="text-sm text-[var(--color-text-secondary)] text-center">
              ¿No tienes una cuenta?{' '}
              <a href="/register" className="text-[var(--color-primary)] hover:underline">Regístrate aquí</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;