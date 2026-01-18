export const CURRENT_USER = {
  id: "u1",
  name: "Alex Runner",
  avatar: "https://picsum.photos/100/100",
  weeklyGoalKm: 15,
  streak: 3,
};

export const MOCK_FRIENDS = [
  {
    id: "f1",
    name: "Sarah Sprinter",
    avatar: "https://picsum.photos/101/101",
    weeklyDistanceKm: 12.4,
    totalDistanceKm: 156.2,
    isOnline: true,
    streak: 5,
  },
];

export const MOCK_FEED = [
  {
    id: "r101",
    userId: "f1",
    distanceKm: 5.2,
    durationSeconds: 1530,
    timestamp: Date.now() - 3600000 * 2,
    date: new Date(Date.now() - 3600000 * 2).toLocaleDateString(),
    image: "https://picsum.photos/400/600",
    aiCaption: "Crushed that 5k! Legs feel like jelly but my soul is soaring. 🚀",
    pace: "4:54",
    streak: 5,
  },
];
