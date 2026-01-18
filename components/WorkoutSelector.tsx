import React from 'react';
import { WorkoutType } from '../types';
import { X } from 'lucide-react';

interface WorkoutSelectorProps {
  onSelectWorkout: (type: WorkoutType) => void;
  onClose: () => void;
}

const WorkoutSelector: React.FC<WorkoutSelectorProps> = ({ onSelectWorkout, onClose }) => {
  const workouts = [
    {
      type: WorkoutType.RUN,
      name: 'Run',
      icon: '🏃',
      gradient: 'from-orange-500 to-red-500',
      available: true,
    },
    {
      type: WorkoutType.WALK,
      name: 'Walk',
      icon: '🚶',
      gradient: 'from-green-500 to-emerald-500',
      available: true,
    },
    {
      type: WorkoutType.CYCLING,
      name: 'Cycling',
      icon: '🚴',
      gradient: 'from-blue-500 to-cyan-500',
      available: false,
    },
    {
      type: WorkoutType.SWIMMING,
      name: 'Swimming',
      icon: '🏊',
      gradient: 'from-blue-400 to-indigo-500',
      available: false,
    },
    {
      type: WorkoutType.YOGA,
      name: 'Yoga',
      icon: '🧘',
      gradient: 'from-purple-500 to-pink-500',
      available: false,
    },
    {
      type: WorkoutType.OTHER,
      name: 'Other',
      icon: '💪',
      gradient: 'from-zinc-500 to-zinc-600',
      available: false,
    },
  ];

  return (
    <div className="h-full bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="pt-6 pb-4 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Choose Workout
          </h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="text-zinc-500 dark:text-zinc-400" size={24} />
          </button>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Select your workout type to get started
        </p>
      </div>

      {/* Workout Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
        <div className="grid grid-cols-2 gap-4">
          {workouts.map((workout) => (
            <button
              key={workout.type}
              onClick={() => workout.available && onSelectWorkout(workout.type)}
              disabled={!workout.available}
              className={`relative overflow-hidden rounded-3xl p-6 aspect-square flex flex-col items-center justify-center transition-all ${
                workout.available
                  ? `bg-gradient-to-br ${workout.gradient} hover:scale-105 active:scale-95 shadow-xl`
                  : 'bg-zinc-200 dark:bg-zinc-800 opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Background decoration */}
              {workout.available && (
                <>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full blur-xl"></div>
                </>
              )}

              <div className="relative z-10 flex flex-col items-center gap-3">
                <span className="text-5xl">{workout.icon}</span>
                <span className={`font-bold text-lg ${
                  workout.available 
                    ? 'text-white' 
                    : 'text-zinc-500 dark:text-zinc-600'
                }`}>
                  {workout.name}
                </span>
              </div>

              {!workout.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <span className="text-white text-xs font-bold uppercase tracking-wider px-3 py-1 bg-black/50 rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Info text */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl">
          <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
            💡 More workout types coming in future updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSelector;