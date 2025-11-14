// frontend/src/pages/admin/AdminUserManagement.tsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/context/api';
import { useDebounce } from '@/hooks/useDebounce';
import HeaderAdmin from './HeaderAdmin';

// 1. Definimos la interfaz para el Usuario
interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // 2. Adaptamos la función de fetching para usuarios
  const fetchUsers = useCallback(async (currentPage: number, search: string) => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/users', { // <-- Endpoint cambiado
        params: {
          page: currentPage,
          search: search,
          per_page: 20, // <-- Podemos pedir menos usuarios por página
        },
      });
      setUsers(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page, debouncedSearch);
  }, [page, debouncedSearch, fetchUsers]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // 3. Adaptamos la función de eliminar
  const handleDelete = async (user: User) => {
    if (window.confirm(`¿Seguro que quieres eliminar al usuario "${user.name}" (${user.email})?`)) {
      try {
        await api.delete(`/api/admin/users/${user.id}`); // <-- Endpoint cambiado
        fetchUsers(page, debouncedSearch); // Refrescamos la lista
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
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="p-2 border border-[#3a3a3a] rounded bg-[#1e1e1e] text-white w-full md:w-72"
        />
        {/* Podríamos añadir un botón de "Añadir Usuario" aquí en el futuro */}
      </div>

      {loading && <div className="text-center p-4">Cargando...</div>}
      {error && <div className="text-center p-4 text-red-400">{error}</div>}

      {!loading && !error && (
        <div className="bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg overflow-hidden">
          <table className="w-full min-w-full divide-y divide-[#3a3a3a]">
            <thead className="bg-[#1e1e1e]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a3a3a]">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {user.is_admin ? (
                      <span className="px-2 py-1 text-xs font-semibold bg-red-600 text-white rounded-full">Admin</span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold bg-gray-600 text-gray-200 rounded-full">Usuario</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {/* Podríamos añadir "Editar" aquí en el futuro */}
                    <button
                      onClick={() => handleDelete(user)}
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
      
      {/* Paginación (idéntica a la de juegos) */}
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

export default AdminUserManagement;