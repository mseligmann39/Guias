// frontend/src/components/GuideListActions.tsx

import React, { useState, useEffect } from 'react';
import { postGuideListStatus } from '../context/api';
import { useAuth } from '../context/AuthContext';

// --- Tipos ---
// Definimos el tipo para el estado de la lista
// (Puedes moverlo a un archivo 'types.ts' global si lo prefieres)
export interface ListStatus {
  is_favorite: boolean;
  progress_status: 'todo' | 'completed' | null;
}

// Definimos las props que recibirá este componente
interface GuideListActionsProps {
  guideId: string | number;
  initialStatus: ListStatus;
}         

function GuideListActions({ guideId, initialStatus }: GuideListActionsProps) {
  const { user } = useAuth();
const isAuthenticated = !!user;

  // Estado local para manejar la UI de forma optimista
  const [status, setStatus] = useState<ListStatus>(initialStatus);
  // Estado de carga para deshabilitar botones mientras se guarda
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sincronizamos el estado si las props (desde el padre) cambian
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  /**
   * Handler genérico para actualizar el estado en la API.
   * Utiliza "actualización optimista".
   */
  const handleUpdate = async (updateData: Partial<ListStatus>) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para hacer esto');
      return;
    }

    const oldStatus = status; // Guardamos el estado anterior
    const newStatus = { ...status, ...updateData };

    // 1. Actualización optimista (UI instantánea)
    setStatus(newStatus);
    setIsSubmitting(true);

    try {
      // 2. Llamada a la API (usando la función de api.ts)
      // Aseguramos que el tipo coincide con lo que espera tu función
      await postGuideListStatus(guideId, {
          is_favorite: newStatus.is_favorite,
          progress_status: newStatus.progress_status
      });
      // ¡Éxito! La UI ya está actualizada.
      
    } catch (err) {
      console.error("Error al actualizar la lista:", err);
      // 3. Reversión (si la API falla)
      alert('No se pudo guardar el cambio. Inténtalo de nuevo.');
      setStatus(oldStatus); // Revertimos la UI
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para el botón de favorito
  const handleToggleFavorite = () => {
    handleUpdate({ is_favorite: !status.is_favorite });
  };
  
  // Handler para el <select> de progreso
  const handleProgressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProgress = e.target.value;
    
    handleUpdate({ 
      progress_status: newProgress === 'none' ? null : (newProgress as 'todo' | 'completed')
    });
  };

  // Si el usuario no está logueado, no mostramos nada
  if (!isAuthenticated) {
    return null; 
  }

  // Renderizado
  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={handleToggleFavorite}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
          status.is_favorite 
            ? 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent-hover)]' 
            : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isSubmitting}
      >
        {status.is_favorite ? '★ Favorito' : '☆ Favorito'}
      </button>
      
      <div className="relative">
        <select 
          onChange={handleProgressChange} 
          value={status.progress_status || 'none'}
          className="appearance-none bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent cursor-pointer"
          disabled={isSubmitting}
        >
          <option value="none">Marcar como...</option>
          <option value="todo">Por Hacer</option>
          <option value="completed">Completado</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--color-text-secondary)]">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>

      {isSubmitting && <span className="text-sm text-[var(--color-text-secondary)]">Guardando...</span>}
    </div>
  );
}

export default GuideListActions;