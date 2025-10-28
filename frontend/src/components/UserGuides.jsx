import React, { useEffect, useState } from "react";
import api from "../context/api";
import { useAuth } from '../context/auth'; 
function UserGuides() {
const { user, loading: userLoading } = useAuth();
  const [userGuides, setUserGuides] = useState([]);
  const [guidesLoading, setGuidesLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Solo intentamos cargar las guías si el usuario YA cargó y existe
    if (user) {
      api
        .get("/api/user/guides")
        .then((response) => {
          setUserGuides(response.data);
        })
        .catch((err) => {
          console.error("Error fetching user guides:", err);
          // Este es el error 401 que estamos viendo
          setError(
            "No se pudieron cargar tus guías. (Error: " + err.message + ")"
          );
        })
        .finally(() => {
          setGuidesLoading(false);
        });
    } else if (!userLoading) {
      // Si el usuario terminó de cargar y NO existe (es null)
      setGuidesLoading(false);
    }
  }, [user, userLoading]);
  return (
    <>
      <section className="user-guides section-card">
        <h2>Mis guias ({userGuides.length})</h2>
        {guidesLoading && (
          <div className="profile-status">Cargando guías...</div>
        )}
        {error && <div className="error-message">{error}</div>}

        {userGuides.length > 0 ? (
          <ul>
            {userGuides.map((guide) => (
              <li key={guide.id}>
                <a href={`/guides/${guide.id}`}>{guide.title}</a>
                <span>Para {guide.game?.title || "Juego no encontrado"} </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes ninguna guia.</p>
        )}
        <button onClick={() => alert("Crear guia pendiente")}>
          Crear guia
        </button>
      </section>
    </>
  );
}

export default UserGuides;
