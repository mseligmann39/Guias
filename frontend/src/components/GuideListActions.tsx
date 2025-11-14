// frontend/src/components/GuideListActions.tsx

import React, { useState, useEffect, useRef } from 'react';
import { postGuideListStatus } from '../context/api';
import { useAuth } from '../context/AuthContext';
import ReporteModal from './ReporteModal';

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
  initialStatus?: ListStatus; // optional, may be undefined for anonymous viewers
}         

function GuideListActions({ guideId, initialStatus }: GuideListActionsProps) {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [showMenu, setShowMenu] = useState(false);
  const [showReporteModal, setShowReporteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Estado local para manejar la UI de forma optimista
  const [status, setStatus] = useState<ListStatus>(() => initialStatus ?? { is_favorite: false, progress_status: null });
  // Estado de carga para deshabilitar botones mientras se guarda
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sincronizamos el estado si las props (desde el padre) cambian
  useEffect(() => {
    setStatus(initialStatus ?? { is_favorite: false, progress_status: null });
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

  // Nota: permitimos ver el menú incluso si no hay sesión, porque el reporte
  // puede ser anónimo. Solo deshabilitamos las acciones que requieren auth.

  // Renderizado
  // Click outside handler to close menu
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [showMenu]);

  return (
    <nav className="relative inline-block" ref={menuRef} aria-label="Acciones de guía">
      <button
        onClick={() => setShowMenu(v => !v)}
        className="p-2 rounded-full hover:bg-[var(--color-bg-secondary)]"
        aria-haspopup="true"
        aria-expanded={showMenu}
        aria-controls={`guide-actions-${guideId}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>

      {showMenu && (
        <div id={`guide-actions-${guideId}`} role="menu" className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-[var(--color-border)] rounded shadow-lg z-50">
          <ul className="flex flex-col py-2 bg-slate-800" role="none">
            <li role="none">
              <button
                role="menuitem"
                onClick={() => { setShowMenu(false); handleToggleFavorite(); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-bg-secondary)] ${!isAuthenticated || isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!isAuthenticated || isSubmitting}
              >
                {status.is_favorite ? '★ Quitar favorito' : '☆ Añadir a favoritos'}
              </button>
            </li>

            <li role="none">
              <button
                role="menuitem"
                onClick={() => { setShowMenu(false); setShowReporteModal(true); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-bg-secondary)]"
              >
                ⚠️ Reportar guía
              </button>
            </li>

            <li><div className="border-t border-[var(--color-border)] my-1" /></li>

            <li role="none">
              <div className="px-4 py-2 text-sm text-[var(--color-text-secondary)]">Marcar como:</div>
            </li>

            <li role="none">
              <button
                role="menuitem"
                onClick={() => { setShowMenu(false); handleUpdate({ progress_status: 'todo' }); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-bg-secondary)] ${!isAuthenticated || isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!isAuthenticated || isSubmitting}
              >
                Por Hacer
              </button>
            </li>

            <li role="none">
              <button
                role="menuitem"
                onClick={() => { setShowMenu(false); handleUpdate({ progress_status: 'completed' }); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-bg-secondary)] ${!isAuthenticated || isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!isAuthenticated || isSubmitting}
              >
                Completado
              </button>
            </li>

            <li role="none">
              <button
                role="menuitem"
                onClick={() => { setShowMenu(false); handleUpdate({ progress_status: null }); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-bg-secondary)] ${!isAuthenticated || isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!isAuthenticated || isSubmitting}
              >
                Quitar marca
              </button>
            </li>
          </ul>
        </div>
      )}

      {showReporteModal && (
        <ReporteModal guiaId={guideId} onClose={() => setShowReporteModal(false)} onSuccess={() => { /* optionally refetch parent */ }} />
      )}

      {isSubmitting && <span className="text-sm text-[var(--color-text-secondary)] ml-2">Guardando...</span>}
    </nav>
  );
}

export default GuideListActions;