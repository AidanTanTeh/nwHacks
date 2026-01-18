export interface User {
  id: string;
  name: string;
  avatar: string;
  weeklyGoalKm: number;
  streak: number;
}

export interface RunSession {
  id: string;
  userId: string;
  distanceKm: number;
  durationSeconds: number;
  timestamp: number;
  date: string;
  image?: string; // Base64 selfie
  aiCaption?: string;
  pace: string; // min/km
  streak?: number; // Streak at the time of the run
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  weeklyDistanceKm: number;
  totalDistanceKm: number;
  isOnline: boolean;
  streak: number;
}

export enum AppView {
  FEED = 'FEED',
  LEADERBOARD = 'LEADERBOARD',
  RUN = 'RUN',
  FRIENDS = 'FRIENDS',
  PROFILE = 'PROFILE'
}

export enum RunState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
  CAPTURING = 'CAPTURING',
  SAVING = 'SAVING'
}