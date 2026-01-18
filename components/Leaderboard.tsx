import React, { useState } from 'react';
import { Friend, User } from '../types';
import { Trophy, Flame } from 'lucide-react';

interface LeaderboardProps {
  friends: Friend[];
  currentUser: User;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ friends }) => {
  const [filter, setFilter] = useState<'weekly' | 'allTime' | 'streak'>('weekly');

  const sortedFriends = [...friends].sort((a, b) => {
    if (filter === 'streak') return b.streak - a.streak;
    const valA = filter === 'weekly' ? a.weeklyDistanceKm : a.totalDistanceKm;
    const valB = filter === 'weekly' ? b.weeklyDistanceKm : b.totalDistanceKm;
    return valB - valA;
  });

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="pt-6 pb-4 px-6 bg-zinc-50 dark:bg-zinc-950 z-10 sticky top-0">
        <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2 mb-6 text-zinc-900 dark:text-white">
            LEADERBOARD
        </h2>
        
        {/* Segmented Control */}
        <div className="bg-zinc-200 dark:bg-zinc-900 rounded-xl p-1 flex font-medium relative transition-colors gap-1">
            <button 
                onClick={() => setFilter('weekly')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${filter === 'weekly' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
                Weekly
            </button>
            <button 
                onClick={() => setFilter('allTime')}
                 className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${filter === 'allTime' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
                All Time
            </button>
            <button 
                onClick={() => setFilter('streak')}
                 className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 ${filter === 'streak' ? 'bg-white dark:bg-zinc-800 text-orange-500 dark:text-orange-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
                <Flame size={12} fill={filter === 'streak' ? "currentColor" : "none"} />
                Streaks
            </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24">
        <div className="space-y-1">
            {sortedFriends.map((friend, index) => {
            const isTop3 = index < 3;
            let valueStr = '';
            let labelStr = '';

            if (filter === 'streak') {
                valueStr = friend.streak.toString();
                labelStr = 'day streak';
            } else {
                valueStr = (filter === 'weekly' ? friend.weeklyDistanceKm : friend.totalDistanceKm).toFixed(1);
                labelStr = 'km';
            }
            
            return (
                <div 
                    key={friend.id} 
                    className="flex items-center p-3 rounded-2xl hover:bg-white dark:hover:bg-zinc-900/50 transition-colors"
                >
                    <div className={`w-8 text-center font-black text-sm mr-3 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-zinc-400' : index === 2 ? 'text-orange-500' : 'text-zinc-400 dark:text-zinc-600'}`}>
                        {index + 1}
                    </div>
                    
                    <div className="relative mr-3">
                        <img 
                            src={friend.avatar} 
                            alt={friend.name} 
                            className={`w-10 h-10 rounded-full object-cover bg-zinc-200 dark:bg-zinc-800 ${isTop3 ? 'ring-2 ring-offset-2 ring-offset-zinc-50 dark:ring-offset-black ' + (index===0?'ring-yellow-500':index===1?'ring-zinc-400':'ring-orange-600') : ''}`}
                        />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{friend.name}</h3>
                        {index === 0 && <p className="text-[10px] text-yellow-600 dark:text-yellow-500 font-bold uppercase tracking-wide">Leader</p>}
                    </div>

                    <div className="text-right">
                        <p className={`text-lg font-black tabular-nums leading-none ${filter === 'streak' ? 'text-orange-500' : 'text-zinc-900 dark:text-white'}`}>
                            {valueStr}
                            {filter === 'streak' && <Flame size={14} className="inline ml-1 mb-0.5" fill="currentColor" />}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">{labelStr}</p>
                    </div>
                </div>
            );
            })}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;