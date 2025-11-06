import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/context/api";
import { useAuth } from '@/context/auth'; 
import type { Guide } from '@/types';

function UserGuides() {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuth();
  const [userGuides, setUserGuides] = useState<Guide[]>([]);
  const [guidesLoading, setGuidesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Solo intentamos cargar las guías si el usuario YA cargó y existe
    if (user) {
      api
        .get<Guide[]>(`/api/guides/user/${user.id}`)
        .then((response) => {
          setUserGuides(response.data);
        })
        .catch((err) => {
          console.error("Error fetching user guides:", err);
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
        
        <button 
          onClick={() => navigate('/guides/create')}
          className="add-guide-button"
        >
          Agregar guía
        </button>
      </section>
    </>
  );
}

export default UserGuides;
