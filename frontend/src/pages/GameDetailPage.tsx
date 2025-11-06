import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/layout/Header';

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
        <p className="text-center p-8 text-[var(--color-text-secondary)]">Cargando detalles del juego...</p>
      </>
    );
  }

  if (!game) {
    return (
      <>
        <Header />
        <p className="text-center p-8 text-[var(--color-text-secondary)]">Juego no encontrado.</p>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-[900px] my-8 mx-auto p-8 flex flex-col gap-6">
        <h1 className="font-[var(--font-heading)] text-5xl text-center text-[var(--color-text-primary)] mb-4">{game.title}</h1>
        <img src={game.cover_image_url} alt={`Portada de ${game.title}`} className="w-full max-w-[400px] h-auto rounded-lg mx-auto block" />
        <p className="text-lg leading-relaxed text-[var(--color-text-secondary)] text-justify">{game.description}</p>
        
        <div className="flex flex-wrap gap-2 justify-center my-4">
          {/* Mapeamos las categorías del juego y renderizamos una etiqueta por cada una */}
          {game.categories && game.categories.length > 0 ? (
            game.categories.map(category => (
              <span key={category.id} className="bg-[var(--color-accent)] text-[var(--color-text-primary)] py-1.5 px-3 rounded-full text-sm font-bold">{category.name}</span>
            ))
          ) : (
            <span className="bg-[var(--color-accent)] text-[var(--color-text-primary)] py-1.5 px-3 rounded-full text-sm font-bold">Sin categoría</span>
          )}
        </div>

        <hr className="border-none border-t border-[var(--color-accent)] w-full my-4" />

        <div className="w-full">
          <h2 className="text-3xl mb-4 border-b-2 border-[var(--color-primary)] pb-2 text-[var(--color-text-primary)]">Guías para {game.title}</h2>
          {game.guides && game.guides.length > 0 ? (
            <ul className="list-none p-0">
              {game.guides.map(guide => (
                <li key={guide.id} className="mb-3">
                  <Link to={`/guides/${guide.id}`} className="text-[var(--color-text-secondary)] no-underline text-xl transition-colors duration-200 hover:text-[var(--color-primary)]">{guide.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--color-text-secondary)]">Todavía no hay guías para este juego.</p>
          )}
        </div>
      </main>
    </>
  );
}

export default GameDetailPage;
