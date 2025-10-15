import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";


function Card({ imageUrl, title, linkUrl }) {
    return (
        <div className="card-container">
      <Link to={linkUrl} className="card-link">
        <img src={imageUrl} alt={`Portada de ${title}`} className="card-image" />
        <div className="card-overlay">
          <h3 className="card-title">{title}</h3>
        </div>
      </Link>
    </div>
    );
}

export default Card;