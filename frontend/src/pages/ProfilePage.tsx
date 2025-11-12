import { useAuth } from '../context/auth'; 
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header'; 
import UserGuides from '../components/UserGuides';
import UserLists from '../components/UserList';

/**
 * Componente de la página de perfil del usuario.
 * Muestra la información del usuario y sus guías.
 */
function ProfilePage() {
  // Obtenemos el objeto 'user' y el estado 'loading' del contexto de autenticación.
  // 'userLoading' indica si el contexto de autenticación está cargando la información del usuario.
  const { user, loading: userLoading } = useAuth();

  // Si el contexto de autenticación está cargando la información del usuario,
  // mostramos un mensaje de carga.
  if (userLoading) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto p-6 text-center text-[var(--color-text-primary)] p-8">
          Cargando perfil...
        </div>
      </>
    );
  }

  // Si el contexto de autenticación terminó de cargar y no hay un usuario autenticado,
  // mostramos un mensaje indicando que se necesita iniciar sesión.
  if (!user) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded text-center">
            Necesitas iniciar sesión para ver tu perfil.
          </div>
        </div>
      </>
    );
  }

  // Si hay un usuario autenticado y la información ha terminado de cargar,
  // renderizamos la página de perfil.
  return (
    <>
      {/* Componente de cabecera de la página */}
      <Header /> 
      <main className="max-w-4xl mx-auto p-6">
        {/* Título de la página de perfil, mostrando el nombre del usuario */}
        <h1 className="text-3xl font-bold text-center text-[var(--color-primary)] mb-8">
          Perfil de {user.name}
        </h1>
        
        {/* Sección para mostrar la información básica de la cuenta del usuario */}
        <section className="bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 pb-2 border-b border-[var(--color-accent)]">
            Información de la cuenta
          </h2>
          <div className="space-y-3 text-[var(--color-text-primary)]">
            <p>
              <span className="font-medium">Nombre:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            {/* Botón para editar el perfil */}
            <div className="mt-4">
              <Link 
                to="/edit-profile" 
                className="inline-block px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-primary)] font-medium rounded hover:bg-opacity-90 transition-all hover:shadow-[0_0_15px_rgba(231,0,0,0.3)]"
              >
                Editar perfil
              </Link>
            </div>
          </div>
        </section>

         {/* Componente que muestra las listas del usuario (favoritos, por hacer, completados) */}
        <UserLists />
        
        {/* Componente que muestra las guías creadas por el usuario */}
        <UserGuides />

       
    
      </main>
    </>
  );
}

export default ProfilePage;
