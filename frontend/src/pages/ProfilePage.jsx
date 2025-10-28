import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/auth'; 
import api from '../context/api'; 
import Header from '../components/layout/Header'; 
import './ProfilePage.css'; // (Tu archivo de estilos)

function ProfilePage() {
  // --- Parte 1: "Como en el Header" ---
  // Obtenemos el 'user' y el 'loading' del contexto.
  // No necesitamos un 'loading' local para el usuario, ya lo maneja el AuthContext.
  const { user, loading: userLoading } = useAuth(); //
  // --- Fin Parte 1 ---

  // --- Parte 2: Petición de *Nuevos* Datos (Guías) ---
  const [userGuides, setUserGuides] = useState([]);
  const [guidesLoading, setGuidesLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Solo intentamos cargar las guías si el usuario YA cargó y existe
    if (user) {
      api.get('/api/user/guides')
        .then(response => {
          setUserGuides(response.data);
        })
        .catch(err => {
          console.error("Error fetching user guides:", err);
          // Este es el error 401 que estamos viendo
          setError("No se pudieron cargar tus guías. (Error: " + err.message + ")");
        })
        .finally(() => {
          setGuidesLoading(false);
        });
    } else if (!userLoading) {
      // Si el usuario terminó de cargar y NO existe (es null)
      setGuidesLoading(false);
    }
  }, [user, userLoading]); // Se ejecuta cuando el estado del usuario cambie

  // --- Renderizado ---

  // Muestra "Cargando..." mientras el AuthContext está verificando al usuario
  if (userLoading) {
    return <><Header /><div className="profile-status">Cargando perfil...</div></>;
  }

  // Si terminó de cargar y NO hay usuario
  if (!user) {
     return <><Header /><div className="profile-status">Necesitas iniciar sesión para ver tu perfil.</div></>;
  }

  return (
    <>
      <Header />
      <main className="profile-page-container">
        <h1> Perfil de {user.name}</h1>
        <section className="profile-info section-card">
          <h2>Información de la cuenta</h2>
          <p>
            <strong>Nombre:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <button onClick={() => alert("Funcion pendiente")}>
            Editar perfil
          </button>
        </section>
        <section className="user-guides section-card">
          <h2>Mis guias ({userGuides.length})</h2>
          {guidesLoading && <div className="profile-status">Cargando guías...</div>}
            {error && <div className="error-message">{error}</div>}

            {userGuides.length > 0 ? (
                <ul>
                    {userGuides.map(guide=>(
                        <li key={guide.id}>
                            <a href={`/guides/${guide.id}`}>{guide.title}</a>
                            <span>Para {guide.game?.title || "Juego no encontrado"} </span>
                        </li>
                    ))}
                </ul>

            ): (
               <p>No tienes ninguna guia.</p>
            ) }
            <button onClick={() => alert("Crear guia pendiente")}>Crear guia</button>
        </section>
      </main>
    </>
  );
}

export default ProfilePage;
