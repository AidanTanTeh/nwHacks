import { Friend, User, RunSession } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Runner',
  avatar: 'https://picsum.photos/100/100',
  weeklyGoalKm: 15.0,
  streak: 3,
};

export const MOCK_FRIENDS: Friend[] = [
  {
    id: 'f1',
    name: 'Sarah Sprinter',
    avatar: 'https://picsum.photos/101/101',
    weeklyDistanceKm: 12.4,
    totalDistanceKm: 156.2,
    isOnline: true,
    streak: 5,
  },
  {
    id: 'f2',
    name: 'Mike Marathon',
    avatar: 'https://picsum.photos/102/102',
    weeklyDistanceKm: 28.5,
    totalDistanceKm: 430.1,
    isOnline: false,
    streak: 12,
  },
  {
    id: 'f3',
    name: 'Jess Jogger',
    avatar: 'https://picsum.photos/103/103',
    weeklyDistanceKm: 5.2,
    totalDistanceKm: 89.4,
    isOnline: true,
    streak: 1,
  },
  {
    id: 'f4',
    name: 'Tom Trail',
    avatar: 'https://picsum.photos/104/104',
    weeklyDistanceKm: 18.1,
    totalDistanceKm: 210.5,
    isOnline: false,
    streak: 0,
  },
];

export const MOCK_FEED: RunSession[] = [
  {
    id: 'r101',
    userId: 'f1',
    distanceKm: 5.2,
    durationSeconds: 1530, // 25.5 mins
    timestamp: Date.now() - 3600000 * 2,
    date: new Date(Date.now() - 3600000 * 2).toLocaleDateString(),
    image: 'https://picsum.photos/400/600',
    aiCaption: "Crushed that 5k! Legs feel like jelly but my soul is soaring. 🚀 #NoExcuses",
    pace: '4:54',
    streak: 5
  },
  {
    id: 'r102',
    userId: 'f2',
    distanceKm: 10.0,
    durationSeconds: 3000,
    timestamp: Date.now() - 86400000,
    date: new Date(Date.now() - 86400000).toLocaleDateString(),
    image: 'https://picsum.photos/401/600',
    aiCaption: "Early morning grind. The sunrise was the real prize today. ☀️",
    pace: '5:00',
    streak: 11
  }
];