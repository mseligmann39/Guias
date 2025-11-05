// Importamos la librería axios para realizar peticiones HTTP
import axios, { InternalAxiosRequestConfig, AxiosRequestHeaders, AxiosHeaders } from 'axios';

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

// Utilidad: Obtener el valor de una cookie de forma segura (corrige el tipado de retorno)
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const v = parts.pop()?.split(';').shift();
    return typeof v === 'string' ? v : null;
  }
  return null;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const xsrfCookie = getCookie('XSRF-TOKEN');
    if (xsrfCookie) {
      let token = xsrfCookie;
      try { token = decodeURIComponent(xsrfCookie); } catch { /* ignore */ }
      // AxiosHeaders implementa set(). Si está disponible se usa
      if (
        config &&
        config.headers &&
        typeof (config.headers as AxiosHeaders).set === 'function'
      ) {
        (config.headers as AxiosHeaders).set('X-XSRF-TOKEN', token);
      } else if (config && config.headers) {
        // Si headers existe pero no es AxiosHeaders, asume que es tipo AxiosRequestHeaders
        (config.headers as AxiosRequestHeaders)['X-XSRF-TOKEN'] = token;
      } else {
        // headers no existe: crea un objeto con tipado compatible (AxiosRequestHeaders)
        config.headers = { 'X-XSRF-TOKEN': token } as unknown as AxiosRequestHeaders;
      }
    }
  } catch {
    // silent failure
  }
  return config;
});

// Exportamos la instancia de axios configurada por defecto
export default api;
