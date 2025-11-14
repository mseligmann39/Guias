import React, { useEffect, useState, useCallback } from 'react';
import { getAdminReports, updateAdminReport } from '@/context/api';
import HeaderAdmin from './HeaderAdmin';

interface UserSummary { id: number; name: string }
interface GuideSummary { id: number; title: string; slug?: string }

interface Reporte {
  id: number;
  guide_id: number;
  guia?: GuideSummary;
  usuario?: UserSummary | null;
  razon: string;
  detalle_opcional?: string | null;
  estado: 'pendiente' | 'revisado' | 'ignorado';
  created_at: string;
}

const AdminReportsPage: React.FC = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReportes = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await getAdminReports({ page: p, estado: 'pendiente', per_page: 20 });
      setReportes(res.data.data || []);
      setTotalPages(res.data.last_page || 1);
    } catch (err: any) {
      console.error('Error fetching reports', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReportes(page); }, [page, fetchReportes]);

  const handleChangeEstado = async (reporte: Reporte, nuevoEstado: Reporte['estado']) => {
    try {
      await updateAdminReport(reporte.id, { estado: nuevoEstado });
      // Optimistic update
      setReportes((prev) => prev.map(r => r.id === reporte.id ? { ...r, estado: nuevoEstado } : r));
    } catch (err) {
      console.error('Error updating report', err);
      alert('Error al actualizar el estado');
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="max-w-7xl mx-auto p-6 text-[var(--color-text-primary)]">
      <h1 className="text-3xl font-bold mb-4">Reportes de Guías</h1>

      {loading && <div>Cargando reportes...</div>}

      {!loading && reportes.length === 0 && (
        <div className="text-[var(--color-text-secondary)]">No hay reportes pendientes.</div>
      )}

      {!loading && reportes.length > 0 && (
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-accent)] rounded-lg overflow-hidden">
          <table className="w-full min-w-full divide-y divide-[#3a3a3a]">
            <thead className="bg-[var(--color-bg)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Guía</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Razón</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Detalle</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reportado por</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a3a3a]">
              {reportes.map(r => (
                <tr key={r.id} className="bg-[var(--color-bg-secondary)]">
                  <td className="px-6 py-4 font-medium">
                    <a href={`/admin/reportes/${r.id}`} className="text-[var(--color-primary)] hover:underline">{r.guia?.title || `#${r.guide_id}`}</a>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{r.razon}</td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{r.detalle_opcional || '-'}</td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{r.usuario?.name || 'Anónimo'}</td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => handleChangeEstado(r, 'revisado')} className="text-green-400 hover:text-green-300 mr-4">Marcar revisado</button>
                    <button onClick={() => handleChangeEstado(r, 'ignorado')} className="text-gray-400 hover:text-gray-300">Ignorar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1} className="px-4 py-2 border rounded">Anterior</button>
        <span>Pagina {page} de {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page >= totalPages} className="px-4 py-2 border rounded">Siguiente</button>
      </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
