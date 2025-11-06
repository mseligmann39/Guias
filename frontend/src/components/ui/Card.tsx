import React from 'react';
import { Link } from "react-router-dom";

// Definimos una interfaz para las props del componente.
// Esto asegura que siempre se pasen los datos correctos.
interface CardProps {
    imageUrl: string;
    title: string;
    linkUrl: string;
}

// Componente que representa una tarjeta de juego o guía.
// Recibe como par metros la URL de la imagen, el título y la URL del enlace.
// Devuelve un componente <Link> que contiene la imagen y el título.
// Utiliza estilos de CSS para darle estilos a la tarjeta.
function Card({ imageUrl, title, linkUrl }: CardProps) {
    return (
        // Contenedor de la tarjeta
        <div className="relative rounded-lg overflow-hidden transition-transform duration-300 ease-in-out bg-black hover:scale-105 group">
            {/* // Enlace que contiene la imagen y el título */}
            <Link to={linkUrl} className="block no-underline">
               {/*  // Imagen de la tarjeta */}
                <img src={imageUrl} alt={`Portada de ${title}`} className="w-full h-full object-cover block transition-opacity duration-300 group-hover:opacity-70" />
               {/*  // Contenedor del título */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              {/*       // Título de la tarjeta */}
                    <h3 className="text-[var(--color-text-primary)] font-[var(--font-heading)] text-xl m-0">{title}</h3>
                </div>
            </Link>
        </div>
    );
}

// Exportamos el componente Card por defecto
export default Card;
