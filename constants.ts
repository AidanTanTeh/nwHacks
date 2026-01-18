import { Friend, User, WorkoutSession, DailyChallenge, WorkoutType } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Runner',
  avatar: 'https://picsum.photos/100/100',
  currentStreak: 5,
  longestStreak: 12,
  totalWorkouts: 47,
};

export const MOCK_FRIENDS: Friend[] = [
  {
    id: 'f1',
    name: 'Sarah Sprinter',
    avatar: 'https://picsum.photos/101/101',
    currentStreak: 8,
    longestStreak: 15,
    totalWorkouts: 62,
    isOnline: true,
  },
  {
    id: 'f2',
    name: 'Mike Marathon',
    avatar: 'https://picsum.photos/102/102',
    currentStreak: 15,
    longestStreak: 28,
    totalWorkouts: 134,
    isOnline: false,
  },
  {
    id: 'f3',
    name: 'Jess Jogger',
    avatar: 'https://picsum.photos/103/103',
    currentStreak: 3,
    longestStreak: 7,
    totalWorkouts: 28,
    isOnline: true,
  },
  {
    id: 'f4',
    name: 'Tom Trail',
    avatar: 'https://picsum.photos/104/104',
    currentStreak: 1,
    longestStreak: 9,
    totalWorkouts: 41,
    isOnline: false,
  },
];

export const MOCK_WORKOUTS: WorkoutSession[] = [
  {
    id: 'w101',
    userId: 'f1',
    workoutType: WorkoutType.RUN,
    distanceKm: 5.2,
    durationSeconds: 1530,
    timestamp: Date.now() - 3600000 * 2,
    date: new Date(Date.now() - 3600000 * 2).toLocaleDateString(),
    image: 'https://picsum.photos/400/600',
    aiCaption: "Crushed that 5k! Legs feel like jelly but my soul is soaring. 🚀",
    pace: '4:54',
  },
  {
    id: 'w102',
    userId: 'f2',
    workoutType: WorkoutType.WALK,
    distanceKm: 3.0,
    durationSeconds: 2400,
    timestamp: Date.now() - 86400000,
    date: new Date(Date.now() - 86400000).toLocaleDateString(),
    image: 'https://picsum.photos/401/600',
    aiCaption: "Early morning walk vibes. The sunrise was the real prize today. ☀️",
    pace: '13:20',
  }
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'c1',
    title: '30 Minute Workout',
    description: 'Complete any 30-minute workout',
    icon: '⏱️',
    completed: false,
    targetValue: 30,
    currentValue: 0,
  },
  {
    id: 'c2',
    title: 'Early Bird',
    description: 'Workout before 8 AM',
    icon: '🌅',
    completed: false,
  },
  {
    id: 'c3',
    title: 'Share the Love',
    description: 'Comment on 3 friends\' workouts',
    icon: '💬',
    completed: false,
    targetValue: 3,
    currentValue: 1,
  },
];