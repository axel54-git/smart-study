import React from 'react';
import { Home, BookOpen, User, CheckSquare } from 'lucide-react';
import { CuteRobotMascot } from './SmartStudyAIChat';

export type NavTab = 'home' | 'courses' | 'quizHub' | 'calculator' | 'rewards' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  return (
    <div className="fixed bottom-2 left-0 right-0 z-40 flex justify-center px-3 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-[340px] sm:max-w-sm bg-white/95 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-200/80 px-2 py-1 flex items-center justify-between relative transition-all">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-75 active:scale-90 active:opacity-75 cursor-pointer touch-manipulation ${
            currentTab === 'home'
              ? 'text-amber-600 font-semibold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Home"
        >
          <Home className={`w-4 h-4 ${currentTab === 'home' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[9px] mt-0.5 tracking-tight">হোম</span>
        </button>

        {/* Tab 2: Courses / Study */}
        <button
          onClick={() => onSelectTab('courses')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-75 active:scale-90 active:opacity-75 cursor-pointer touch-manipulation ${
            currentTab === 'courses'
              ? 'text-amber-600 font-semibold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Courses"
        >
          <BookOpen className={`w-4 h-4 ${currentTab === 'courses' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[9px] mt-0.5 tracking-tight">কোর্সসমূহ</span>
        </button>

        {/* Tab 3: Center Elevated Floating Button (এমসিকিউ - MCQ) */}
        <div className="flex-1 flex justify-center relative -top-3.5">
          <button
            onClick={() => onSelectTab('quizHub')}
            className={`w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-md shadow-amber-500/30 hover:scale-105 active:scale-90 active:opacity-80 transition-all duration-75 flex items-center justify-center group cursor-pointer touch-manipulation ${
              currentTab === 'quizHub' ? 'ring-2 ring-amber-400 ring-offset-1' : ''
            }`}
            title="এমসিকিউ পরীক্ষা ও প্র্যাকটিস"
            aria-label="MCQ"
          >
            <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-0.5 border border-amber-400 shadow-inner group-hover:bg-amber-50/70 transition-colors">
              <CheckSquare className={`w-4 h-4 text-amber-600 ${currentTab === 'quizHub' ? 'scale-110' : 'group-hover:scale-110'} transition-transform stroke-[2.3]`} />
              <span className="text-[7.5px] font-black tracking-tight text-slate-800 leading-none mt-0.5">এমসিকিউ</span>
            </div>
          </button>
        </div>

        {/* Tab 4: AI Assistant (Ai) with Robot Mascot Logo */}
        <button
          onClick={() => onSelectTab('rewards')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-75 active:scale-90 active:opacity-75 cursor-pointer touch-manipulation ${
            currentTab === 'rewards'
              ? 'text-amber-600 font-semibold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Ai"
        >
          <CuteRobotMascot className={`w-[17px] h-[17px] transition-transform duration-75 ${currentTab === 'rewards' ? 'scale-110 drop-shadow-xs' : 'opacity-85'}`} />
          <span className="text-[9px] mt-0.5 tracking-tight font-semibold">Ai</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-75 active:scale-90 active:opacity-75 cursor-pointer touch-manipulation ${
            currentTab === 'profile'
              ? 'text-amber-600 font-semibold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Profile"
        >
          <User className={`w-4 h-4 ${currentTab === 'profile' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[9px] mt-0.5 tracking-tight">প্রোফাইল</span>
        </button>

      </div>
    </div>
  );
};
