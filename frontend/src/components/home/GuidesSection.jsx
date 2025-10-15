import React from "react";
import Card from "../ui/Card";
import "./GuidesSection.css";


function GuidesSection({title, guides}) {
    return(
        <section className="guides-section">
      <h2 className="section-title">{title}</h2>
      <div className="guides-grid">
        {/*
          Usamos .map() para iterar sobre el array de guías.
          Por cada guía, renderizamos un componente Card, pasándole los datos necesarios.
        */}
        {guides.map(guide => (
          <Card
            key={guide.id}
            title={guide.title}
            imageUrl={guide.game.cover_image_url} // Asumiendo que la guía tiene la info del juego
            linkUrl={`/guides/${guide.id}`}
          />
        ))}
      </div>
    </section>

    );
    
}

export default GuidesSection