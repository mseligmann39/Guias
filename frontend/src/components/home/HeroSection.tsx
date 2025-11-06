import React from 'react';

function HeroSection() {
  return (
    // La etiqueta <section> es semánticamente correcta para un bloque de contenido.
    <section className="flex justify-center items-center text-center py-24 px-8 bg-[var(--color-background)] min-h-[40vh]">
      <div className="max-w-[800px]">
        <h1 className="font-[var(--font-heading)] text-[3.5rem] font-black mb-4 leading-[1.1] text-[var(--color-text-primary)]">
          Descubre las Mejores Guías de Videojuegos
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] mb-10">
          Tu fuente central para estrategias, secretos y tutoriales.
        </p>
        <button className="bg-[var(--color-primary)] text-[var(--color-text-primary)] border-none py-4 px-10 rounded font-bold text-lg cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(231,0,0,0.5)]">
          Explorar Guías
        </button>
      </div>
    </section>
  );
}

export default HeroSection;