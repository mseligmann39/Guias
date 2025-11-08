import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  // Use Sanctum SPA flow: include credentials so cookies are sent/received
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  // Asegurarnos de que se manejan correctamente las cookies CSRF
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Configurar el token si existe en localStorage
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Interceptor para debugging de CSRF token
api.interceptors.request.use(
  config => {
    const xsrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    if (xsrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);



/**
 * Publica un nuevo comentario para una guía.
 * @param {string|number} guideId - El ID de la guía
 * @param {string} body - El contenido del comentario
 * @returns {Promise} La respuesta de la API
 */
export const postComment = (guideId: string | number, body: string) => {
  return api.post(`/api/guides/${guideId}/comments`, { body });
};

/**
 * Publica o actualiza la valoración de un usuario para una guía.
 * @param {string|number} guideId - El ID de la guía
 * @param {number} rating - La calificación (generalmente de 1 a 5)
 * @returns {Promise} La respuesta de la API
 */
export const postRating = (guideId: string | number, rating: number) => {
  return api.post(`/api/guides/${guideId}/ratings`, { rating });
};

/**
 * Elimina un comentario de una guía.
 * @param {string|number} commentId - El ID del comentario a eliminar
 * @returns {Promise} La respuesta de la API
 */
export const deleteComment = (commentId: string | number) => {
  return api.delete(`/api/comments/${commentId}`);
};

export default api;