const rawApiUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

export const API_URL = rawApiUrl;
export const API_ORIGIN = rawApiUrl.replace(/\/api$/, '');

export const buildStorageUrl = (path?: string | null) => {
  if (!path) return null;
  const trimmed = path.trim();

  if (/^(https?:|data:)/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return `${API_ORIGIN}${trimmed}`;
  }

  const normalized = trimmed.replace(/^\/+/, '');
  if (normalized.startsWith('storage/')) {
    return `${API_ORIGIN}/${normalized}`;
  }

  return `${API_ORIGIN}/storage/${normalized}`;
};
