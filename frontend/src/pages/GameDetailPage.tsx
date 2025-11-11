import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/layout/Header';
import { getGuides } from '../context/api';

// Definición de interfaces para tipos estrictos
interface Category {
  id: number | string;
  name: string;
}

interface Guide {
  id: number | string;
  title: string;
  slug: string;
  rating?: number;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
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
  const [guides, setGuides] = useState<Guide[]>([]);
  const [guidesLoading, setGuidesLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'rating_desc'>('newest');

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

  // Cargar guías con filtros
  useEffect(() => {
    const fetchGuides = async () => {
      if (!id) return;
      
      setGuidesLoading(true);
      try {
        const response = await getGuides({
          game_id: id,
          sort: sortOrder,
        });
        setGuides(response.data.data);
      } catch (err) {
        console.error("Error al cargar guías:", err);
      } finally {
        setGuidesLoading(false);
      }
    };

    fetchGuides();
  }, [id, sortOrder]);

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl border-b-2 border-[var(--color-primary)] pb-2 text-[var(--color-text-primary)]">
              Guías para {game.title}
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-[var(--color-text-secondary)]">Ordenar por:</label>
              <select
                id="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'rating_desc')}
                className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">Más Nuevas</option>
                <option value="rating_desc">Mejor Valoradas</option>
              </select>
            </div>
          </div>

          {guidesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : guides.length > 0 ? (
            <div className="space-y-4">
              {guides.map(guide => (
                <Link
                  key={guide.id}
                  to={`/guides/${guide.id}`}
                  className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
                >
                  <h3 className="text-xl font-medium text-white mb-1">{guide.title}</h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <span>Por {guide.user?.name || 'Usuario desconocido'}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(guide.created_at).toLocaleDateString()}</span>
                    {guide.rating !== undefined && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-yellow-400">
                          {guide.rating.toFixed(1)} ★
                        </span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[var(--color-text-secondary)]">No se encontraron guías para este juego.</p>
              <Link
                to="/guides/new"
                className="inline-block mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Crear la primera guía
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default GameDetailPage;
