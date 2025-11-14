import React, { useState } from 'react';
import api from '../context/api';
import { ReporteRazon, ReportePayload } from '../types';

interface ReporteModalProps {
  guiaId: number | string;
  onClose: () => void;
  onSuccess?: () => void;
}

const razones: { value: ReporteRazon; label: string }[] = [
  { value: 'contenido_inapropiado', label: 'Contenido inapropiado' },
  { value: 'guia_falsa', label: 'Guía falsa' },
  { value: 'juego_equivocado', label: 'Guía asociada al juego equivocado' },
  { value: 'otro', label: 'Otro (especificar)' },
];

const ReporteModal: React.FC<ReporteModalProps> = ({ guiaId, onClose, onSuccess }) => {
  const [razon, setRazon] = useState<ReporteRazon | ''>('');
  const [detalle, setDetalle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!razon) {
      setError('Por favor selecciona una razón para el reporte.');
      return;
    }

    if (razon === 'otro' && !detalle.trim()) {
      setError('Por favor indica el detalle cuando la razón es "Otro".');
      return;
    }

    const payload: ReportePayload = { razon };
    if (detalle.trim()) payload.detalle_opcional = detalle.trim();

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post(`/api/guias/${guiaId}/reporte`, payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error al enviar el reporte:', err);
      const msg = err?.response?.data?.message || 'Error al enviar el reporte. Intenta de nuevo.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-slate-900 rounded-lg w-full max-w-lg p-6 border border-red-600 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Reportar guía</h3>
          <button onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-white text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-white">Razón</label>
            <select
              className="w-full p-2 bg-slate-800 text-white border border-gray-600 rounded focus:outline-none focus:border-red-500"
              value={razon}
              onChange={(e) => setRazon(e.target.value as ReporteRazon | '')}
            >
              <option value="">-- Selecciona una razón --</option>
              {razones.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {razon === 'otro' && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-white">Detalle</label>
              <textarea
                className="w-full p-3 bg-slate-800 text-white border border-gray-600 rounded min-h-[120px] resize-none focus:outline-none focus:border-red-500"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                placeholder="Describe brevemente el problema"
              />
            </div>
          )}

          {error && <div className="text-red-400 mb-3">{error}</div>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded border border-gray-600 bg-transparent text-gray-300 hover:bg-slate-800"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={`px-4 py-2 rounded bg-red-600 text-white font-medium ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReporteModal;
