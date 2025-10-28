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

// Exportamos la instancia de axios configurada por defecto
export default api;
