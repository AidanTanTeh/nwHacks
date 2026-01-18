import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Settings, Moon, Sun, ChevronRight, Home as HomeIcon, Plus, BarChart2, User as UserIcon, Users, Trophy, Flame, TrendingUp, Check, X, Camera, RotateCcw, Play, Pause, Square, Clock, Heart, MessageCircle, MoreHorizontal, UserPlus, Search, Crown } from 'lucide-react';

// Types
enum AppView {
  HOME = 'HOME',
  SOCIAL = 'SOCIAL',
  WORKOUT = 'WORKOUT',
  RANK = 'RANK',
  PROFILE = 'PROFILE'
}

enum WorkoutType {
  RUN = 'RUN',
  WALK = 'WALK',
  CYCLING = 'CYCLING',
  SWIMMING = 'SWIMMING',
  YOGA = 'YOGA',
  OTHER = 'OTHER'
}

enum WorkoutState {
  SELECT = 'SELECT',
  TRACKING = 'TRACKING',
  PAUSED = 'PAUSED'
}

enum TrackingState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED'
}

interface User {
  id: string;
  name: string;
  avatar: string;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
}

interface WorkoutSession {
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

interface Friend {
  id: string;
  name: string;
  avatar: string;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  isOnline: boolean;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  targetValue?: number;
  currentValue?: number;
}

// Mock Data
const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Runner',
  avatar: 'https://picsum.photos/100/100',
  currentStreak: 5,
  longestStreak: 12,
  totalWorkouts: 47,
};

const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', name: 'Sarah Sprinter', avatar: 'https://picsum.photos/101/101', currentStreak: 8, longestStreak: 15, totalWorkouts: 62, isOnline: true },
  { id: 'f2', name: 'Mike Marathon', avatar: 'https://picsum.photos/102/102', currentStreak: 15, longestStreak: 28, totalWorkouts: 134, isOnline: false },
  { id: 'f3', name: 'Jess Jogger', avatar: 'https://picsum.photos/103/103', currentStreak: 3, longestStreak: 7, totalWorkouts: 28, isOnline: true },
  { id: 'f4', name: 'Tom Trail', avatar: 'https://picsum.photos/104/104', currentStreak: 1, longestStreak: 9, totalWorkouts: 41, isOnline: false },
];

const INITIAL_WORKOUTS: WorkoutSession[] = [
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

const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: 'c1', title: '30 Minute Workout', description: 'Complete any 30-minute workout', icon: '⏱️', completed: false, targetValue: 30, currentValue: 0 },
  { id: 'c2', title: 'Early Bird', description: 'Workout before 8 AM', icon: '🌅', completed: false },
  { id: 'c3', title: 'Share the Love', description: 'Comment on 3 friends\' workouts', icon: '💬', completed: false, targetValue: 3, currentValue: 1 },
];

