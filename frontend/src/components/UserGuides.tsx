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
    <section className="bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6 pb-2 border-b border-[var(--color-accent)]">
        Mis guías ({userGuides.length})
      </h2>
      
      {guidesLoading && (
        <div className="text-center py-4 text-[var(--color-text-secondary)]">
          Cargando guías...
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 text-red-200 rounded mb-4">
          {error}
        </div>
      )}

      {userGuides.length > 0 ? (
        <ul className="space-y-4">
          {userGuides.map((guide) => (
            <li 
              key={guide.id}
              className="p-4 bg-[#1e1e1e] rounded-lg border border-[#3a3a3a] hover:border-[var(--color-accent)] transition-colors"
            >
              <a 
                href={`/guides/${guide.id}`} 
                className="text-[var(--color-primary)] hover:underline text-lg font-medium block mb-1"
              >
                {guide.title}
              </a>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Para {guide.game?.title || "Juego no encontrado"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6 text-[var(--color-text-secondary)]">
          <p className="mb-4">No tienes ninguna guía publicada aún.</p>
          <button 
            onClick={() => navigate('/guides/create')}
            className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-primary)] font-medium rounded hover:bg-opacity-90 transition-all hover:shadow-[0_0_15px_rgba(231,0,0,0.3)]"
          >
            Crear mi primera guía
          </button>
        </div>
      )}
      
      {userGuides.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[var(--color-accent)]">
          <button 
            onClick={() => navigate('/guides/create')}
            className="w-full sm:w-auto px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-primary)] font-medium rounded hover:bg-opacity-90 transition-all hover:shadow-[0_0_15px_rgba(231,0,0,0.3)]"
          >
            + Agregar nueva guía
          </button>
        </div>
      )}
    </section>
  );
}

export default UserGuides;
