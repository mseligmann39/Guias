import React from "react";
import Card from "../ui/Card";

// Definimos la estructura esperada de una guía y su juego (mínima para Card).
interface Game {
  cover_image_url: string;
  title?: string;
}

interface Guide {
  id: number | string;
  title: string;
  game: Game;
}

interface GuidesSectionProps {
  title: string;
  guides: Guide[];
}

function GuidesSection({ title, guides }: GuidesSectionProps) {
  return (
    <section className="py-16 px-8">
      <h2 className="text-center text-4xl mb-10 text-[var(--color-text-primary)]">{title}</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
        {/*
          Usamos .map() para iterar sobre el array de guías.
          Por cada guía, renderizamos un componente Card, pasándole los datos necesarios.
        */}
        {guides.map((guide) => (
          <Card
            key={guide.id}
            title={guide.title}
            imageUrl={guide.game.cover_image_url}
            linkUrl={`/guides/${guide.id}`}
          />
        ))}
      </div>
    </section>
  );
}

export default GuidesSection;