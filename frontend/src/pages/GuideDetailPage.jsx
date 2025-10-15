import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/layout/Header';
import './GuideDetailPage.css'; // Crearemos este archivo para los estilos

function GuideDetailPage() {
  const { id } = useParams(); // Obtenemos el ID de la guía desde la URL
  const [guide, setGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const guideURL = `${import.meta.env.VITE_API_BASE_URL}guides/${id}`;
    axios.get(guideURL)
      .then(response => {
        setGuide(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar la guía:", error);
        setIsLoading(false);
      });
  }, [id]); // El efecto se vuelve a ejecutar si el ID cambia

  if (isLoading) {
    return <><Header /><p className="page-status">Cargando guía...</p></>;
  }

  if (!guide) {
    return <><Header /><p className="page-status">Guía no encontrada.</p></>;
  }

  return (
    <>
      <Header />
      <main className="guide-detail-page">
        <article className="guide-content">
          <h1 className="guide-title">{guide.title}</h1>
          <div className="guide-meta">
            <span>Guía para: </span>
            <Link to={`/games/${guide.game.id}`} className="game-link">{guide.game.title}</Link>
          </div>

          {/* ATENCIÓN: Explicación importante sobre la siguiente línea */}
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