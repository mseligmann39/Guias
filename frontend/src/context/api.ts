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

/**
 * Updates the status of a guide in the user's lists.
 * @param {string | number} guideId - The ID of the guide
 * @param {object} status - The status to update
 * @param {boolean} status.is_favorite - Whether the guide is marked as favorite
 * @param {'todo'|'completed'|null} status.progress_status - The progress status of the guide
 * @returns {Promise} The API response
 */
export const postGuideListStatus = (guideId: string | number, status: { is_favorite: boolean, progress_status: 'todo' | 'completed' | null }) => {
  return api.post(`/api/guides/${guideId}/list-status`, status);
};

/**
 * Gets all guide lists for the authenticated user.
 * @returns {Promise} The API response containing the user's lists
 */
export const getUserLists = () => {
  return api.get('/api/user/my-lists');
};

// --- Tipos para los nuevos filtros ---
interface GuideFilterParams {
  page?: number;
  game_id?: string | number;
  category_id?: string | number;
  sort?: 'newest' | 'rating_desc';
}

/**
 * Obtiene una lista paginada de guías, con filtros y ordenación.
 * @param {GuideFilterParams} params - Parámetros de filtrado y paginación
 * @returns {Promise} La respuesta de la API con las guías
 */
export const getGuides = (params: GuideFilterParams) => {
  return api.get('/api/guides', { params });
};

/**
 * Realiza una búsqueda global.
 * @param {string} query - El término de búsqueda
 * @returns {Promise} La respuesta de la API con los resultados de búsqueda
 */
export const searchGlobal = (query: string) => {
  return api.get('/api/search', { params: { q: query } });
};

export const getGuidesByUserId = (userId: string | number) => {
  return api.get(`/api/guides/user/${userId}`);
};

export default api;

// --- Admin reports endpoints ---
export const getAdminReports = (params?: { page?: number; estado?: string; per_page?: number }) => {
  return api.get('/api/admin/reportes', { params });
};

export const getAdminReport = (reporteId: number | string) => {
  return api.get(`/api/admin/reportes/${reporteId}`);
};

export const updateAdminReport = (reporteId: number | string, data: { estado: 'pendiente' | 'revisado' | 'ignorado' }) => {
  return api.put(`/api/admin/reportes/${reporteId}`, data);
};