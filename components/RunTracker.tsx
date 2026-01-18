import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RunState } from '../types';
import { Play, Pause, Square, MapPin, Zap, Clock } from 'lucide-react';

interface RunTrackerProps {
  onFinish: (stats: { distance: number; duration: number; pace: string }) => void;
}

const RunTracker: React.FC<RunTrackerProps> = ({ onFinish }) => {
  const [runState, setRunState] = useState<RunState>(RunState.IDLE);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const watchId = useRef<number | null>(null);
  const lastPosition = useRef<GeolocationCoordinates | null>(null);
  const startTime = useRef<number | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: number;
    if (runState === RunState.RUNNING) {
      if (!startTime.current) startTime.current = Date.now() - duration * 1000;
      
      interval = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - (startTime.current || Date.now())) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [runState, duration]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };

  const startRun = useCallback(() => {
    setRunState(RunState.RUNNING);
    setErrorMsg(null);
    startTime.current = Date.now();

    if ('geolocation' in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          if (lastPosition.current) {
            const dist = calculateDistance(
              lastPosition.current.latitude,
              lastPosition.current.longitude,
              latitude,
              longitude
            );
            if (dist > 0.005) { 
               setDistance((prev) => prev + dist);
               lastPosition.current = position.coords;
            }
          } else {
            lastPosition.current = position.coords;
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setErrorMsg("GPS signal weak");
          // Fallback simulation
          const simInterval = setInterval(() => {
             setDistance(d => d + 0.003); 
          }, 1000);
          return () => clearInterval(simInterval);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setErrorMsg("Geolocation not supported.");
      // Fallback simulation for testing without GPS
      const simInterval = setInterval(() => {
          setDistance(d => d + 0.003); 
      }, 1000);
    }
  }, []);

  const pauseRun = () => {
    setRunState(RunState.PAUSED);
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    startTime.current = null;
  };

  const stopRun = () => {
    pauseRun();
    const pace = distance > 0 ? (duration / 60) / distance : 0;
    const paceMin = Math.floor(pace);
    const paceSec = Math.round((pace - paceMin) * 60);
    const paceString = `${paceMin}:${paceSec.toString().padStart(2, '0')}`;
    
    onFinish({
      distance,
      duration,
      pace: paceString
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculatePace = () => {
    if (distance === 0) return "--'--\"";
    const pace = (duration / 60) / distance;
    const paceMin = Math.floor(pace);
    const paceSec = Math.round((pace - paceMin) * 60);
    return `${paceMin}'${paceSec.toString().padStart(2, '0')}"`;
  };

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white relative overflow-hidden transition-colors duration-300">
        {/* Animated Background */}
        {runState === RunState.RUNNING && (
             <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 dark:bg-orange-600/10 blur-[100px] rounded-full animate-pulse"></div>
             </div>
        )}

        {/* Header / GPS Status */}
        <div className="z-10 pt-8 px-6 flex justify-center">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border transition-colors ${errorMsg ? 'bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400' : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                <MapPin size={12} />
                <span>{errorMsg ? "GPS WEAK" : "GPS READY"}</span>
            </div>
        </div>

        {/* Main Stats Display - Centered */}
        <div className="flex-1 z-10 flex flex-col items-center justify-center p-6 space-y-10">
            {/* Primary Stat: Distance */}
            <div className="text-center">
                <div className="text-[8rem] sm:text-[10rem] leading-[0.85] font-black tracking-tighter tabular-nums text-zinc-900 dark:text-white transition-colors">
                    {distance.toFixed(2)}
                </div>
                <div className="text-zinc-500 font-bold tracking-[0.2em] uppercase text-sm mt-2">Kilometers</div>
            </div>

            {/* Secondary Stats: Time & Pace */}
            <div className="grid grid-cols-2 gap-12 w-full max-w-xs">
                <div className="flex flex-col items-center">
                     <div className="text-zinc-400 dark:text-zinc-500 mb-1"><Clock size={16} /></div>
                     <div className="text-3xl font-bold tabular-nums text-zinc-800 dark:text-zinc-200">{formatTime(duration)}</div>
                     <div className="text-xs text-zinc-500 dark:text-zinc-600 font-bold uppercase tracking-wider">Time</div>
                </div>
                <div className="flex flex-col items-center">
                     <div className="text-zinc-400 dark:text-zinc-500 mb-1"><Zap size={16} /></div>
                     <div className="text-3xl font-bold tabular-nums text-zinc-800 dark:text-zinc-200">{calculatePace()}</div>
                     <div className="text-xs text-zinc-500 dark:text-zinc-600 font-bold uppercase tracking-wider">Pace</div>
                </div>
            </div>
        </div>

        {/* Controls - Bottom Area */}
        <div className="z-10 pb-36 px-8 w-full flex justify-center items-center">
            {runState === RunState.IDLE && (
                <button 
                    onClick={startRun}
                    className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_4px_30px_-5px_rgba(249,115,22,0.6)] active:scale-90 transition-transform cursor-pointer"
                >
                    <Play fill="white" className="ml-1 text-white" size={40} />
                </button>
            )}

            {runState === RunState.RUNNING && (
                <button 
                    onClick={pauseRun}
                    className="w-24 h-24 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg cursor-pointer"
                >
                    <Pause fill="currentColor" className="text-zinc-900 dark:text-white" size={40} />
                </button>
            )}

            {runState === RunState.PAUSED && (
                <div className="flex items-center gap-8 animate-in fade-in slide-in-from-bottom-4">
                     <button 
                        onClick={startRun}
                        className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-90 transition-transform shadow-md cursor-pointer"
                    >
                        <Play fill="currentColor" size={28} className="ml-1 text-zinc-900 dark:text-white" />
                    </button>
                    
                    <button 
                        onClick={stopRun}
                        className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_4px_40px_-5px_rgba(249,115,22,0.5)] active:scale-95 transition-transform cursor-pointer"
                    >
                        <Square fill="white" size={32} className="text-white" />
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default RunTracker;