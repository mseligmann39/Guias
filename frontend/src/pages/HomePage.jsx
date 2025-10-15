import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../components/layout/Header';
import HeroSection from '../components/home/HeroSection';
import GuidesSection from '../components/home/GuidesSection'; // 1. Importa el nuevo componente

function HomePage() {
  // Volvemos a añadir el estado para manejar los datos
  const [popularGuides, setPopularGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // La URL para obtener todas las guías. Tu API ya soporta esto.
    const guidesURL = `${import.meta.env.VITE_API_BASE_URL}guides`;

    axios.get(guidesURL)
      .then(response => {
        // Por ahora, tomaremos las primeras 4 como "populares"
        setPopularGuides(response.data.slice(0, 4));
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar las guías:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <main>
        <HeroSection />

        {/* 2. Renderiza la sección solo si no está cargando y hay guías */}
        {!isLoading && popularGuides.length > 0 && (
          <GuidesSection
            title="Guías Populares"
            guides={popularGuides}
          />
        )}
      </main>
      {/* Aquí irá el Footer más adelante */}
    </>
  );
}

export default HomePage;