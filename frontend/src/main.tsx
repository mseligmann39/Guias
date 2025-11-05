import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import './index.css'; 

// Esta función crea un elemento root en el DOM y renderiza el componente App
// dentro de un proveedor de autenticación y un router para manejar las rutas de la aplicación.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("No se encontró el elemento con id 'root'.");
}
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);