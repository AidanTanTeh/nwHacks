export interface User {
  id: string;
  name: string;
  avatar: string;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutType: WorkoutType;
  distanceKm?: number;
  durationSeconds: number;
  timestamp: number;
  date: string;
  image?: string;
  aiCaption?: string;
  pace?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  isOnline: boolean;
}

export enum AppView {
  HOME = 'HOME',
  SOCIAL = 'SOCIAL',
  WORKOUT = 'WORKOUT',
  RANK = 'RANK',
  PROFILE = 'PROFILE'
}

export enum WorkoutType {
  RUN = 'RUN',
  WALK = 'WALK',
  CYCLING = 'CYCLING',
  SWIMMING = 'SWIMMING',
  YOGA = 'YOGA',
  OTHER = 'OTHER'
}

export enum WorkoutState {
  SELECT = 'SELECT',
  TRACKING = 'TRACKING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED'
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  targetValue?: number;
  currentValue?: number;
}