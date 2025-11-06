import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';

// Definir el tipo de los juegos que esperan venir de la API
interface Game {
  id: number | string;
  title: string;
  cover_image_url: string;
}

function HomePage() {
  // --- ESTADO DEL COMPONENTE ---
  const [games, setGames] = useState<Game[]>([]); // Almacena la lista COMPLETA de juegos
  const [filteredGames, setFilteredGames] = useState<Game[]>([]); // Almacena los juegos a MOSTRAR
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Almacena el texto del buscador

  // --- EFECTOS (LÓGICA) ---

  // 1. Obtener todos los juegos de la API al cargar la página
  useEffect(() => {
    const apiURL = `${import.meta.env.VITE_API_BASE_URL}games`;
    axios.get(apiURL)
      .then(response => {
        setGames(response.data);
        setFilteredGames(response.data); // Inicialmente, mostramos todos
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Hubo un error al obtener los juegos:", error);
        setIsLoading(false);
      });
  }, []); // El array vacío asegura que esto solo se ejecuta una vez

  // 2. Filtrar los juegos cada vez que el término de búsqueda cambia
  useEffect(() => {
    const results = games.filter(game =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGames(results);
  }, [searchTerm, games]); 

  // --- Renderizado ---

  return (
    <>
      <Header />
      <main className="p-8">

        <div className="mb-8 text-center">
          <input
            type="text"
            placeholder="Buscar juegos por título..."
            className="w-full max-w-[600px] mx-auto py-3 px-4 text-lg rounded-lg border border-[var(--color-accent)] bg-[#2a2a2a] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} // Actualiza el estado en cada tecleo
          />
        </div>

        {isLoading ? (
          <p className="text-center p-8 text-[var(--color-text-secondary)]">Cargando juegos...</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
            {filteredGames.map(game => (
              <Card
                key={game.id}
                title={game.title}
                imageUrl={game.cover_image_url}
                linkUrl={`/games/${game.id}`}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default HomePage;