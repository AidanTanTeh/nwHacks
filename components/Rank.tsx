import React from 'react';
import { Friend, User } from '../types';
import { Trophy, Flame, Crown } from 'lucide-react';

interface RankProps {
  friends: Friend[];
  currentUser: User;
}

const Rank: React.FC<RankProps> = ({ friends, currentUser }) => {
  // Combine current user with friends for ranking
  const allUsers = [
    { ...currentUser, id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, isCurrentUser: true },
    ...friends.map(f => ({ ...f, isCurrentUser: false }))
  ];

  // Sort by current streak
  const sortedUsers = [...allUsers].sort((a, b) => b.currentStreak - a.currentStreak);

  const currentUserRank = sortedUsers.findIndex(u => u.isCurrentUser) + 1;

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="pt-6 pb-4 px-6 bg-zinc-50 dark:bg-zinc-950 z-10 sticky top-0">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 mb-2 text-zinc-900 dark:text-white">
          <Trophy className="text-yellow-500" size={28} />
          LEADERBOARD
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Ranked by current streak
        </p>
      </div>

      {/* Your Rank Card */}
      <div className="px-6 pb-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-wide mb-1">Your Rank</p>
              <p className="text-4xl font-black">#{currentUserRank}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-xs font-bold uppercase tracking-wide mb-1">Current Streak</p>
              <div className="flex items-center gap-1 justify-end">
                <Flame className="text-white fill-white" size={20} />
                <p className="text-4xl font-black">{currentUser.currentStreak}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24">
        <div className="space-y-1">
          {sortedUsers.map((user, index) => {
            const isTop3 = index < 3;
            const isCurrentUser = user.isCurrentUser;

            return (
              <div
                key={user.id}
                className={`flex items-center p-3 rounded-2xl transition-all ${
                  isCurrentUser
                    ? 'bg-orange-100 dark:bg-orange-500/20 border-2 border-orange-500'
                    : 'hover:bg-white dark:hover:bg-zinc-900/50'
                }`}
              >
                {/* Rank Number */}
                <div
                  className={`w-8 text-center font-black text-lg mr-3 ${
                    index === 0
                      ? 'text-yellow-500'
                      : index === 1
                      ? 'text-zinc-400'
                      : index === 2
                      ? 'text-orange-600'
                      : 'text-zinc-400 dark:text-zinc-600'
                  }`}
                >
                  {index === 0 && <Crown className="inline" size={24} fill="currentColor" />}
                  {index !== 0 && index + 1}
                </div>

                {/* Avatar */}
                <div className="relative mr-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className={`w-12 h-12 rounded-full object-cover bg-zinc-200 dark:bg-zinc-800 ${
                      isTop3
                        ? 'ring-2 ring-offset-2 ring-offset-zinc-50 dark:ring-offset-zinc-950 ' +
                          (index === 0
                            ? 'ring-yellow-500'
                            : index === 1
                            ? 'ring-zinc-400'
                            : 'ring-orange-600')
                        : ''
                    }`}
                  />
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-950">
                      <Crown size={10} fill="white" className="text-white" />
                    </div>
                  )}
                </div>

                {/* Name & Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {user.name}
                    {isCurrentUser && <span className="text-orange-500 ml-2">(You)</span>}
                  </h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {user.totalWorkouts} workouts
                    </p>
                    {index === 0 && (
                      <span className="text-[10px] text-yellow-600 dark:text-yellow-500 font-bold uppercase tracking-wide">
                        Champion
                      </span>
                    )}
                  </div>
                </div>

                {/* Streak */}
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Flame size={18} className="text-orange-500 fill-orange-500" />
                    <p className="text-2xl font-black tabular-nums leading-none text-orange-500">
                      {user.currentStreak}
                    </p>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">days</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom spacing for better scroll */}
        <div className="h-8"></div>
      </div>
    </div>
  );
};

export default Rank;