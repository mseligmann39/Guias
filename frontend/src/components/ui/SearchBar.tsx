// frontend/src/components/SearchBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchGlobal } from '../../context/api';
// Styles replaced with Tailwind classes

// (Define los tipos para los resultados)
interface GameResult { id: number; title: string; slug: string; }
interface GuideResult { id: number; title: string; slug: string; }
interface UserResult { id: number; name: string; }

interface SearchResults {
  games: GameResult[];
  guides: GuideResult[];
  users: UserResult[];
}

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null); // Para cerrar al hacer clic fuera

  // --- Debounce ---
  useEffect(() => {
    // Si no hay texto, limpia todo
    if (query.length < 3) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    // Espera 500ms después de que el usuario deja de teclear
    const timer = setTimeout(async () => {
      try {
        const response = await searchGlobal(query);
        setResults(response.data);
        setShowResults(true);
      } catch (err) {
        console.error("Error en la búsqueda:", err);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    // Limpieza: si el usuario vuelve a teclear, cancela el timer anterior
    return () => clearTimeout(timer);
  }, [query]); // Este efecto se ejecuta cada vez que 'query' cambia

  // --- Clic para cerrar ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Buscar juegos, guías, usuarios..."
          className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}
      </div>

      {showResults && results && (
        <div className="absolute top-full left-0 w-full sm:w-96 bg-gray-800 border border-gray-600 rounded-lg mt-1 shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Juegos */}
          {results.games.length > 0 && (
            <div className="p-3 border-b border-gray-700">
              <strong className="block text-primary-500 mb-2">Juegos</strong>
              <div className="space-y-1">
                {results.games.map(game => (
                  <Link
                    to={`/games/${game.id}`}
                    key={`g-${game.id}`}
                    onClick={() => setShowResults(false)}
                    className="block text-white hover:bg-gray-700 rounded px-2 py-1 transition-colors"
                  >
                    {game.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* Guías */}
          {results.guides.length > 0 && (
            <div className="p-3 border-b border-gray-700">
              <strong className="block text-primary-500 mb-2">Guías</strong>
              <div className="space-y-1">
                {results.guides.map(guide => (
                  <Link
                    to={`/guides/${guide.id}`}
                    key={`gu-${guide.id}`}
                    onClick={() => setShowResults(false)}
                    className="block text-white hover:bg-gray-700 rounded px-2 py-1 transition-colors"
                  >
                    {guide.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* Usuarios */}
          {results.users.length > 0 && (
            <div className="p-3 border-b border-gray-700">
              <strong className="block text-primary-500 mb-2">Usuarios</strong>
              <div className="space-y-1">
                {results.users.map(user => (
                  <Link
                    to={`/profile/${user.id}`}
                    key={`u-${user.id}`}
                    onClick={() => setShowResults(false)}
                    className="block text-white hover:bg-gray-700 rounded px-2 py-1 transition-colors"
                  >
                    {user.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* Sin resultados */}
          {results.games.length === 0 && results.guides.length === 0 && results.users.length === 0 && (
            <div className="p-4 text-gray-400">No se encontraron resultados.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;