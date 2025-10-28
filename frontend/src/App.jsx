import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import GuideDetailPage from './pages/GuideDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';


 /* Función principal de la aplicación.
 Renderiza las rutas de la aplicación.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games/:id" element={<GameDetailPage />} />
      <Route path="/guides/:id" element={<GuideDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path='/profile' element={<ProfilePage />}  />
    </Routes>
  );
}

export default App;