import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/layout/Header';
import './GuideDetailPage.css';

// Definición de tipos para la estructura de la guía esperada de la API
interface Game {
  id: number | string;
  title: string;
}

interface Guide {
  id: number | string;
  title: string;
  content: string;
  game: Game;
}

function GuideDetailPage() {
  const { id } = useParams<{ id: string }>();
  // Inicializamos el estado con "Guide | null" para obtener tipado correcto
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const guideURL = `${import.meta.env.VITE_API_BASE_URL}guides/${id}`;
    axios.get<Guide>(guideURL)
      .then(response => {
        setGuide(response.data);
      })
      .catch(error => {
        console.error("Error al cargar la guía:", error);
        setGuide(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <p className="page-status">Cargando guía...</p>
      </>
    );
  }

  if (!guide) {
    return (
      <>
        <Header />
        <p className="page-status">Guía no encontrada.</p>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="guide-detail-page">
        <article className="guide-content">
          <h1 className="guide-title">{guide.title}</h1>
          <div className="guide-meta">
            <span>Guía para: </span>
            <Link to={`/games/${guide.game.id}`} className="game-link">
              {guide.game.title}
            </Link>
          </div>
          {/* 
            ATENCIÓN: Esta línea utiliza "dangerouslySetInnerHTML" 
            para renderizar HTML desde la guía.
            No lo uses si no confías en el contenido. 
          */}
          <div
            className="guide-body"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />
        </article>
      </main>
    </>
  );
}

export default GuideDetailPage;
