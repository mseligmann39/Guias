// frontend/src/pages/admin/AdminGuideManagement.tsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/context/api';
import { useDebounce } from '@/hooks/useDebounce';
import { Link } from 'react-router-dom'; // Importamos Link
import HeaderAdmin from './HeaderAdmin';

// 1. Interfaces (¡incluyendo relaciones!)
interface UserSummary {
  id: number;
  name: string;
}

interface GameSummary {
  id: number;
  title: string;
}

interface Guide {
  id: number;
  title: string;
  game: GameSummary; // <-- Relación con Juego
  user: UserSummary; // <-- Relación con Usuario (Autor)
  created_at: string;
}

const AdminGuideManagement: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // 2. Adaptamos la función de fetching para guías
  const fetchGuides = useCallback(async (currentPage: number, search: string) => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/guides', { // <-- Endpoint cambiado
        params: {
          page: currentPage,
          search: search,
          per_page: 20,
        },
      });
      setGuides(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las guías');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuides(page, debouncedSearch);
  }, [page, debouncedSearch, fetchGuides]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // 3. Adaptamos la función de eliminar
  const handleDelete = async (guide: Guide) => {
    if (window.confirm(`¿Seguro que quieres eliminar la guía "${guide.title}"?`)) {
      try {
        await api.delete(`/api/admin/guides/${guide.id}`); // <-- Endpoint cambiado
        fetchGuides(page, debouncedSearch); // Refrescamos la lista
      } catch (err: any) {
        alert('Error al eliminar: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="max-w-7xl mx-auto p-6 text-[var(--color-text-primary)]">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Gestión de Guías</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por título de guía..."
          className="p-2 border border-[#3a3a3a] rounded bg-[#1e1e1e] text-white w-full md:w-72"
        />
      </div>

      {loading && <div className="text-center p-4">Cargando...</div>}
      {error && <div className="text-center p-4 text-red-400">{error}</div>}

      {!loading && !error && (
        <div className="bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg overflow-hidden">
          <table className="w-full min-w-full divide-y divide-[#3a3a3a]">
            <thead className="bg-[#1e1e1e]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Guía</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Juego</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Autor</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a3a3a]">
              {guides.map(guide => (
                <tr key={guide.id}>
                  <td className="px-6 py-4 font-medium">{guide.title}</td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{guide.game?.title || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{guide.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link 
                      to={`/guides/${guide.id}`} // Enlace para ver la guía
                      className="text-blue-400 hover:text-blue-300 mr-4"
                      target="_blank" // Abre en nueva pestaña para no perder el panel
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => handleDelete(guide)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Paginación (idéntica) */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 border border-[var(--color-accent)] rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 border border-[var(--color-accent)] rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
      </div>
    </div>
  );
};

export default AdminGuideManagement;