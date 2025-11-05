import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/layout/Header';
import './GameDetailPage.css';

// Definición de interfaces para tipos estrictos
interface Category {
  id: number | string;
  name: string;
}

interface Guide {
  id: number | string;
  title: string;
}

interface Game {
  id: number | string;
  title: string;
  cover_image_url: string;
  description: string;
  categories: Category[];
  guides: Guide[];
}

function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const gameURL = `${import.meta.env.VITE_API_BASE_URL}games/${id}`;

    axios.get<Game>(gameURL)
      .then(response => {
        setGame(response.data);
      })
      .catch(error => {
        console.error("Error al cargar los detalles del juego:", error);
        setGame(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando detalles del juego...</p>
      </>
    );
  }

  if (!game) {
    return (
      <>
        <Header />
        <p style={{ textAlign: 'center', padding: '2rem' }}>Juego no encontrado.</p>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="game-detail-page">
        <h1 className="game-title">{game.title}</h1>
        <img src={game.cover_image_url} alt={`Portada de ${game.title}`} className="game-cover" />
        <p className="game-description">{game.description}</p>
        
        <div className="game-categories">
          {/* Mapeamos las categorías del juego y renderizamos una etiqueta por cada una */}
          {game.categories && game.categories.length > 0 ? (
            game.categories.map(category => (
              <span key={category.id} className="category-tag">{category.name}</span>
            ))
          ) : (
            <span className="category-tag">Sin categoría</span>
          )}
        </div>

        <hr />

        <div className="guides-list">
          <h2>Guías para {game.title}</h2>
          {game.guides && game.guides.length > 0 ? (
            <ul>
              {game.guides.map(guide => (
                <li key={guide.id}>
                  <Link to={`/guides/${guide.id}`}>{guide.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Todavía no hay guías para este juego.</p>
          )}
        </div>
      </main>
    </>
  );
}

export default GameDetailPage;
