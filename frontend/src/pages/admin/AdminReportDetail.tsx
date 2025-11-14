import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminReport, updateAdminReport } from '@/context/api';
import api from '@/context/api';
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

const AdminReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAdminReport(id);
        setReporte(res.data);
      } catch (err) {
        console.error(err);
        alert('Error al cargar el reporte');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleUpdateEstado = async (nuevoEstado: Reporte['estado']) => {
    if (!reporte) return;
    try {
      const res = await updateAdminReport(reporte.id, { estado: nuevoEstado });
      setReporte(res.data);
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el estado');
    }
  };

  const handleDeleteGuide = async () => {
    if (!reporte) return;
    if (!confirm('¿Eliminar la guía asociada? Esta acción es irreversible.')) return;
    try {
      await api.delete(`/api/admin/guides/${reporte.guide_id}`);
      // Optionally mark reporte as revisado
      await updateAdminReport(reporte.id, { estado: 'revisado' });
      alert('Guía eliminada correctamente');
      navigate('/admin/reportes');
    } catch (err: any) {
      console.error(err);
      alert('Error al eliminar la guía: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!reporte) return <div className="p-6">Reporte no encontrado</div>;

  return (
    <div>
      <HeaderAdmin />
      <div className="max-w-5xl mx-auto p-6 text-[var(--color-text-primary)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reporte #{reporte.id}</h1>
        <div className="flex gap-3">
          <button onClick={() => handleUpdateEstado('revisado')} className="px-3 py-2 bg-green-600 rounded text-[var(--color-bg)]">Marcar revisado</button>
          <button onClick={() => handleUpdateEstado('ignorado')} className="px-3 py-2 bg-gray-600 rounded text-[var(--color-bg)]">Ignorar</button>
          <button onClick={handleDeleteGuide} className="px-3 py-2 bg-red-600 rounded text-[var(--color-bg)]">Eliminar guía</button>
        </div>
      </div>

      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded p-4">
        <div className="mb-3">
          <strong>Guía:</strong> {reporte.guia ? reporte.guia.title : `#${reporte.guide_id}`}
        </div>
        <div className="mb-3"><strong>Razón:</strong> {reporte.razon}</div>
        <div className="mb-3"><strong>Detalle:</strong> {reporte.detalle_opcional || '-'}</div>
        <div className="mb-3"><strong>Reportado por:</strong> {reporte.usuario?.name || 'Anónimo'}</div>
        <div className="mb-3"><strong>Fecha:</strong> {new Date(reporte.created_at).toLocaleString()}</div>
        <div className="mb-3"><strong>Estado:</strong> <span className="ml-2">{reporte.estado}</span></div>
      </div>
      </div>
    </div>
  );
};

export default AdminReportDetail;
