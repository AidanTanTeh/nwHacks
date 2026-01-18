import React from 'react';
import { Friend } from '../types';
import { UserPlus, Search } from 'lucide-react';

interface FriendsListProps {
  friends: Friend[];
}

const FriendsList: React.FC<FriendsListProps> = ({ friends }) => {
  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden transition-colors duration-300">
      <div className="pt-6 pb-4 px-6 bg-zinc-50 dark:bg-zinc-950 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black italic tracking-tighter text-zinc-900 dark:text-white">
                FRIENDS
            </h2>
            <button className="bg-zinc-200 dark:bg-zinc-800 p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-orange-500 transition-colors">
                <UserPlus size={20} />
            </button>
        </div>
        
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
                type="text" 
                placeholder="Search friends..." 
                className="w-full bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24">
        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider mb-2 px-2">Online Now</p>
        <div className="space-y-1 mb-6">
            {friends.filter(f => f.isOnline).map((friend) => (
                 <div key={friend.id} className="flex items-center p-3 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
                    <div className="relative mr-3">
                        <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{friend.name}</h3>
                        <p className="text-xs text-zinc-500">Last run 2h ago</p>
                    </div>
                    <div className="flex-1"></div>
                    <button className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full font-bold">Wave 👋</button>
                 </div>
            ))}
            {friends.filter(f => f.isOnline).length === 0 && (
                <p className="text-sm text-zinc-400 px-2 italic">No one is online right now.</p>
            )}
        </div>

        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider mb-2 px-2">All Friends</p>
        <div className="space-y-1">
            {friends.filter(f => !f.isOnline).map((friend) => (
                 <div key={friend.id} className="flex items-center p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-colors">
                    <div className="relative mr-3">
                        <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover grayscale opacity-70" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-zinc-600 dark:text-zinc-400">{friend.name}</h3>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600">{friend.totalDistanceKm.toFixed(0)} km total</p>
                    </div>
                 </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
