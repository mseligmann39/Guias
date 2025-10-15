import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams para leer el :id de la URL
import axios from 'axios';
import Header from '../components/layout/Header';
import './GameDetailPage.css'; // Estilos para esta página

function GameDetailPage() {
  const { id } = useParams(); // Obtenemos el ID del juego desde la URL
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // La URL ahora apunta a un juego específico
    const gameURL = `${import.meta.env.VITE_API_BASE_URL}games/${id}`;

    axios.get(gameURL)
      .then(response => {
        setGame(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar los detalles del juego:", error);
        setIsLoading(false);
      });
  }, [id]); // Este efecto se ejecuta cada vez que el ID de la URL cambie

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
          {game.categories.map(category => (
            <span key={category.id} className="category-tag">{category.name}</span>
          ))}
        </div>

        <hr />

        <div className="guides-list">
          <h2>Guías para {game.title}</h2>
          {game.guides.length > 0 ? (
            <ul>
              {game.guides.map(guide => (
                <li key={guide.id}>
                  {/* Eventualmente este Link te llevará a la página de la guía */}
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