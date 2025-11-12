import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importa Link
import api from "@/context/api";
import { useAuth } from '@/context/auth'; 
import type { Guide } from '@/types';
// No necesitas otro Link, ya estaba importado arriba

function UserGuides() {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuth();
  const [userGuides, setUserGuides] = useState<Guide[]>([]);
  const [guidesLoading, setGuidesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      setGuidesLoading(false);
    }
  }, [user, userLoading]);

  // --- NUEVA FUNCIÓN ---
  // Manejador para eliminar una guía
  const handleDelete = (guideId: number) => {
    // 1. Confirmación: ¡Importante!
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta guía? Esta acción no se puede deshacer.")) {
      return;
    }

    // 2. Llamada a la API
    api
      .delete(`/api/guides/${guideId}`)
      .then(() => {
        // 3. Actualizar el estado local para reflejar el cambio
        setUserGuides((prevGuides) =>
          prevGuides.filter((guide) => guide.id !== guideId)
        );
      })
      .catch((err) => {
        console.error("Error deleting guide:", err);
        // Podrías usar el estado de 'error' principal o uno específico
        alert("Error al eliminar la guía: " + (err.response?.data?.message || err.message));
      });
  };
  // --- FIN NUEVA FUNCIÓN ---

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
            // --- INICIO DE MODIFICACIÓN ---
            <li 
              key={guide.id}
              className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-[#1e1e1e] rounded-lg border border-[#3a3a3a] "
            >
              {/* Contenedor de Información */}
              <div>
                <Link 
                  to={`/guides/${guide.id}`} 
                  className="text-[var(--color-primary)] hover:underline text-lg font-medium block mb-1"
                >
                  {guide.title}
                </Link>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Para {guide.game?.title || "Juego no encontrado"}
                </p>
              </div>

              {/* Contenedor de Acciones */}
              <div className="flex space-x-2 mt-3 sm:mt-0">
                <Link
                  to={`/guides/edit/${guide.id}`}
                  className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(guide.id)}
                  className="px-3 py-1 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </li>
            // --- FIN DE MODIFICACIÓN ---
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