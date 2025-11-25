import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/context/api';
import { useAuth } from '@/context/auth';
import Header from '../components/layout/Header';
import { API_URL } from '../config';
import toast from 'react-hot-toast';
// ¡Ahora esta importación funcionará!
import type { Game, Guide, GuideSection } from '@/types';

// (El resto de tu código hasta el return...)

// --- INICIO: NUEVOS TIPOS Y ESTADOS ---
interface GuideSectionState {
  id?: number;
  tempId: string;
  order: number;
  type: 'text' | 'image' | 'video';
  content: string;
  imageFile?: File | null;
  image_path?: string | null;
}

const CreateGuidePage: React.FC = () => {
  const { guideId } = useParams<{ guideId?: string }>();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuth();

  const [title, setTitle] = useState<string>('');
  const [gameId, setGameId] = useState<string>('');
  const [sections, setSections] = useState<GuideSectionState[]>([]);

  const [videoGames, setVideoGames] = useState<Game[]>([]);
  // const [message, setMessage] = useState<string>(''); // Removed in favor of toast
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const isEditMode = Boolean(guideId);

  // --- FIN: NUEVOS TIPOS Y ESTADOS ---

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const gamesRes = await api.get('/api/games');
        const gamesData = gamesRes.data;
        if (Array.isArray(gamesData)) {
          setVideoGames(gamesData);
        } else if (gamesData && Array.isArray(gamesData.data)) {
          setVideoGames(gamesData.data);
        } else {
          setVideoGames([]);
        }

        // --- INICIO: MODIFICACIÓN DEL 'loadData' PARA MODO EDICIÓN ---
        if (isEditMode && guideId) {
          const guideRes = await api.get(`/api/guides/${guideId}`);
          // Definimos 'guide' con el tipo correcto (que ya no tiene 'content')
          const guide: Guide = guideRes.data;

          setTitle(guide.title);
          setGameId(String(guide.game_id));

          // Ahora 'guide.sections' existe y 'GuideSection' también
          if (guide.sections) {
            const loadedSections = guide.sections.map((sec: GuideSection) => ({
              id: sec.id,
              tempId: `sec-${sec.id}`,
              order: sec.order,
              type: sec.type,
              content: sec.content || '',
              imageFile: null,
              image_path: sec.image_path,
            }));
            setSections(loadedSections);
          }
        }
        // --- FIN: MODIFICACIÓN DEL 'loadData' PARA MODO EDICIÓN ---

      } catch (err) {
        console.error('Error al cargar datos:', err);
        toast.error('Error al cargar los datos necesarios');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isEditMode, guideId]);

  // --- INICIO: NUEVOS MANEJADORES DE SECCIONES ---
  const handleAddSection = (type: 'text' | 'image' | 'video') => {
    const newSection: GuideSectionState = {
      tempId: `new-${Date.now()}`,
      order: sections.length,
      type: type,
      content: '',
      imageFile: null,
    };
    setSections(prev => [...prev, newSection]);
  };

  const handleDeleteSection = (tempId: string) => {
    if (confirmDeleteId === tempId) {
      setSections(prev =>
        prev
          .filter(sec => sec.tempId !== tempId)
          .map((sec, index) => ({ ...sec, order: index }))
      );
      setConfirmDeleteId(null);
      toast.success('Sección eliminada');
    } else {
      setConfirmDeleteId(tempId);
      // Optional: Auto-reset confirmation after a few seconds
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const handleSectionChange = (
    tempId: string,
    field: 'content' | 'imageFile',
    value: string | File | null // Esta definición está bien
  ) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.tempId !== tempId) return sec;

        if (field === 'content') {
          return { ...sec, content: value as string };
        }
        if (field === 'imageFile') {
          return { ...sec, imageFile: value as File | null }; // Un 'null' explícito es más seguro
        }
        return sec;
      })
    );
  };
  // --- FIN: NUEVOS MANEJADORES DE SECCIONES ---


  // --- INICIO: MODIFICACIÓN GRANDE DE 'handleSubmit' ---
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    // setMessage('');
    setErrors({});
    setIsLoading(true);

    if (!user) {
      toast.error('Error: Debes estar autenticado.');
      navigate('/login');
      return;
    }

    const formData = new FormData();

    formData.append('title', title);
    formData.append('game_id', gameId);
    // formData.append('user_id', String(user.id)); // No es necesario, el backend usa Auth::id()

    sections.forEach((section, index) => {
      formData.append(`sections[${index}][order]`, String(section.order));
      formData.append(`sections[${index}][type]`, section.type);

      if (section.type === 'image' && section.imageFile) {
        formData.append(`sections[${index}][image]`, section.imageFile);
      } else if (section.type !== 'image') {
        formData.append(`sections[${index}][content]`, section.content);
      }

      // NOTA: Si es 'image' pero 'imageFile' es null (no se cambió),
      // no adjuntamos ni 'image' ni 'content'.
      // El backend (update) debería ser lo suficientemente listo
      // para ignorar la sección si no viene 'image' ni 'content'
      // y mantener la imagen antigua.
      // (Nuestra lógica actual de "borrar y recrear" en el backend
      // es simple pero requiere que el frontend sea más explícito,
      // pero por ahora, esto funcionará para 'crear')
    });

    if (isEditMode) {
      formData.append('_method', 'PUT');
    }

    try {
      const requestUrl = isEditMode ? `/api/guides/${guideId}` : '/api/guides';
      // Usamos POST para ambos, ya que '_method' maneja el 'PUT'
      const response = await api.post(requestUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Axios suele hacer esto, pero no hace daño
        },
      });

      toast.success(
        isEditMode ? 'Guía actualizada exitosamente' : 'Guía creada exitosamente'
      );

      setTimeout(() => {
        navigate(`/guides/${response.data.id}`);
      }, 1500);

    } catch (error: any) {
      // (Tu manejo de errores está perfecto)
      console.error('Error al guardar la guía:', error);
      if (error?.response?.status === 401) {
        await api.post('/logout');
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/login', { state: { from: 'session-expired' } });
      } else if (error?.response?.status === 419) {
        toast.error('La sesión ha expirado (CSRF). Por favor, recarga la página e intenta de nuevo.');
      } else if (error?.response?.status === 422 && error.response.data?.errors) {
        setErrors(error.response.data.errors as Record<string, string[]>);
        toast.error('Por favor, corrige los errores en el formulario.');
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || 'Error desconocido';
        toast.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} la guía: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  // --- FIN: MODIFICACIÓN GRANDE DE 'handleSubmit' ---

  if (userLoading || (isEditMode && isLoading && !title)) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <div className="text-center text-[var(--color-text-primary)] p-8">
            {isEditMode ? 'Cargando datos de la guía...' : 'Cargando...'}
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded text-center">
            Debes estar autenticado para {isEditMode ? 'editar' : 'crear'} una guía. Redirigiendo...
          </div>
        </main>
      </>
    );
  }

  // --- INICIO: MEJORA DE URL DE IMAGEN ---
  // Hacemos que la URL del backend sea dinámica usando variables de entorno
  // (igual que en tu 'api.ts')
  const backendUrl = API_URL;
  // --- FIN: MEJORA DE URL DE IMAGEN ---

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6 pb-4 border-b border-[var(--color-accent)]">
            {isEditMode ? 'Editar Guía' : 'Crear Nueva Guía'}
          </h2>

          {/* message block removed */}

          <div className="mb-6">
            <label htmlFor="title" className="block text-lg font-medium text-[var(--color-text-primary)] mb-2">
              Título de la guía:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full p-3 border border-[var(--color-accent)] rounded bg-[#1e1e1e] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              placeholder="Ej: Guía completa de The Witcher 3"
              disabled={isLoading}
            />
            {errors.title && (
              <span className="text-red-400 text-sm mt-1 block">{errors.title[0]}</span>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="game_id" className="block text-lg font-medium text-[var(--color-text-primary)] mb-2">
              Videojuego:
            </label>
            <select
              id="game_id"
              name="game_id"
              value={gameId}
              onChange={e => setGameId(e.target.value)}
              required
              disabled={isLoading || isEditMode}
              className="w-full p-3 border border-[var(--color-accent)] rounded bg-[#1e1e1e] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent appearance-none disabled:opacity-70 disabled:bg-gray-800"
            >
              <option value="" className="text-gray-500">Selecciona un videojuego</option>
              {videoGames.map(game => (
                <option key={game.id} value={String(game.id)} className="bg-[#2a2a2a] text-white">
                  {game.title}
                </option>
              ))}
            </select>
            {errors.game_id && (
              <span className="text-red-400 text-sm mt-1 block">{errors.game_id[0]}</span>
            )}
          </div>


          {/* --- INICIO: SECCIÓN DE CONTENIDO DINÁMICO --- */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-[var(--color-text-primary)] mb-2">
              Contenido de la Guía:
            </label>

            <div className="space-y-6">
              {sections.map((section, index) => (
                <div
                  key={section.tempId}
                  className="bg-[#1e1e1e] border border-[var(--color-accent)] rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-[var(--color-text-secondary)] uppercase text-sm">
                      Sección {index + 1}: {section.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(section.tempId)}
                      className={`px-2 py-1 text-xs text-white rounded transition-colors ${confirmDeleteId === section.tempId
                        ? 'bg-red-800 hover:bg-red-900 font-bold'
                        : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                      {confirmDeleteId === section.tempId ? '¿Seguro?' : 'Eliminar'}
                    </button>
                  </div>

                  {section.type === 'text' && (
                    <textarea
                      value={section.content}
                      onChange={e => handleSectionChange(section.tempId, 'content', e.target.value)}
                      rows={8}
                      className="w-full p-3 border border-[#3a3a3a] rounded bg-[#2a2a2a] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono text-sm"
                      placeholder="Escribe tu texto aquí (soporta Markdown)..."
                    />
                  )}

                  {section.type === 'image' && (
                    <div>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        // --- INICIO: CORRECCIÓN ERROR 2 ---
                        // Aseguramos que el valor sea 'File' o 'null', nunca 'undefined'
                        onChange={e => handleSectionChange(section.tempId, 'imageFile', (e.target.files && e.target.files[0]) ? e.target.files[0] : null)}
                        // --- FIN: CORRECCIÓN ERROR 2 ---
                        className="w-full text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-[var(--color-text-primary)] hover:file:bg-opacity-90"
                      />
                      {isEditMode && section.image_path && !section.imageFile && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">Imagen actual:</p>
                          {/* --- MEJORA: URL dinámica --- */}
                          <img src={`${backendUrl}/storage/${section.image_path}`} alt="Vista previa" className="max-w-xs rounded mt-1" />
                        </div>
                      )}
                    </div>
                  )}

                  {section.type === 'video' && (
                    <input
                      type="text"
                      value={section.content}
                      onChange={e => handleSectionChange(section.tempId, 'content', e.target.value)}
                      className="w-full p-3 border border-[#3a3a3a] rounded bg-[#2a2a2a] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="Pega la URL del video (ej: YouTube, Vimeo)"
                    />
                  )}

                  {/* --- INICIO: CORRECCIÓN ERRORES 3 Y 4 --- */}
                  {/* Usamos 'optional chaining' (?.) para evitar crasheos */}
                  {errors[`sections.${index}.content`]?.[0] && (
                    <span className="text-red-400 text-sm mt-1 block">
                      {String(errors[`sections.${index}.content`]?.[0] || '')}
                    </span>
                  )}
                  {errors[`sections.${index}.image`]?.[0] && (
                    <span className="text-red-400 text-sm mt-1 block">
                      {String(errors[`sections.${index}.image`]?.[0] || '')}
                    </span>
                  )}
                  {/* --- FIN: CORRECCIÓN ERRORES 3 Y 4 --- */}
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-6 pt-4 border-t border-[var(--color-accent)]">
              <span className="text-sm font-medium text-[var(--color-text-primary)] self-center">Añadir sección:</span>
              <button
                type="button"
                onClick={() => handleAddSection('text')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Texto
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('image')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Imagen
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('video')}
                className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                + Video
              </button>
            </div>
            {errors.sections && (
              <span className="text-red-400 text-sm mt-1 block">{errors.sections[0]}</span>
            )}
          </div>
          {/* --- FIN: SECCIÓN DE CONTENIDO DINÁMICO --- */}


          <div className="flex justify-end gap-4 pt-4 border-t border-[var(--color-accent)]">
            <button
              type="button"
              onClick={() => navigate(isEditMode ? `/guides/${guideId}` : '/profile')}
              disabled={isLoading}
              className="px-6 py-2 border border-[var(--color-accent)] text-[var(--color-text-primary)] rounded hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || sections.length === 0}
              className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-text-primary)] font-bold rounded hover:bg-opacity-90 transition-all hover:shadow-[0_0_15px_rgba(231,0,0,0.3)] disabled:opacity-50"
            >
              {isLoading
                ? 'Guardando...'
                : isEditMode ? 'Actualizar Guía' : 'Publicar Guía'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default CreateGuidePage;