import { useAuth } from '../context/auth'; 
import Header from '../components/layout/Header'; 
import './ProfilePage.css'; // Archivo de estilos para la página de perfil
import UserGuides from '../components/UserGuides';

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
    return <><Header /><div className="profile-status">Cargando perfil...</div></>;
  }

  // Si el contexto de autenticación terminó de cargar y no hay un usuario autenticado,
  // mostramos un mensaje indicando que se necesita iniciar sesión.
  if (!user) {
     return <><Header /><div className="profile-status">Necesitas iniciar sesión para ver tu perfil.</div></>;
  }

  // Si hay un usuario autenticado y la información ha terminado de cargar,
  // renderizamos la página de perfil.
  return (
    <>
      {/* Componente de cabecera de la página */}
      <Header /> 
      <main className="profile-page-container">
        {/* Título de la página de perfil, mostrando el nombre del usuario */}
        <h1> Perfil de {user.name}</h1>
        {/* Sección para mostrar la información básica de la cuenta del usuario */}
        <section className="profile-info section-card">
          <h2>Información de la cuenta</h2>
          <p>
            <strong>Nombre:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {/* Botón para editar el perfil (funcionalidad pendiente) */}
          <button onClick={() => alert("Funcion pendiente")}>
            Editar perfil
          </button>
        </section>
        {/* Componente que muestra las guías creadas por el usuario */}
        <UserGuides />

    
      </main>
    </>
  );
}

export default ProfilePage;
