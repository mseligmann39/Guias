import React from 'react';
import { Link } from 'react-router-dom';

// Función que renderiza una tarjeta de juego
// Recibe un objeto game con la información del juego
type Game = {
  id: string | number;
  cover_image_url: string;
  title: string;
};

interface GameCardProps {
  game?: Game;
}

function GameCard({ game }: GameCardProps) {
  // Si no se pasa el objeto game, no renderiza nada
  if (!game) {
    return null;
  }

  // Renderiza la tarjeta de juego
  // Con un enlace a la página de detalles del juego
  // Con una imagen de portada y título del juego
  return (
    <div className="game-card">
      <Link to={`/games/${game.id}`}>
        <img src={game.cover_image_url} alt={game.title} />
        <h2>{game.title}</h2>
      </Link>
    </div>
  );
}

export default GameCard;
