import { useState, FormEvent } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate, Link } from 'react-router-dom';
import MainLogo from '../components/layout/MainLogo';


/**
 * Página de registro de usuarios
 * @returns {JSX.Element} La página de registro con su formulario
 */
function RegisterPage() {
  // Estados para almacenar la información del formulario
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Función para obtener la función de registro del contexto
  const { register } = useAuth();

  // Función para navegar a otra página
  const navigate = useNavigate();

  // Función para manejar el submit del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    } catch (err: any) {
      // Si hay un error, lo mostramos en la pantalla
      setError( err.message + " Error al registrar. Verifica tus datos.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Logo centrado */}
        <div className="flex justify-center mb-8">
          <MainLogo/>
        </div>
        
        {/* Contenedor del formulario */}
        <div className="bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6 text-center">
            Crear Cuenta
          </h1>
          
          {/* Mensaje de error */}
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 text-red-200 rounded mb-6">
              {error}
            </div>
          )}
          
          {/* Formulario de registro */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-3 border border-[var(--color-accent)] rounded bg-[#1e1e1e] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                placeholder="Tu nombre completo"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 border border-[var(--color-accent)] rounded bg-[#1e1e1e] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 border border-[var(--color-accent)] rounded bg-[#1e1e1e] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Confirmar Contraseña
              </label>
              <input
                id="confirm-password"
                type="password"
                value={passwordConfirmation}
                onChange={e => setPasswordConfirmation(e.target.value)}
                className="w-full p-3 border border-[var(--color-accent)] rounded bg-[#1e1e1e] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-primary)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all duration-200 hover:shadow-[0_0_15px_rgba(231,0,0,0.3)]"
              >
                Crear cuenta
              </button>
            </div>
            
            <div className="text-sm text-center text-[var(--color-text-secondary)]">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="font-medium text-[var(--color-primary)] hover:text-opacity-80 transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;