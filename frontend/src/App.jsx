import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage'; // <-- 1. Importa la nueva página que crearemos

function App() {
  return (
    <Routes>
      {/* La ruta raíz ahora muestra la lista de todos los juegos */}
      <Route path="/" element={<HomePage />} />

      {/* 2. Añade una ruta dinámica. El ":id" es un parámetro que cambiará */}
      <Route path="/games/:id" element={<GameDetailPage />} />

      {/* Aquí podrías añadir más rutas en el futuro */}
    </Routes>
  );
}

export default App;