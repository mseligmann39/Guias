import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/layout/Header';
import './HomePage.css'; 
import Card from '../components/ui/Card';

function HomePage() {
  // --- ESTADO DEL COMPONENTE ---
  const [games, setGames] = useState([]); // Almacena la lista COMPLETA de juegos
  const [filteredGames, setFilteredGames] = useState([]); // Almacena los juegos a MOSTRAR
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
      <main className="homepage-main">
  
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar juegos por título..."
            className="search-bar"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} // Actualiza el estado en cada tecleo
          />
        </div>

        {isLoading ? (
          <p>Cargando juegos...</p>
        ) : (
          <div className="game-grid">
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