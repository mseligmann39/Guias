// Importamos la librería axios para realizar peticiones HTTP
import axios from 'axios';

// Creamos una instancia de axios con la configuración para la API
const api = axios.create({
  // URL base de la API
  baseURL: 'http://localhost:8000',
  // Indicamos que se deben incluir credenciales en las peticiones
  withCredentials: true,
  // Nombre de la cookie que se utilizará para almacenar el token CSRF
  xsrfCookieName: 'XSRF-TOKEN',
  // Cabecera HTTP que se utilizará para enviar el token CSRF
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Laravel recomienda este header para peticiones AJAX/SPA
api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Asegura que siempre enviamos el token CSRF en el header
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

api.interceptors.request.use((config) => {
  try {
    const xsrfCookie = getCookie('XSRF-TOKEN');
    if (xsrfCookie) {
      let token = xsrfCookie;
      try { token = decodeURIComponent(xsrfCookie); } catch { /* ignore */ }
      // Axios v1 usa AxiosHeaders; si existe set(), úsalo
      if (config && config.headers && typeof config.headers.set === 'function') {
        config.headers.set('X-XSRF-TOKEN', token);
      } else {
        if (!config.headers) config.headers = {};
        config.headers['X-XSRF-TOKEN'] = token;
      }
    }
  } catch { /* ignore */ }
  return config;
});

// Exportamos la instancia de axios configurada por defecto
export default api;
