import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/context/api';
import { useAuth } from '@/context/auth';
import Header from '../components/layout/Header';
import type { Game } from '@/types';

interface FormDataState {
  title: string;
  content: string;
  game_id: string;
}

const CreateGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuth();
  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    content: '',
    game_id: '',
  });
  const [videoGames, setVideoGames] = useState<Game[]>([]);
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // Redirigir al login si no está autenticado
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    api
      .get<Game[]>('/api/games')
      .then(res => setVideoGames(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Error al cargar los juegos:', err);
        setVideoGames([]);
      });
  }, []);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 // Cambiar la configuración de la petición para incluir credenciales
const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
  e.preventDefault();
  setMessage('');
  setErrors({});
  
  if (!user) {
    setMessage('Error: Debes estar autenticado para crear una guía.');
    navigate('/login');
    return;
  }

  try {
    console.log('🍪 Cookies disponibles:', document.cookie);
    console.log('📤 Enviando datos:', formData);
    // Obtener el token CSRF de la cookie y enviarlo explícitamente por si axios
    // no lo añade automáticamente en cross-origin requests.
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2] ?? '') : null;
    };
    const xsrf = getCookie('XSRF-TOKEN');

    const res = await api.post(
      '/api/guides',
      {
        ...formData,
        user_id: user.id,
      },
      {
        withCredentials: true,
        headers: {
          'X-XSRF-TOKEN': xsrf || '',
        },
      }
    );
    
    console.log('✅ Respuesta exitosa:', res.data);
    setMessage(res.data?.message ?? 'Guía creada exitosamente');
    setFormData({ title: '', content: '', game_id: '' });
    
    setTimeout(() => {
      navigate('/profile');
    }, 1500);
  } catch (error: any) {
    console.error('❌ Error al crear la guía:', error);
    
    if (error?.response?.status === 401) {
      await api.post('/logout');
      setMessage('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      navigate('/login', { state: { from: 'session-expired' } });
    } else if (error?.response?.status === 419) {
      setMessage('La sesión ha expirado. Por favor, recarga la página e intenta de nuevo.');
    } else if (error?.response?.status === 422 && error.response.data?.errors) {
      setErrors(error.response.data.errors as Record<string, string[]>);
      setMessage('Por favor, corrige los errores en el formulario.');
    } else {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error desconocido';
      setMessage(`Error al crear la guía: ${errorMessage}`);
    }
  }
};
  // Verificar autenticación antes de renderizar
  if (userLoading) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <div className="text-center text-[var(--color-text-primary)] p-8">Cargando...</div>
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
            Debes estar autenticado para crear una guía. Redirigiendo...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-[#2a2a2a] border border-[var(--color-accent)] rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6 pb-4 border-b border-[var(--color-accent)]">
            Crear Nueva Guía
          </h2>
          
          {message && (
            <div className={`p-4 mb-6 rounded ${
              message.includes('éxito') ? 'bg-green-900/30 border border-green-700 text-green-200' : 
              'bg-red-900/30 border border-red-700 text-red-200'
            }`}>
              {message}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="title" className="block text-lg font-medium text-[var(--color-text-primary)] mb-2">
              Título de la guía:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-[var(--color-accent)] rounded bg-[#1e1e1e] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              placeholder="Ej: Guía completa de The Witcher 3"
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
              value={formData.game_id}
              onChange={handleChange}
              required
              className="w-full p-3 border border-[var(--color-accent)] rounded bg-[#1e1e1e] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent appearance-none"
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
          
          <div className="mb-8">
            <label htmlFor="content" className="block text-lg font-medium text-[var(--color-text-primary)] mb-2">
              Contenido de la Guía:
            </label>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
              Usa Markdown para dar formato a tu guía. Puedes usar # para títulos, **negrita**, *cursiva*, listas con - o 1., etc.
            </p>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              className="w-full p-3 border border-[var(--color-accent)] rounded bg-[#1e1e1e] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent font-mono text-sm"
              placeholder="## Introducción\n\nEscribe aquí el contenido de tu guía..."
            />
            {errors.content && (
              <span className="text-red-400 text-sm mt-1 block">{errors.content[0]}</span>
            )}
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t border-[var(--color-accent)]">
            <button 
              type="button" 
              onClick={() => navigate('/profile')}
              className="px-6 py-2 border border-[var(--color-accent)] text-[var(--color-text-primary)] rounded hover:bg-[#3a3a3a] transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-text-primary)] font-bold rounded hover:bg-opacity-90 transition-all hover:shadow-[0_0_15px_rgba(231,0,0,0.3)]"
            >
              Publicar Guía
            </button>
            </div>
        </form>
      </main>
    </>
  );
};

export default CreateGuidePage;

