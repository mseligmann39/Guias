import React from 'react';

// Componente simple para MOSTRAR estrellas
const StarRating = ({ rating, count }: { rating: number; count: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      <div className="text-yellow-400 text-xl">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`}>★</span>
        ))}
        {halfStar && <span>☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">☆</span>
        ))}
      </div>
      <span className="text-gray-400 text-sm ml-2">
        ({count} {count === 1 ? 'valoración' : 'valoraciones'})
      </span>
    </div>
  );
};

export default StarRating;