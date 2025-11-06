import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/layout/Header';

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
        <p className="text-center p-8 text-xl text-[var(--color-text-secondary)]">Cargando guía...</p>
      </>
    );
  }

  if (!guide) {
    return (
      <>
        <Header />
        <p className="text-center p-8 text-xl text-[var(--color-text-secondary)]">Guía no encontrada.</p>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-[800px] my-8 mx-auto p-8">
        <article className="bg-[#2a2a2a] rounded-lg py-8 px-12 border border-[var(--color-accent)]">
          <h1 className="font-[var(--font-heading)] text-[2.8rem] mb-2 leading-tight text-[var(--color-text-primary)]">{guide.title}</h1>
          <div className="mb-8 text-lg text-[var(--color-text-secondary)]">
            <span>Guía para: </span>
            <Link to={`/games/${guide.game.id}`} className="text-[var(--color-primary)] no-underline font-bold hover:underline">
              {guide.game.title}
            </Link>
          </div>
          {/* 
            ATENCIÓN: Esta línea utiliza "dangerouslySetInnerHTML" 
            para renderizar HTML desde la guía.
            No lo uses si no confías en el contenido. 
          */}
          <div
            className="text-lg leading-[1.7] text-[var(--color-text-secondary)] [&_h2]:font-[var(--font-heading)] [&_h2]:text-[var(--color-text-primary)] [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-[var(--color-accent)] [&_h2]:pb-2 [&_h3]:font-[var(--font-heading)] [&_h3]:text-[var(--color-text-primary)] [&_h3]:mt-8 [&_h3]:mb-4 [&_h3]:border-b [&_h3]:border-[var(--color-accent)] [&_h3]:pb-2 [&_h4]:font-[var(--font-heading)] [&_h4]:text-[var(--color-text-primary)] [&_h4]:mt-8 [&_h4]:mb-4 [&_h4]:border-b [&_h4]:border-[var(--color-accent)] [&_h4]:pb-2 [&_p]:mb-4 [&_ul]:pl-8 [&_ul]:mb-4 [&_ol]:pl-8 [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-[var(--color-primary)] [&_strong]:text-[var(--color-text-primary)]"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />
        </article>
      </main>
    </>
  );
}

export default GuideDetailPage;
