export interface User {
  id: number;
  name: string;
  email: string;
  profileIcon?: string;
  is_admin?: boolean; // Visto en tu JSON
}

export interface Game {
  release_date: string;
  id: number;
  title: string;
  slug?: string; // Visto en tu JSON
  description?: string; // Visto en tu JSON
  cover_image_url?: string; // Visto en tu JSON
}

// --- ¡NUEVO! ---
// Arregla el Error 1: "no exported member 'Comment'"
export interface Comment {
  id: number;
  body: string;
  user_id: number;
  guide_id: number;
  created_at: string;
  user: User; // El usuario que comentó
}

// --- ¡NUEVO! ---
// (Este ya lo tenías, está perfecto)
export interface GuideSection {
  id: number;
  guide_id: number;
  order: number;
  type: 'text' | 'image' | 'video';
  content: string | null;
  image_path: string | null;
}

// --- ¡MODIFICADO! ---
// Arregla los errores 3, 5 y 7
export interface Guide {
  id: number;
  title: string;
  slug: string;
  game_id: number;
  user_id: number;
  created_at?: string; // <-- Arregla Error 5

  // Relaciones
  game?: Game;
  user?: User;
  sections?: GuideSection[];
  comments?: Comment[]; // <-- Arregla Error 3

  // Campos calculados
  average_rating?: number;
  rating_count?: number; // <-- Arregla Error 7 (tu JSON usa 'rating_count', no 'ratings_count')
}

export type ApiResponse<T> = T;