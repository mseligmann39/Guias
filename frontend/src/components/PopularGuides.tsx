import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/context/api';

interface User {
  id: number;
  name: string;
  // Add other user fields as needed
}

interface Game {
  id: number;
  title: string;
  // Add other game fields as needed
}

interface Guide {
  id: number;
  title: string;
  content: string;
  user: User;
  game: Game;
  ratings_avg_rating: number | string | null;
  created_at: string;
  // Add other guide fields as needed
}

const PopularGuides: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularGuides = async () => {
      try {
        const response = await api.get('/guides/popular');
        setGuides(response.data);
      } catch (err) {
        console.error('Error fetching popular guides:', err);
        setError('Error al cargar las guías populares');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularGuides();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Cargando guías populares...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (guides.length === 0) {
    return <div className="text-center py-4">No hay guías populares disponibles</div>;
  }

  return (
    <div className="bg-[#2a2a2a] rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Guías Populares</h2>
      <div className="space-y-4">
        {guides.map((guide) => {
          const ratingRaw = guide.ratings_avg_rating;
          const rating =
            ratingRaw === null || ratingRaw === undefined
              ? null
              : typeof ratingRaw === 'number'
                ? ratingRaw
                : Number(ratingRaw);
          const hasRating = rating !== null && Number.isFinite(rating);

          return (
          <Link
            to={`/guides/${guide.id}`}
            key={guide.id}
            className="block p-3 hover:bg-[#3a3a3a] rounded transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-white">{guide.title}</h3>
                <p className="text-sm text-gray-400">
                  {guide.game?.title} • Por {guide.user?.name}
                </p>
              </div>
              {hasRating && (
                <div className="flex items-center bg-[var(--color-primary)] text-white text-sm px-2 py-1 rounded">
                  {rating.toFixed(1)} ★
                </div>
              )}
            </div>
          </Link>
        );
        })}
      </div>
    </div>
  );
};

export default PopularGuides;
