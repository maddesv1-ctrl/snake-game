export interface Position {
  x: number;
  y: number;
}

export interface Direction {
  x: number;
  y: number;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  date: string;
}

export interface GameConfig {
  gridSize: number;
  canvasSize: number;
  tileSize: number;
  baseSpeed: number;
  videoInterval: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  gridSize: 20,
  canvasSize: 400,
  tileSize: 20,
  baseSpeed: 300,
  videoInterval: 3,
};

export const VIDEOS = ['video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4'] as const;

export type GameStatus = 'idle' | 'playing' | 'paused' | 'over';

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
} as const;