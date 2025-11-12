import React, { useState, useEffect } from 'react';
import axios from 'axios';
// ¡NUEVO! Importamos useSearchParams y el componente Pagination
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination'; // Ajusta la ruta

import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import PopularGuides from '../components/PopularGuides';

// Definir el tipo de los juegos
interface Game {
  id: number | string;
  title: string;
  cover_image_url: string;
}

// Definir el tipo para los 'links' y 'meta' de la paginación de Laravel
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
interface PaginationMeta {
  current_page: number;
  last_page: number;
  // ... (puedes añadir 'total', 'per_page', etc. si los necesitas)
}

function HomePage() {
  const [games, setGames] = useState<Game[]>([]); // Almacena solo los juegos de la página actual
  const [isLoading, setIsLoading] = useState(true);
  
  // --- ¡NUEVO! Estado de Paginación ---
  const [links, setLinks] = useState<PaginationLink[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  // --- ¡NUEVO! Hook para la URL ---
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Obtener los juegos de la API (ahora con paginación)
  useEffect(() => {
    // Obtenemos la página de la URL (ej. /?page=2) o usamos '1' por defecto
    const page = searchParams.get('page') || '1'; 
    const apiURL = `${import.meta.env.VITE_API_BASE_URL}games`;

    setIsLoading(true);
    
    axios.get(apiURL, {
      params: { page: page } // <-- ¡Añadimos el parámetro 'page' a la petición!
    })
      .then(response => {
        // La API de paginación devuelve un objeto con 'data', 'links', 'meta'
        setGames(response.data.data);           // La lista de juegos
        setLinks(response.data.links);          // Los enlaces (prev, 1, 2, 3, next)
        setMeta(response.data.meta);            // Información (página actual, total)
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Hubo un error al obtener los juegos:", error);
        setIsLoading(false);
      });
  }, [searchParams]); // <-- ¡Se re-ejecuta cada vez que 'searchParams' (la URL) cambia!

  // --- ¡ELIMINADO! ---
  // Ya no necesitamos el 'filteredGames', 'searchTerm' ni el segundo useEffect.
  // La barra de búsqueda global del Header se encargará de buscar.

  // --- ¡NUEVO! Handler de Paginación ---
  const handlePageChange = (url: string) => {
    if (!url) return; // No hacer nada si la URL es null

    // Extraemos el parámetro "?page=X" de la URL completa
    const pageQuery = new URL(url).searchParams.get('page');
    if (pageQuery) {
      setSearchParams({ page: pageQuery }); // Actualiza la URL: /?page=X
      window.scrollTo(0, 0); // Opcional: sube al inicio de la página
    }
  };

  // --- Renderizado ---
  return (
    <>
      <Header />
      <div className="container mx-auto px-4">
        <PopularGuides />
      </div>
      <main className="p-8">

        {/* --- ¡ELIMINADO! --- */}
        {/* Ya no mostramos la barra de búsqueda local. 
            La barra global del Header es ahora la única. */}

        {isLoading ? (
          <p className="text-center p-8 text-[var(--color-text-secondary)]">Cargando juegos...</p>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
              {/* 'games' ahora solo tiene los 18-20 juegos de la página actual */}
              {games.map(game => (
                <Card
                  key={game.id}
                  title={game.title}
                  imageUrl={game.cover_image_url}
                  linkUrl={`/games/${game.id}`}
                />
              ))}
            </div>

            {/* --- ¡NUEVO! Renderiza la paginación --- */}
            <Pagination links={links} onPageChange={handlePageChange} />
          </>
        )}
      </main>
    </>
  );
}

export default HomePage;