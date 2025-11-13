import React, { useState, useEffect, useCallback } from 'react';
import api from '@/context/api';
import type { Game } from '@/types';
// --- CORREGIDO: Ahora importa el hook desde su propio archivo ---
import { useDebounce } from '@/hooks/useDebounce';
// (Interfaces GameFormData y emptyForm siguen igual)
interface GameFormData {
  title: string;
  description: string;
  cover_image_url: string;
  release_date: string;
}
const emptyForm: GameFormData = {
  title: '',
  description: '',
  cover_image_url: '',
  release_date: '',
};

// --- ELIMINADO: Ya no declaramos useDebounce aquí ---

const AdminGameManagement: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [modalState, setModalState] = useState<Game | 'new' | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchGames = useCallback(async (currentPage: number, search: string) => {
    setLoading(true);
    try {
      const response = await api.get('/api/games', {
        params: {
          page: currentPage,
          search: search,
          per_page: 50,
        },
      });
      setGames(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los juegos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames(page, debouncedSearch);
  }, [page, debouncedSearch, fetchGames]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDelete = async (game: Game) => {
    if (window.confirm(`¿Seguro que quieres eliminar el juego "${game.title}"?`)) {
      try {
        await api.delete(`/api/admin/games/${game.id}`);
        fetchGames(page, debouncedSearch);
      } catch (err: any) {
        alert('Error al eliminar: ' + (err.response?.data?.message || err.message));
      }
    }
  };

const handleSave = async (formData: GameFormData) => {
  const isNew = modalState === 'new';

  const url = isNew ? '/api/admin/games' : `/api/admin/games/${(modalState as Game).id}`;
  // Usamos el método 'post' para crear o 'put' para actualizar
  const method = isNew ? 'post' : 'put';

  try {
    // ¡LA CLAVE! Llama a api.post o api.put con los datos JSON (formData),
    // no con un objeto FormData.
    await api[method](url, formData);

    setModalState(null);
    fetchGames(page, debouncedSearch);
  } catch (err: any) {
    // Ahora, si da un error, será el error REAL, no un 405
    alert('Error al guardar: ' + (err.response?.data?.message || err.message));
  }
};
  return (
    <div className="max-w-7xl mx-auto p-6 text-[var(--color-text-primary)]">
      {/* (El resto del JSX es idéntico al anterior) */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Gestión de Juegos</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por título..."
          className="p-2 border border-[#3a3a3a] rounded bg-[#1e1e1e] text-white w-full md:w-72"
        />
        <button
          onClick={() => setModalState('new')}
          className="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition-colors"
        >
          + Añadir Juego
        </button>
      </div>

      {loading && <div className="text-center p-4">Cargando...</div>}
      {error && <div className="text-center p-4 text-red-400">{error}</div>}

      {!loading && !error && (
        <div className="bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg overflow-hidden">
          <table className="w-full min-w-full divide-y divide-[#3a3a3a]">
            <thead className="bg-[#1e1e1e]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Juego</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a3a3a]">
              {games.map(game => (
                <tr key={game.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img className="w-10 h-10 object-cover rounded mr-4" src={game.cover_image_url} alt={game.title} />
                      <span className="font-medium">{game.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{game.id}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => setModalState(game)}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(game)}
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

      {modalState && (
        <GameEditModal
          initialGameData={modalState === 'new' ? null : modalState}
          onSave={handleSave}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
};

// (El componente GameEditModal sigue igual que antes)
interface GameEditModalProps {
  initialGameData: Game | null;
  onSave: (formData: GameFormData) => Promise<void>;
  onClose: () => void;
}
const GameEditModal: React.FC<GameEditModalProps> = ({ initialGameData, onSave, onClose }) => {
  const [formData, setFormData] = useState<GameFormData>(
    initialGameData 
      ? {
          title: initialGameData.title,
          description: initialGameData.description,
          cover_image_url: initialGameData.cover_image_url || '',
          release_date: initialGameData.release_date || '',
        }
      : emptyForm
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-[#2a2a2a] rounded-lg shadow-xl w-full max-w-2xl border border-[var(--color-accent)]">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-[#3a3a3a]">
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              {initialGameData ? 'Editar Juego' : 'Crear Nuevo Juego'}
            </h2>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-[#3a3a3a] rounded bg-[#1e1e1e]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-[#3a3a3a] rounded bg-[#1e1e1e] h-40"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL de la Portada</label>
              <input
                type="text"
                name="cover_image_url"
                value={formData.cover_image_url}
                onChange={handleChange}
                className="w-full p-2 border border-[#3a3a3a] rounded bg-[#1e1e1e]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Lanzamiento</label>
              <input
                type="date"
                name="release_date"
                value={formData.release_date}
                onChange={handleChange}
                className="w-full p-2 border border-[#3a3a3a] rounded bg-[#1e1e1e]"
              />
            </div>
          </div>
          <div className="p-6 flex justify-end gap-4 bg-[#1e1e1e] rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-[var(--color-accent)] rounded hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : (initialGameData ? 'Guardar Cambios' : 'Crear Juego')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminGameManagement;