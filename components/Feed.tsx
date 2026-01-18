import React from 'react';
import { RunSession, User } from '../types';
import { Clock, Map, Heart, MessageCircle, MoreHorizontal, Flame } from 'lucide-react';

interface FeedProps {
  runs: RunSession[];
  currentUser: User;
  friends: any[]; 
}

const Feed: React.FC<FeedProps> = ({ runs, friends, currentUser }) => {
  
  const getUser = (id: string) => {
    if (id === currentUser.id) return currentUser;
    return friends.find(f => f.id === id) || { name: 'Unknown', avatar: '' };
  };

  return (
    <div className="h-full bg-zinc-50 dark:bg-zinc-950 overflow-y-auto no-scrollbar pb-24 transition-colors duration-300">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 px-4 h-16 flex items-center justify-between transition-colors duration-300">
         <h1 className="text-xl font-black italic tracking-tighter text-zinc-900 dark:text-white">STRIDE<span className="text-orange-500">REAL</span></h1>
         <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
             <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
         </div>
      </div>

      <div className="p-0">
        <div className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {runs.map((run) => {
                const user = getUser(run.userId);
                return (
                    <div key={run.id} className="pb-8 pt-6 px-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-800" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-zinc-900 dark:text-white text-sm leading-none">{user.name}</h3>
                                        {run.streak && run.streak > 0 && (
                                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-100 dark:bg-orange-500/20 rounded-full border border-orange-200 dark:border-orange-500/20">
                                                <Flame size={10} className="text-orange-500 fill-orange-500" />
                                                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">{run.streak}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-1">{run.date} • {run.timestamp ? new Date(run.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</p>
                                </div>
                            </div>
                            <button className="text-zinc-400 dark:text-zinc-600">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        {/* Image Container */}
                        <div className="relative aspect-[4/5] bg-zinc-200 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl mb-4 transition-colors">
                             {run.image ? (
                                <img src={run.image} alt="Run selfie" className="w-full h-full object-cover" />
                             ) : (
                                <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-700">No Image</div>
                             )}
                             
                             {/* Stats Badge */}
                             <div className="absolute top-4 left-4 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20 dark:border-white/10 shadow-lg">
                                <p className="text-2xl font-black text-zinc-900 dark:text-white italic leading-none">{run.distanceKm.toFixed(2)}<span className="text-xs font-normal text-zinc-500 dark:text-zinc-300 not-italic ml-1">km</span></p>
                             </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center gap-6 mb-3">
                            <button className="flex items-center gap-2 text-zinc-900 dark:text-white transition-colors">
                                <Heart size={24} />
                            </button>
                            <button className="flex items-center gap-2 text-zinc-900 dark:text-white transition-colors">
                                <MessageCircle size={24} />
                            </button>
                             <div className="flex-1"></div>
                             <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                <span className="flex items-center gap-1"><Clock size={14} /> {Math.floor(run.durationSeconds / 60)}m</span>
                                <span className="flex items-center gap-1"><Map size={14} /> {run.pace}/km</span>
                            </div>
                        </div>

                        {/* Caption */}
                        {run.aiCaption && (
                            <div className="px-1">
                                <p className="text-zinc-800 dark:text-zinc-100 text-sm leading-relaxed">
                                    <span className="font-bold mr-2">{user.name}</span>
                                    {run.aiCaption}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Feed;