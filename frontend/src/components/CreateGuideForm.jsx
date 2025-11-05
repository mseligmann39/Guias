// src/components/CreateGuideForm.js

import React, { useState, useEffect } from 'react';
import api from '../context/api';

const CreateGuideForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        game_id: '',
    });

    const [videoGames, setVideoGames] = useState([]);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    // Cargar los juegos para el selector
    useEffect(() => {
        api.get('/api/games')
            .then(response => {
                setVideoGames(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error('Error al cargar los juegos:', error);
                setVideoGames([]);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario.
        setMessage('');
        setErrors({});

        try {
            // Laravel Sanctum se encarga de la protección CSRF obteniendo una cookie primero
            await api.get('/sanctum/csrf-cookie');

            const response = await api.post('/api/guides', formData);

            setMessage(response.data.message);
            // Limpiar el formulario
            setFormData({
                title: '',
                content: '',
                game_id: '',
            });

        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Errores de validación de Laravel
                setErrors(error.response.data.errors);
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
                    {Array.isArray(videoGames) && videoGames.map(game => (
                        <option key={game.id} value={game.id}>{game.title ?? game.name}</option>
                    ))}
                </select>
                {errors.game_id && <span className="error">{errors.game_id[0]}</span>}
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
                {errors.content && <span className="error">{errors.content[0]}</span>}
            </div>

            <button type="submit">Crear Guía</button>
        </form>
    );
};

export default CreateGuideForm;