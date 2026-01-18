import React from 'react';
import { User, DailyChallenge } from '../types';
import { Flame, Trophy, TrendingUp, ChevronRight, Check } from 'lucide-react';

interface HomeProps {
  currentUser: User;
  challenges: DailyChallenge[];
}

const Home: React.FC<HomeProps> = ({ currentUser, challenges }) => {
  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalChallenges = challenges.length;

  return (
    <div className="h-full bg-zinc-50 dark:bg-zinc-950 overflow-y-auto no-scrollbar pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Hey, {currentUser.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Ready to keep the streak alive?</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Streak Card - Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl"></div>
          
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-500" size={16} />
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">This Week</span>
            </div>
            <p className="text-3xl font-black text-zinc-900 dark:text-white">5</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">workouts</p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-yellow-500" size={16} />
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Rank</span>
            </div>
            <p className="text-3xl font-black text-zinc-900 dark:text-white">#3</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">in friends</p>
          </div>
        </div>

        {/* Today's Challenges */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">Today's Challenges</h2>
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
              {completedChallenges}/{totalChallenges} Complete
            </span>
          </div>

          <div className="space-y-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  challenge.completed
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                    challenge.completed 
                      ? 'bg-green-100 dark:bg-green-500/20' 
                      : 'bg-zinc-100 dark:bg-zinc-800'
                  }`}>
                    {challenge.completed ? (
                      <Check className="text-green-600 dark:text-green-400" size={20} strokeWidth={3} />
                    ) : (
                      challenge.icon
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm mb-0.5 ${
                      challenge.completed 
                        ? 'text-green-700 dark:text-green-400 line-through' 
                        : 'text-zinc-900 dark:text-white'
                    }`}>
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                      {challenge.description}
                    </p>
                    
                    {challenge.targetValue && !challenge.completed && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full transition-all duration-300"
                            style={{ width: `${((challenge.currentValue || 0) / challenge.targetValue) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 tabular-nums">
                          {challenge.currentValue || 0}/{challenge.targetValue}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {!challenge.completed && (
                    <ChevronRight className="text-zinc-400 flex-shrink-0" size={20} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation Quote */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-500/20">
          <p className="text-zinc-700 dark:text-zinc-300 text-center italic font-medium">
            "The only workout you regret is the one you didn't do."
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 text-center text-xs mt-2">— Unknown</p>
        </div>
      </div>
    </div>
  );
};

export default Home;