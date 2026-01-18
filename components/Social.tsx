import React, { useState } from 'react';
import { WorkoutSession, User, Friend } from '../types';
import { Clock, Heart, MessageCircle, MoreHorizontal, Flame, UserPlus, Search } from 'lucide-react';

interface SocialProps {
  workouts: WorkoutSession[];
  currentUser: User;
  friends: Friend[];
}

const Social: React.FC<SocialProps> = ({ workouts, friends, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');

  const getUser = (id: string) => {
    if (id === currentUser.id) return currentUser;
    const friend = friends.find(f => f.id === id);
    return friend || { name: 'Unknown', avatar: '' };
  };

  const getWorkoutIcon = (type: string) => {
    const icons: Record<string, string> = {
      RUN: '🏃',
      WALK: '🚶',
      CYCLING: '🚴',
      SWIMMING: '🏊',
      YOGA: '🧘',
    };
    return icons[type] || '💪';
  };

  return (
    <div className="h-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden transition-colors duration-300 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 transition-colors duration-300">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
            Social
          </h1>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'feed'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'friends'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Friends
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {activeTab === 'feed' ? (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {workouts.map((workout) => {
              const user = getUser(workout.userId);
              return (
                <div key={workout.id} className="pb-8 pt-6 px-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-zinc-900 dark:text-white text-sm leading-none">
                            {user.name}
                          </h3>
                          {'currentStreak' in user && user.currentStreak > 0 && (
                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-100 dark:bg-orange-500/20 rounded-full border border-orange-200 dark:border-orange-500/20">
                              <Flame size={10} className="text-orange-500 fill-orange-500" />
                              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                                {user.currentStreak}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                          {workout.date} • {new Date(workout.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <button className="text-zinc-400 dark:text-zinc-600">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-[4/5] bg-zinc-200 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm mb-4">
                    {workout.image ? (
                      <img src={workout.image} alt="Workout" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-700">
                        No Image
                      </div>
                    )}

                    {/* Stats Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 shadow-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getWorkoutIcon(workout.workoutType)}</span>
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase">
                          {workout.workoutType}
                        </span>
                      </div>
                      {workout.distanceKm && (
                        <p className="text-2xl font-black text-zinc-900 dark:text-white italic leading-none">
                          {workout.distanceKm.toFixed(2)}
                          <span className="text-xs font-normal text-zinc-500 dark:text-zinc-300 not-italic ml-1">
                            km
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-6 mb-3">
                    <button className="flex items-center gap-2 text-zinc-900 dark:text-white">
                      <Heart size={24} />
                    </button>
                    <button className="flex items-center gap-2 text-zinc-900 dark:text-white">
                      <MessageCircle size={24} />
                    </button>
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {Math.floor(workout.durationSeconds / 60)}m
                      </span>
                    </div>
                  </div>

                  {/* Caption */}
                  {workout.aiCaption && (
                    <div className="px-1">
                      <p className="text-zinc-800 dark:text-zinc-100 text-sm leading-relaxed">
                        <span className="font-bold mr-2">{user.name}</span>
                        {workout.aiCaption}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder="Search friends..."
                className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl py-3 pl-10 pr-4 text-sm font-medium border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* Add Friends Button */}
            <button className="w-full mb-6 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow">
              <UserPlus size={20} />
              Find New Friends
            </button>

            {/* Online Friends */}
            <div className="mb-6">
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider mb-3 px-2">
                Online Now
              </p>
              <div className="space-y-2">
                {friends
                  .filter((f) => f.isOnline)
                  .map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="relative mr-3">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          {friend.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Flame size={12} className="text-orange-500 fill-orange-500" />
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {friend.currentStreak} day streak
                          </span>
                        </div>
                      </div>
                      <button className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full font-bold">
                        Wave 👋
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* All Friends */}
            <div>
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider mb-3 px-2">
                All Friends
              </p>
              <div className="space-y-2">
                {friends
                  .filter((f) => !f.isOnline)
                  .map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full object-cover mr-3 opacity-70"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-zinc-600 dark:text-zinc-400">
                          {friend.name}
                        </h3>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600">
                          {friend.totalWorkouts} workouts
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Social;