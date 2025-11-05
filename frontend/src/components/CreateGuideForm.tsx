import React, { useEffect, useState } from 'react';
import api from '@/context/api';
import type { Game } from '@/types';

interface FormDataState {
  title: string;
  content: string;
  game_id: string;
}

const CreateGuideForm: React.FC = () => {
  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    content: '',
    game_id: '',
  });
  const [videoGames, setVideoGames] = useState<Game[]>([]);
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});

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

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    setMessage('');
    setErrors({});
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.post('/api/guides', formData);
      setMessage(res.data?.message ?? 'Guía creada');
      setFormData({ title: '', content: '', game_id: '' });
    } catch (error: any) {
      if (error?.response?.status === 422 && error.response.data?.errors) {
        setErrors(error.response.data.errors as Record<string, string[]>);
      } else {
        console.error('Ha ocurrido un error:', error);
        setMessage('Error al crear la guía. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Crear Guía</button>
    </form>
  );
};

export default CreateGuideForm;