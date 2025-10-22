import { StrictMode } from 'react'; // <--- Importas StrictMode directamente
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode> {/* <--- ¡Solución! Lo usamos sin el prefijo "React." */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>, // <--- ¡Solución!
);