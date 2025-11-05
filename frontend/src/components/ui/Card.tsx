import React from 'react';
import { Link } from "react-router-dom";
import "./Card.css";

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
        <div className="card-container">
            {/* // Enlace que contiene la imagen y el título */}
            <Link to={linkUrl} className="card-link">
               {/*  // Imagen de la tarjeta */}
                <img src={imageUrl} alt={`Portada de ${title}`} className="card-image" />
               {/*  // Contenedor del título */}
                <div className="card-overlay">
              {/*       // Título de la tarjeta */}
                    <h3 className="card-title">{title}</h3>
                </div>
            </Link>
        </div>
    );
}

// Exportamos el componente Card por defecto
export default Card;
