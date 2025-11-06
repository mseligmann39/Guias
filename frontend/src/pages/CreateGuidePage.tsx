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
    
    const res = await api.post('/api/guides', {
      ...formData,
      user_id: user.id
    });
    
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
        <main className="create-guide-page-container">
          <div className="profile-status">Cargando...</div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="create-guide-page-container">
          <div className="error-message">
            Debes estar autenticado para crear una guía. Redirigiendo...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="create-guide-page-container">
        <form onSubmit={handleSubmit} className="create-guide-form">
          <h2>Crear Nueva Guía</h2>
          {message && <div className="success-message">{message}</div>}
          <div>
            <label htmlFor="title">Título:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            {errors.title && <span className="error">{errors.title[0]}</span>}
          </div>
          <div>
            <label htmlFor="game_id">Videojuego:</label>
            <select
              id="game_id"
              name="game_id"
              value={formData.game_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un videojuego</option>
              {videoGames.map(game => (
                <option key={game.id} value={String(game.id)}>
                  {game.title}
                </option>
              ))}
            </select>
            {errors.game_id && (
              <span className="error">{errors.game_id[0]}</span>
            )}
          </div>
          <div>
            <label htmlFor="content">Contenido de la Guía:</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
            {errors.content && (
              <span className="error">{errors.content[0]}</span>
            )}
          </div>
          <div className="form-actions">
            <button type="submit">Crear Guía</button>
            <button type="button" onClick={() => navigate('/profile')}>
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default CreateGuidePage;