// Components
const Home: React.FC<{ currentUser: User; challenges: DailyChallenge[] }> = ({ currentUser, challenges }) => {
  const completedChallenges = challenges.filter(c => c.completed).length;
  return (
    <div className="h-full bg-zinc-50 dark:bg-zinc-950 overflow-y-auto no-scrollbar pb-24">
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Hey, {currentUser.name.split(' ')[0]}! 👋</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Ready to keep the streak alive?</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="text-white" size={24} fill="white" />
              <span className="text-white/90 font-bold text-sm uppercase tracking-wide">Current Streak</span>
            </div>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-7xl font-black text-white tracking-tighter">{currentUser.currentStreak}</span>
              <span className="text-2xl font-bold text-white/80 mb-2">days</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs font-medium">Longest Streak</p>
                <p className="text-white font-bold text-lg">{currentUser.longestStreak} days</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs font-medium">Total Workouts</p>
                <p className="text-white font-bold text-lg">{currentUser.totalWorkouts}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-500" size={16} />
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">This Week</span>
            </div>
            <p className="text-3xl font-black text-zinc-900 dark:text-white">5</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">workouts</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-yellow-500" size={16} />
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Rank</span>
            </div>
            <p className="text-3xl font-black text-zinc-900 dark:text-white">#3</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">in friends</p>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">Today's Challenges</h2>
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{completedChallenges}/{challenges.length} Complete</span>
          </div>
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <div key={challenge.id} className={`p-4 rounded-2xl border ${challenge.completed ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${challenge.completed ? 'bg-green-100 dark:bg-green-500/20' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                    {challenge.completed ? <Check className="text-green-600 dark:text-green-400" size={20} strokeWidth={3} /> : challenge.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-sm mb-0.5 ${challenge.completed ? 'text-green-700 dark:text-green-400 line-through' : 'text-zinc-900 dark:text-white'}`}>{challenge.title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">{challenge.description}</p>
                    {challenge.targetValue && !challenge.completed && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${((challenge.currentValue || 0) / challenge.targetValue) * 100}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{challenge.currentValue || 0}/{challenge.targetValue}</span>
                      </div>
                    )}
                  </div>
                  {!challenge.completed && <ChevronRight className="text-zinc-400" size={20} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Social: React.FC<{ workouts: WorkoutSession[]; currentUser: User; friends: Friend[] }> = ({ workouts, friends, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');
  const getUser = (id: string) => {
    if (id === currentUser.id) return currentUser;
    return friends.find(f => f.id === id) || { name: 'Unknown', avatar: '' };
  };
  const getWorkoutIcon = (type: string) => {
    const icons: Record<string, string> = { RUN: '🏃', WALK: '🚶', CYCLING: '🚴', SWIMMING: '🏊', YOGA: '🧘' };
    return icons[type] || '💪';
  };

  return (
    <div className="h-full bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">Social</h1>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('feed')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'feed' ? 'bg-orange-500 text-white' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'}`}>Feed</button>
            <button onClick={() => setActiveTab('friends')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'friends' ? 'bg-orange-500 text-white' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'}`}>Friends</button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {activeTab === 'feed' ? (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {workouts.map((workout) => {
              const user = getUser(workout.userId);
              return (
                <div key={workout.id} className="pb-8 pt-6 px-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-800" />
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{user.name}</h3>
                        <p className="text-xs text-zinc-500">{workout.date}</p>
                      </div>
                    </div>
                    <MoreHorizontal className="text-zinc-400" size={20} />
                  </div>
                  <div className="relative aspect-[4/5] bg-zinc-200 dark:bg-zinc-900 rounded-2xl overflow-hidden mb-4">
                    {workout.image && <img src={workout.image} alt="Workout" className="w-full h-full object-cover" />}
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getWorkoutIcon(workout.workoutType)}</span>
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase">{workout.workoutType}</span>
                      </div>
                      {workout.distanceKm && <p className="text-2xl font-black text-zinc-900 dark:text-white">{workout.distanceKm.toFixed(2)}<span className="text-xs ml-1">km</span></p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mb-3">
                    <Heart size={24} className="text-zinc-900 dark:text-white" />
                    <MessageCircle size={24} className="text-zinc-900 dark:text-white" />
                    <div className="flex-1"></div>
                    <span className="text-xs text-zinc-500"><Clock size={14} className="inline" /> {Math.floor(workout.durationSeconds / 60)}m</span>
                  </div>
                  {workout.aiCaption && <p className="text-sm text-zinc-800 dark:text-zinc-100"><span className="font-bold">{user.name}</span> {workout.aiCaption}</p>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input type="text" placeholder="Search friends..." className="w-full bg-white dark:bg-zinc-900 rounded-xl py-3 pl-10 pr-4 text-sm border border-zinc-200 dark:border-zinc-800" />
            </div>
            <button className="w-full mb-6 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
              <UserPlus size={20} /> Find New Friends
            </button>
            {friends.filter(f => f.isOnline).map((friend) => (
              <div key={friend.id} className="flex items-center p-3 mb-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="relative mr-3">
                  <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{friend.name}</h3>
                  <p className="text-xs text-zinc-500"><Flame size={12} className="inline text-orange-500" /> {friend.currentStreak} day streak</p>
                </div>
                <button className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full font-bold">Wave 👋</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Rank: React.FC<{ friends: Friend[]; currentUser: User }> = ({ friends, currentUser }) => {
  const allUsers = [{ ...currentUser, isCurrentUser: true }, ...friends.map(f => ({ ...f, isCurrentUser: false }))];
  const sortedUsers = [...allUsers].sort((a, b) => b.currentStreak - a.currentStreak);
  const currentUserRank = sortedUsers.findIndex(u => u.isCurrentUser) + 1;

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <div className="pt-6 pb-4 px-6 sticky top-0 bg-zinc-50 dark:bg-zinc-950 z-10">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
          <Trophy className="text-yellow-500" size={28} /> LEADERBOARD
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Ranked by current streak</p>
      </div>
      <div className="px-6 pb-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-white/80 text-xs font-bold uppercase mb-1">Your Rank</p>
              <p className="text-4xl font-black">#{currentUserRank}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-xs font-bold uppercase mb-1">Current Streak</p>
              <div className="flex items-center gap-1 justify-end">
                <Flame className="text-white fill-white" size={20} />
                <p className="text-4xl font-black">{currentUser.currentStreak}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24">
        {sortedUsers.map((user, idx) => (
          <div key={user.id} className={`flex items-center p-3 mb-1 rounded-2xl ${user.isCurrentUser ? 'bg-orange-100 dark:bg-orange-500/20 border-2 border-orange-500' : 'hover:bg-white dark:hover:bg-zinc-900/50'}`}>
            <div className={`w-8 text-center font-black text-lg mr-3 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-zinc-400' : idx === 2 ? 'text-orange-600' : 'text-zinc-400'}`}>
              {idx === 0 ? <Crown className="inline" size={24} fill="currentColor" /> : idx + 1}
            </div>
            <img src={user.avatar} alt={user.name} className={`w-12 h-12 rounded-full mr-3 ${idx < 3 ? 'ring-2 ring-offset-2 ring-offset-zinc-50 dark:ring-offset-zinc-950 ' + (idx === 0 ? 'ring-yellow-500' : idx === 1 ? 'ring-zinc-400' : 'ring-orange-600') : ''}`} />
            <div className="flex-1">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{user.name}{user.isCurrentUser && <span className="text-orange-500 ml-2">(You)</span>}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.totalWorkouts} workouts</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Flame size={18} className="text-orange-500 fill-orange-500" />
                <p className="text-2xl font-black text-orange-500">{user.currentStreak}</p>
              </div>
              <p className="text-xs text-zinc-500 font-bold uppercase">days</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WorkoutSelector: React.FC<{ onSelectWorkout: (type: WorkoutType) => void; onClose: () => void }> = ({ onSelectWorkout, onClose }) => {
  const workouts = [
    { type: WorkoutType.RUN, name: 'Run', icon: '🏃', gradient: 'from-orange-500 to-red-500', available: true },
    { type: WorkoutType.WALK, name: 'Walk', icon: '🚶', gradient: 'from-green-500 to-emerald-500', available: true },
    { type: WorkoutType.CYCLING, name: 'Cycling', icon: '🚴', gradient: 'from-blue-500 to-cyan-500', available: false },
    { type: WorkoutType.SWIMMING, name: 'Swimming', icon: '🏊', gradient: 'from-blue-400 to-indigo-500', available: false },
    { type: WorkoutType.YOGA, name: 'Yoga', icon: '🧘', gradient: 'from-purple-500 to-pink-500', available: false },
    { type: WorkoutType.OTHER, name: 'Other', icon: '💪', gradient: 'from-zinc-500 to-zinc-600', available: false },
  ];

  return (
    <div className="h-full bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <div className="pt-6 pb-4 px-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Choose Workout</h1>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full">
            <X className="text-zinc-500" size={24} />
          </button>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Select your workout type to get started</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
        <div className="grid grid-cols-2 gap-4">
          {workouts.map((workout) => (
            <button key={workout.type} onClick={() => workout.available && onSelectWorkout(workout.type)} disabled={!workout.available} className={`relative overflow-hidden rounded-3xl p-6 aspect-square flex flex-col items-center justify-center ${workout.available ? `bg-gradient-to-br ${workout.gradient} hover:scale-105 active:scale-95` : 'bg-zinc-200 dark:bg-zinc-800 opacity-50'}`}>
              {workout.available && <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>}
              <span className="text-5xl mb-3">{workout.icon}</span>
              <span className={`font-bold text-lg ${workout.available ? 'text-white' : 'text-zinc-500'}`}>{workout.name}</span>
              {!workout.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <span className="text-white text-xs font-bold uppercase px-3 py-1 bg-black/50 rounded-full">Coming Soon</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const WorkoutTracker: React.FC<{ workoutType: WorkoutType; onFinish: (stats: any) => void; onCancel: () => void }> = ({ workoutType, onFinish, onCancel }) => {
  const [trackingState, setTrackingState] = useState<TrackingState>(TrackingState.IDLE);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const startTime = useRef<number | null>(null);
  const needsGPS = workoutType === WorkoutType.RUN || workoutType === WorkoutType.WALK;

  useEffect(() => {
    let interval: number;
    if (trackingState === TrackingState.RUNNING) {
      if (!startTime.current) startTime.current = Date.now();
      interval = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime.current!) / 1000));
        if (needsGPS) setDistance(prev => prev + 0.01);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [trackingState, needsGPS]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    setTrackingState(TrackingState.IDLE);
    const pace = distance > 0 ? (duration / 60) / distance : 0;
    const paceMin = Math.floor(pace);
    const paceSec = Math.round((pace - paceMin) * 60);
    onFinish({ duration, distance: needsGPS ? distance : undefined, pace: needsGPS ? `${paceMin}:${paceSec.toString().padStart(2, '0')}` : undefined });
  };

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 relative">
      <div className="pt-8 px-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{workoutType === WorkoutType.RUN ? '🏃' : '🚶'}</span>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">{workoutType}</h1>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full">
          <X className="text-zinc-500" size={24} />
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <div className="text-center mb-10">
          <div className="text-8xl font-black text-zinc-900 dark:text-white">{needsGPS ? distance.toFixed(2) : formatTime(duration)}</div>
          <div className="text-zinc-500 font-bold uppercase text-sm mt-2">{needsGPS ? 'Kilometers' : 'Duration'}</div>
        </div>
      </div>
      <div className="pb-36 px-8 flex justify-center z-10">
        {trackingState === TrackingState.IDLE && (
          <button onClick={() => setTrackingState(TrackingState.RUNNING)} className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center active:scale-90">
            <Play fill="white" className="text-white ml-1" size={40} />
          </button>
        )}
        {trackingState === TrackingState.RUNNING && (
          <button onClick={() => setTrackingState(TrackingState.PAUSED)} className="w-24 h-24 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center">
            <Pause fill="currentColor" className="text-zinc-900 dark:text-white" size={40} />
          </button>
        )}
        {trackingState === TrackingState.PAUSED && (
          <div className="flex items-center gap-8">
            <button onClick={() => setTrackingState(TrackingState.RUNNING)} className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <Play fill="currentColor" size={28} className="text-zinc-900 dark:text-white ml-1" />
            </button>
            <button onClick={handleStop} className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center">
              <Square fill="white" size={32} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CameraCapture: React.FC<{ onCapture: (img: string) => void; onCancel: () => void }> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then(s => { setStream(s); if (videoRef.current) videoRef.current.srcObject = s; });
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.8));
        stream?.getTracks().forEach(t => t.stop());
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <canvas ref={canvasRef} className="hidden" />
      <div className="relative flex-1 overflow-hidden">
        {!capturedImage ? <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" /> : <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />}
        <button onClick={onCancel} className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
          <X size={24} />
        </button>
      </div>
      <div className="h-32 bg-black flex items-center justify-center gap-12">
        {!capturedImage ? (
          <button onClick={capture} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </button>
        ) : (
          <>
            <button onClick={() => { setCapturedImage(null); navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } }).then(s => { setStream(s); if (videoRef.current) videoRef.current.srcObject = s; }); }} className="flex flex-col items-center gap-1 text-zinc-400">
              <div className="p-4 bg-zinc-800 rounded-full"><RotateCcw size={24} /></div>
              <span className="text-xs font-medium">Retake</span>
            </button>
            <button onClick={() => capturedImage && onCapture(capturedImage)} className="flex flex-col items-center gap-1 text-orange-400">
              <div className="p-4 bg-orange-600 rounded-full text-white"><Check size={28} strokeWidth={3} /></div>
              <span className="text-xs font-bold text-orange-500">Post Run</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const Navigation: React.FC<{ currentView: AppView; onChangeView: (v: AppView) => void }> = ({ currentView, onChangeView }) => {
  const navItems = [
    { view: AppView.HOME, icon: HomeIcon, label: 'Home' },
    { view: AppView.SOCIAL, icon: Users, label: 'Social' },
    { view: AppView.WORKOUT, icon: Plus, label: 'Workout', highlight: true },
    { view: AppView.RANK, icon: BarChart2, label: 'Rank' },
    { view: AppView.PROFILE, icon: UserIcon, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40">
      <div className="h-12 bg-gradient-to-t from-white/0 to-transparent dark:from-black/0 pointer-events-none"></div>
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 pb-safe">
        <div className="flex justify-around items-end h-20 px-2 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.highlight) {
              return (
                <div key={item.view} className="relative -top-6">
                  <button onClick={() => onChangeView(item.view)} className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center border-4 border-white dark:border-black">
                    <Icon size={28} strokeWidth={2.5} />
                  </button>
                </div>
              );
            }
            return (
              <button key={item.view} onClick={() => onChangeView(item.view)} className={`flex flex-col items-center gap-1 w-14 h-12 mb-2 ${currentView === item.view ? 'text-orange-500 dark:text-white' : 'text-zinc-400 dark:text-zinc-600'}`}>
                <Icon size={24} strokeWidth={currentView === item.view ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main App
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [currentUser] = useState<User>(CURRENT_USER);
  const [friends] = useState<Friend[]>(MOCK_FRIENDS);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>(INITIAL_WORKOUTS);
  const [challenges] = useState<DailyChallenge[]>(DAILY_CHALLENGES);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [workoutState, setWorkoutState] = useState<WorkoutState>(WorkoutState.SELECT);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<WorkoutType | null>(null);
  const [tempWorkoutStats, setTempWorkoutStats] = useState<any>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    document.documentElement.classList[isDarkMode ? 'add' : 'remove']('dark');
  }, [isDarkMode]);

  const handleSelectWorkout = (type: WorkoutType) => {
    setSelectedWorkoutType(type);
    setWorkoutState(WorkoutState.TRACKING);
  };

  const handleWorkoutFinish = (stats: any) => {
    setTempWorkoutStats(stats);
    setIsCameraOpen(true);
  };

  const handlePhotoCaptured = async (base64Image: string) => {
    if (!tempWorkoutStats || !selectedWorkoutType) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const newWorkout: WorkoutSession = {
        id: `w-${Date.now()}`,
        userId: currentUser.id,
        workoutType: selectedWorkoutType,
        distanceKm: tempWorkoutStats.distance,
        durationSeconds: tempWorkoutStats.duration,
        pace: tempWorkoutStats.pace,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString(),
        image: base64Image,
        aiCaption: "Just crushed that workout! 💪🔥"
      };
      setWorkouts([newWorkout, ...workouts]);
      setIsAnalyzing(false);
      setIsCameraOpen(false);
      setTempWorkoutStats(null);
      setSelectedWorkoutType(null);
      setWorkoutState(WorkoutState.SELECT);
      setCurrentView(AppView.SOCIAL);
    }, 2000);
  };

  const renderContent = () => {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-zinc-950 text-white p-8">
          <Loader2 className="animate-spin text-orange-500 mb-6" size={64} />
          <h2 className="text-3xl font-black mb-2">ANALYZING</h2>
          <p className="text-zinc-400">Crafting the perfect caption...</p>
        </div>
      );
    }

    if (isCameraOpen) {
      return <CameraCapture onCapture={handlePhotoCaptured} onCancel={() => { setIsCameraOpen(false); setCurrentView(AppView.HOME); }} />;
    }

    switch (currentView) {
      case AppView.HOME: return <Home currentUser={currentUser} challenges={challenges} />;
      case AppView.SOCIAL: return <Social workouts={workouts} friends={friends} currentUser={currentUser} />;
      case AppView.WORKOUT:
        return workoutState === WorkoutState.SELECT 
          ? <WorkoutSelector onSelectWorkout={handleSelectWorkout} onClose={() => setCurrentView(AppView.HOME)} />
          : <WorkoutTracker workoutType={selectedWorkoutType!} onFinish={handleWorkoutFinish} onCancel={() => { setWorkoutState(WorkoutState.SELECT); setSelectedWorkoutType(null); }} />;
      case AppView.RANK: return <Rank friends={friends} currentUser={currentUser} />;
      case AppView.PROFILE:
        return (
          <div className="h-full bg-zinc-50 dark:bg-zinc-950 overflow-y-auto no-scrollbar pb-24">
            <div className="sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md p-4 flex justify-between border-b border-zinc-200 dark:border-white/5">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Profile</h1>
              <Settings size={20} className="text-zinc-400" />
            </div>
            <div className="p-6 flex flex-col items-center">
              <img src={currentUser.avatar} className="w-28 h-28 rounded-full border-4 border-white dark:border-zinc-800 shadow-xl mb-6" />
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-1">{currentUser.name}</h2>
              <p className="text-zinc-500 mb-8">Fitness Enthusiast</p>
              <div className="w-full grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-white/5 text-center">
                  <p className="text-zinc-400 text-xs font-bold uppercase mb-1">Streak</p>
                  <p className="text-3xl font-black text-zinc-900 dark:text-white">{currentUser.currentStreak}<span className="text-sm text-zinc-500 ml-1">days</span></p>
                </div>
                <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-white/5 text-center">
                  <p className="text-zinc-400 text-xs font-bold uppercase mb-1">Workouts</p>
                  <p className="text-3xl font-black text-zinc-900 dark:text-white">{currentUser.totalWorkouts}</p>
                </div>
              </div>
              <div className="w-full bg-white dark:bg-zinc-900/30 rounded-3xl p-6 border border-zinc-200 dark:border-white/5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="text-yellow-500" size={20} />
                  <h3 className="font-bold text-zinc-900 dark:text-white">Achievements</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-lg">🔥</div>
                    <div>
                      <p className="font-bold text-sm text-zinc-900 dark:text-white">{currentUser.currentStreak} Day Streak</p>
                      <p className="text-xs text-zinc-500">Keep it up!</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-white dark:bg-zinc-900/30 rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/5">
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      {isDarkMode ? <Moon size={16} className="text-zinc-600 dark:text-zinc-300" /> : <Sun size={16} className="text-zinc-600 dark:text-zinc-300" />}
                    </div>
                    <span className="font-medium text-sm text-zinc-900 dark:text-white">Appearance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">{isDarkMode ? 'Dark' : 'Light'}</span>
                    <ChevronRight size={16} className="text-zinc-300" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      default: return <Home currentUser={currentUser} challenges={challenges} />;
    }
  };

  return (
    <>
      <div className="flex-1 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        {renderContent()}
      </div>
      {!isCameraOpen && !isAnalyzing && <Navigation currentView={currentView} onChangeView={setCurrentView} />}
    </>
  );
};

export default App;