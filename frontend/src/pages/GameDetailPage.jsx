import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams para leer el :id de la URL
import axios from 'axios';
import Header from '../components/layout/Header';
import './GameDetailPage.css'; // Estilos para esta página
// Función que renderiza la página de detalles de un juego
// Recibe un objeto game con la información del juego
function GameDetailPage() {
  const { id } = useParams(); // Obtenemos el ID del juego desde la URL
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // La URL ahora apunta a un juego específico
    const gameURL = `${import.meta.env.VITE_API_BASE_URL}games/${id}`;

    // Hacemos una petición GET a la API para obtener los detalles del juego
    axios.get(gameURL)
      .then(response => {
        // Actualizamos el estado con los detalles del juego
        setGame(response.data);
        // Quitamos el estado de carga
        setIsLoading(false);
      })
      .catch(error => {
        // Mostramos el error en la consola
        console.error("Error al cargar los detalles del juego:", error);
        // Quitamos el estado de carga
        setIsLoading(false);
      });
  }, [id]); // Este efecto se ejecuta cada vez que el ID de la URL cambie

  // Si el juego está cargando, mostramos un mensaje
  if (isLoading) {
    return (
      <>
        <Header />
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando detalles del juego...</p>
      </>
    );
  }

  // Si no hay juego, mostramos un mensaje
  if (!game) {
    return (
      <>
        <Header />
        <p style={{ textAlign: 'center', padding: '2rem' }}>Juego no encontrado.</p>
      </>
    );
  }

  // Renderizamos la página con los detalles del juego
  return (
    <>
      <Header />
      <main className="game-detail-page">
        <h1 className="game-title">{game.title}</h1>
        <img src={game.cover_image_url} alt={`Portada de ${game.title}`} className="game-cover" />
        <p className="game-description">{game.description}</p>
        
        <div className="game-categories">
          {/* Mapeamos las categorías del juego y renderizamos una etiqueta por cada una */}
          {game.categories.map(category => (
            <span key={category.id} className="category-tag">{category.name}</span>
          ))}
        </div>

        <hr />

        <div className="guides-list">
          <h2>Guías para {game.title}</h2>
          {/* Si el juego tiene guías, renderizamos una lista de enlaces a cada guía */}
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

