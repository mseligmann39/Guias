import React from 'react';
import {Link} from 'react-router-dom';

function GameCard({ game }) {
  try {
    if (!game) {
      return null;
    }

    return (
      <div className="game-card">
        <Link to={`/games/${game.id}`}>
          <img src={game.cover_image_url} alt={game.title} />
          <h2>{game.title}</h2>
        </Link>
      </div>
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}
export default GameCard