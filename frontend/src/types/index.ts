export interface User {
  id: number;
  name: string;
  email: string;
  profileIcon?: string;
}

export interface Game {
  id: number;
  title: string;
}

export interface Guide {
  id: number;
  title: string;
  slug: string;
  content: string;
  game_id: number;
  user_id: number;
  game?: Game;
}

export type ApiResponse<T> = T;

