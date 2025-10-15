import React from 'react';
import './HeroSection.css'; // Importamos sus estilos

function HeroSection() {
  return (
    // La etiqueta <section> es semánticamente correcta para un bloque de contenido.
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Descubre las Mejores Guías de Videojuegos</h1>
        <p className="hero-slogan">
          Tu fuente central para estrategias, secretos y tutoriales.
        </p>
        <button className="hero-cta-button">
          Explorar Guías
        </button>
      </div>
    </section>
  );
}

export default HeroSection;