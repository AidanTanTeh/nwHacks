import React from 'react';
import { Home, Plus, BarChart2, User as UserIcon, Users } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { view: AppView.HOME, icon: Home, label: 'Home' },
    { view: AppView.SOCIAL, icon: Users, label: 'Social' },
    { view: AppView.WORKOUT, icon: Plus, label: 'Workout', highlight: true },
    { view: AppView.RANK, icon: BarChart2, label: 'Rank' },
    { view: AppView.PROFILE, icon: UserIcon, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40">
      {/* Gradient Fade */}
      <div className="h-12 bg-gradient-to-t from-white/0 to-transparent dark:from-black/0 dark:to-transparent pointer-events-none"></div>

      {/* Nav Bar */}
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 pb-safe shadow-lg dark:shadow-none transition-colors duration-300">
        <div className="flex justify-around items-end h-20 px-2 pb-2">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            const Icon = item.icon;

            if (item.highlight) {
              return (
                <div key={item.view} className="relative -top-6">
                  <button
                    onClick={() => onChangeView(item.view)}
                    className="w-16 h-16 bg-orange-500 hover:bg-orange-400 text-white rounded-full shadow-[0_4px_20px_rgba(249,115,22,0.4)] transition-transform active:scale-95 flex items-center justify-center border-4 border-white dark:border-black"
                  >
                    <Icon size={28} strokeWidth={2.5} />
                  </button>
                </div>
              );
            }

            return (
              <button
                key={item.view}
                onClick={() => onChangeView(item.view)}
                className={`flex flex-col items-center justify-center gap-1 w-14 h-12 mb-2 transition-colors duration-200 ${
                  isActive
                    ? 'text-orange-500 dark:text-white'
                    : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;