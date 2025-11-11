// frontend/src/components/UserLists.tsx

import React, { useState, useEffect } from 'react';
// Importamos la función de tu api.ts
import { getUserLists } from '../context/api';
// Importamos tu componente reutilizable para mostrar listas de guías
import GuideList from './GuideList'; 

// --- Tipos ---
// (Puedes moverlos a un archivo 'types.ts' global)

// Un tipo simple para la tarjeta de guía (ajústalo a lo que necesite GuideList)
interface GuideForList {
  id: number;
  title: string;
  // Asumo que 'game' viene cargado como dijimos en el backend
  game: {
    name: string;
    cover_image_url: string; 
  };
  // ...otros campos que necesite tu componente GuideList
}

// El tipo de datos que esperamos de la API /api/user/my-lists
interface UserListsData {
  favorites: GuideForList[];
  todo: GuideForList[];
  completed: GuideForList[];
}

function UserLists() {
  // Estado para los datos de las listas
  const [lists, setLists] = useState<UserListsData | null>(null);
  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Cargar los datos cuando el componente se monta
  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        const response = await getUserLists();
        setLists(response.data);
      } catch (err) {
        console.error("Error al cargar las listas:", err);
        // 'lists' seguirá siendo null, lo que mostrará el error
      } finally {
        setLoading(false);
      }
    };
    
    fetchLists();
  }, []); // El array vacío [] asegura que se ejecuta solo una vez

  // 1. Estado de Carga
  if (loading) {
    return (
      <div className="text-center text-[var(--color-text-primary)] p-4">
        Cargando mis listas...
      </div>
    );
  }

  // 2. Estado de Error
  if (!lists) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded text-center mt-8">
        No se pudieron cargar tus listas. Inténtalo más tarde.
      </div>
    );
  }

  // 3. Estado Exitoso
  return (
    // Reutilizo los estilos que tenías en ProfilePage para consistencia
    <section className="bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg p-6 mt-8">
      
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 pb-2 border-b border-[var(--color-accent)]">
        Mis Listas Personales
      </h2>
      
      <div className="space-y-8">
        {/* Sección Favoritos */}
        <section>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
            ★ Mis Favoritos
          </h3>
          <GuideList guides={lists.favorites} />
          {lists.favorites.length === 0 && (
            <p className="text-[var(--color-text-secondary)] italic">Aún no has añadido guías a favoritos.</p>
          )}
        </section>

        {/* Sección Por Hacer */}
        <section>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
            📋 Por Hacer
          </h3>
          <GuideList guides={lists.todo} />
          {lists.todo.length === 0 && (
            <p className="text-[var(--color-text-secondary)] italic">No tienes guías marcadas "Por Hacer".</p>
          )}
        </section>

        {/* Sección Completadas */}
        <section>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
            ✓ Completadas
          </h3>
          <GuideList guides={lists.completed} />
          {lists.completed.length === 0 && (
            <p className="text-[var(--color-text-secondary)] italic">Aún no has completado ninguna guía.</p>
          )}
        </section>
      </div>
    </section>
  );
}

export default UserLists;