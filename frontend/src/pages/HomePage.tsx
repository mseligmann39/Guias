import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Importación de hooks y componentes necesarios
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination'; 

import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import PopularGuides from '../components/PopularGuides';

/**
 * Interfaz que define la estructura de un juego
 * @property {number|string} id - Identificador único del juego
 * @property {string} title - Título del juego
 * @property {string} cover_image_url - URL de la imagen de portada
 */
interface Game {
  id: number | string;
  title: string;
  cover_image_url: string;
}

/**
 * Interfaz para los enlaces de paginación
 * @property {string | null} url - URL de la página
 * @property {string} label - Etiqueta del enlace
 * @property {boolean} active - Indica si es la página actual
 */
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

/**
 * Interfaz para la información de paginación
 * @property {number} current_page - Número de la página actual
 * @property {number} last_page - Número de la última página
 */
interface PaginationMeta {
  current_page: number;
  last_page: number;
}

function HomePage() {
  // Estado para almacenar los juegos de la página actual
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para la paginación
  const [links, setLinks] = useState<PaginationLink[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  // Hook para manejar los parámetros de búsqueda en la URL
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Efecto para cargar los juegos con paginación
   * Se ejecuta cuando cambian los parámetros de búsqueda en la URL
   */
  useEffect(() => {
    const page = searchParams.get('page') || '1';
    const apiURL = `${import.meta.env.VITE_API_BASE_URL}games`;

    const fetchGames = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(apiURL, { params: { page } });
        setGames(response.data.data);
        setLinks(response.data.links);
        setMeta(response.data.meta);
      } catch (error) {
        console.error("Error al cargar los juegos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [searchParams]); // <-- ¡Se re-ejecuta cada vez que 'searchParams' (la URL) cambia!


  /**
   * Maneja el cambio de página en la paginación
   * @param {string} url - URL de la página a la que se quiere navegar
   */
  const handlePageChange = (url: string) => {
    if (!url) return;

    const pageQuery = new URL(url).searchParams.get('page');
    if (pageQuery) {
      setSearchParams({ page: pageQuery });
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Header />
      
      <main className="p-8">


        {isLoading ? (
          <p className="text-center p-8 text-[var(--color-text-secondary)]">Cargando juegos...</p>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
              {/* Lista de juegos de la página actual */}
              {games.map(game => (
                <Card
                  key={game.id}
                  title={game.title}
                  imageUrl={game.cover_image_url}
                  linkUrl={`/games/${game.id}`}
                />
              ))}
            </div>

            {/* Componente de paginación */}
            <Pagination links={links} onPageChange={handlePageChange} />
          </>
        )}
        <div className="container mx-auto px-4">
        <PopularGuides />
      </div>
      </main>
    </>
  );
}

export default HomePage;