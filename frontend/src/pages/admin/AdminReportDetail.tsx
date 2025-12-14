import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminReport, updateAdminReport } from '@/context/api';
import api from '@/context/api';
import HeaderAdmin from './HeaderAdmin';
import ReactMarkdown from 'react-markdown';
import { API_ORIGIN, buildStorageUrl } from '@/config';
import { GuideSection } from '@/types';

interface UserSummary { id: number; name: string }
interface UserSummary { id: number; name: string }
interface GuideSummary {
  id: number;
  title: string;
  slug?: string;
  sections?: GuideSection[];
  game?: { title: string };
  user?: { name: string };
}

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
      await api.delete(`/admin/guides/${reporte.guide_id}`);
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

  const getYoutubeEmbedUrl = (url: string): string | null => {
    let videoId = null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        videoId = urlObj.searchParams.get('v');
      } else if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.substring(1);
      }
    } catch (e) {
      console.error('URL de video no válida:', url);
      return null;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const renderSection = (section: GuideSection) => {
    const buildImageSrc = () => {
      if (!section.image_path) return null;
      return buildStorageUrl(section.image_path);
    };

    switch (section.type) {
      case 'text':
        return (
          <div key={section.id} className="prose prose-invert max-w-none text-[var(--color-text-primary)] mb-4">
            <ReactMarkdown>{section.content || ''}</ReactMarkdown>
          </div>
        );
      case 'image': {
        const imageSrc = buildImageSrc();
        return (
          <div key={section.id} className="my-4 flex justify-center">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Sección de la guía"
                className="max-w-full h-auto rounded-lg border border-[var(--color-accent)] md:max-w-xl lg:max-w-2xl"
                onError={(event) => {
                  if (!section.image_path) return;
                  const fallback = `${API_ORIGIN}/storage/${section.image_path.replace(/^\/+/, '')}`;
                  if (event.currentTarget.src !== fallback) {
                    event.currentTarget.src = fallback;
                  } else {
                    event.currentTarget.onerror = null;
                    event.currentTarget.style.display = 'none';
                  }
                }}
              />
            ) : (
              <div className="text-sm text-[var(--color-text-secondary)] italic">Imagen no disponible</div>
            )}
          </div>
        );
      }
      case 'video':
        const embedUrl = section.content ? getYoutubeEmbedUrl(section.content) : null;
        return embedUrl ? (
          <div key={section.id} className="my-4 aspect-video">
            <iframe
              className="w-full h-full rounded-lg border border-[var(--color-accent)]"
              src={embedUrl}
              title="Video de la guía"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p key={section.id} className="text-red-400">Video no válido: {section.content}</p>
        );
      default:
        return <p key={section.id}>Tipo de sección desconocido</p>;
    }
  };

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

        {reporte.guia && (
          <div className="mt-8 bg-[var(--color-bg)] border border-[var(--color-border)] rounded p-6">
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--color-border)] pb-2">Contenido de la Guía: {reporte.guia.title}</h2>

            <div className="mb-4 text-sm text-[var(--color-text-secondary)]">
              {reporte.guia.game && <span className="mr-4">Juego: {reporte.guia.game.title}</span>}
              {reporte.guia.user && <span>Autor: {reporte.guia.user.name}</span>}
            </div>

            <div className="guide-content-sections space-y-4">
              {reporte.guia.sections && reporte.guia.sections.length > 0 ? (
                reporte.guia.sections.map(renderSection)
              ) : (
                <p className="text-[var(--color-text-secondary)]">Esta guía no tiene contenido visible.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportDetail;
