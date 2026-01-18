import React, { useState, useEffect } from 'react';
import { AppView, RunSession, User, Friend } from './types';
import { CURRENT_USER, MOCK_FRIENDS, MOCK_FEED } from './constants';
import Feed from './components/Feed';
import RunTracker from './components/RunTracker';
import CameraCapture from './components/CameraCapture';
import Leaderboard from './components/Leaderboard';
import Navigation from './components/Navigation';
import FriendsList from './components/FriendsList';
import { generateRunCaption } from './services/geminiService';
import { Loader2, Settings, Share2, Medal, Moon, Sun, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.FEED);
  const [currentUser] = useState<User>(CURRENT_USER);
  const [friends] = useState<Friend[]>(MOCK_FRIENDS);
  const [runs, setRuns] = useState<RunSession[]>(MOCK_FEED);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // States for handling the run flow
  const [tempRunStats, setTempRunStats] = useState<{distance: number; duration: number; pace: string} | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle finish run -> Open Camera
  const handleRunFinish = (stats: { distance: number; duration: number; pace: string }) => {
    setTempRunStats(stats);
    setIsCameraOpen(true);
  };

  // Handle capture -> Analyze with Gemini -> Save Run
  const handlePhotoCaptured = async (base64Image: string) => {
    if (!tempRunStats) return;

    setIsAnalyzing(true);
    
    // Generate AI Caption
    const caption = await generateRunCaption(base64Image, {
        distanceKm: tempRunStats.distance,
        pace: tempRunStats.pace,
        durationSeconds: tempRunStats.duration
    });

    const newRun: RunSession = {
      id: `run-${Date.now()}`,
      userId: currentUser.id,
      distanceKm: tempRunStats.distance,
      durationSeconds: tempRunStats.duration,
      pace: tempRunStats.pace,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(),
      image: base64Image,
      aiCaption: caption
    };

    setRuns([newRun, ...runs]);
    setIsAnalyzing(false);
    setIsCameraOpen(false);
    setTempRunStats(null);
    setCurrentView(AppView.FEED);
  };

  const handleCameraCancel = () => {
    if (confirm("Discard this run? You need a photo to post it!")) {
        setIsCameraOpen(false);
        setTempRunStats(null);
        setCurrentView(AppView.FEED);
    }
  };

  const renderContent = () => {
    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-zinc-950 text-white p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="relative">
                    <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
                    <Loader2 className="animate-spin text-orange-500 mb-6 relative z-10" size={64} />
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tight">ANALYZING</h2>
                <p className="text-zinc-400 max-w-[200px] mx-auto">Crafting the perfect caption for your effort...</p>
            </div>
        );
    }

    if (isCameraOpen) {
        return (
            <CameraCapture 
                onCapture={handlePhotoCaptured}
                onCancel={handleCameraCancel}
            />
        );
    }

    switch (currentView) {
      case AppView.FEED:
        return <Feed runs={runs} friends={friends} currentUser={currentUser} />;
      case AppView.RUN:
        return <RunTracker onFinish={handleRunFinish} />;
      case AppView.LEADERBOARD:
        return <Leaderboard friends={friends} currentUser={currentUser} />;
      case AppView.FRIENDS:
        return <FriendsList friends={friends} />;
      case AppView.PROFILE:
        return (
            <div className="h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-y-auto no-scrollbar pb-24 transition-colors duration-300">
                <div className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-zinc-200 dark:border-white/5">
                    <h1 className="text-xl font-bold tracking-tight">Profile</h1>
                    <Settings size={20} className="text-zinc-400" />
                </div>
                
                <div className="p-6 flex flex-col items-center">
                    <div className="relative mb-6">
                        <img 
                            src={currentUser.avatar} 
                            className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl" 
                            alt="profile"
                        />
                        <div className="absolute bottom-1 right-1 bg-orange-500 p-1.5 rounded-full border-4 border-zinc-50 dark:border-zinc-950 text-white dark:text-black">
                            <Share2 size={14} fill="currentColor" />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-black tracking-tight mb-1">{currentUser.name}</h2>
                    <p className="text-zinc-500 font-medium mb-8">Level 5 Runner</p>

                    <div className="w-full grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-white/5 flex flex-col items-center justify-center shadow-sm">
                            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Weekly Goal</p>
                            <p className="text-3xl font-black tabular-nums">{currentUser.weeklyGoalKm}<span className="text-sm font-medium text-zinc-500 ml-1">km</span></p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-white/5 flex flex-col items-center justify-center shadow-sm">
                            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Total Runs</p>
                            <p className="text-3xl font-black tabular-nums">{runs.filter(r => r.userId === currentUser.id).length}</p>
                        </div>
                    </div>

                    <div className="w-full bg-white dark:bg-zinc-900/30 rounded-3xl p-6 border border-zinc-200 dark:border-white/5 mb-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Medal className="text-yellow-500" size={20} />
                            <h3 className="font-bold">Recent Achievements</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-lg">🔥</div>
                                <div>
                                    <p className="font-bold text-sm">3 Day Streak</p>
                                    <p className="text-xs text-zinc-500">Keep it up!</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 text-lg">🏃</div>
                                <div>
                                    <p className="font-bold text-sm">Early Bird</p>
                                    <p className="text-xs text-zinc-500">Run before 6AM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* App Settings */}
                    <div className="w-full bg-white dark:bg-zinc-900/30 rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/5 shadow-sm">
                        <button 
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                                    {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                                </div>
                                <span className="font-medium text-sm">Appearance</span>
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
      default:
        return <Feed runs={runs} friends={friends} currentUser={currentUser} />;
    }
  };

  return (
    // The main container structure is handled by index.html #root styles for centering
    // We just need to ensure full height and flex here
    <>
      <div className="flex-1 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
        {renderContent()}
      </div>
      
      {!isCameraOpen && !isAnalyzing && (
        <Navigation currentView={currentView} onChangeView={setCurrentView} />
      )}
    </>
  );
};

export default App;
