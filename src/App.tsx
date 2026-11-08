import React, { useState, useEffect } from 'react';
import { BottomNav, NavTab } from './components/BottomNav';
import { AdminPanel } from './components/AdminPanel';
import { HomeSection } from './components/HomeSection';
import { CoursesSection } from './components/CoursesSection';
import { MCQSection } from './components/MCQSection';
import { SmartStudyAIChat } from './components/SmartStudyAIChat';
import { ScientificCalculator } from './components/ScientificCalculator';
import { StudentToolsProfile } from './components/StudentToolsProfile';
import { PWAInstallButton } from './components/PWAInstallButton';
import { 
  Lock, 
  X, 
  Sparkles, 
  Calculator, 
  ChevronRight, 
  ChevronLeft,
  User 
} from 'lucide-react';
import { 
  ClassCategory, 
  SubjectItem, 
  ChapterItem, 
  INITIAL_CLASSES, 
  INITIAL_SUBJECTS, 
  INITIAL_CHAPTERS 
} from './data/hierarchyData';
import { 
  INITIAL_COURSES_CLASSES, 
  INITIAL_COURSES_SUBJECTS, 
  INITIAL_COURSES_CHAPTERS 
} from './data/coursesData';
import { 
  INITIAL_MCQ_CLASSES, 
  INITIAL_MCQ_SUBJECTS, 
  INITIAL_MCQ_CHAPTERS, 
  MCQChapterItem 
} from './data/mcqData';
import { AdsSystemConfig, DEFAULT_ADS_CONFIG } from './data/adsConfig';
import { verifyAdminCredentials } from './utils/security';

import { firebaseSync } from './services/firebaseSync';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Top Header Navigation State (Back Button & Active Page Title)
  const [navState, setNavState] = useState<{ title: string | null; onBack: (() => void) | null }>({
    title: null,
    onBack: null
  });

  // 1. হোম পেজ ডাটা (সম্পূর্ণ আলাদা)
  const [homeClasses, setHomeClasses] = useState<ClassCategory[]>(() => {
    const saved = localStorage.getItem('smartstudy_home_classes_v7');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });
  const [homeSubjects, setHomeSubjects] = useState<SubjectItem[]>(() => {
    const saved = localStorage.getItem('smartstudy_home_subjects_v7');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });
  const [homeChapters, setHomeChapters] = useState<ChapterItem[]>(() => {
    const saved = localStorage.getItem('smartstudy_home_chapters_v7');
    return saved ? JSON.parse(saved) : INITIAL_CHAPTERS;
  });

  // 2. কোর্সসমূহ ডাটা (সম্পূর্ণ আলাদা)
  const [coursesClasses, setCoursesClasses] = useState<ClassCategory[]>(() => {
    const saved = localStorage.getItem('smartstudy_courses_classes_v7');
    return saved ? JSON.parse(saved) : INITIAL_COURSES_CLASSES;
  });
  const [coursesSubjects, setCoursesSubjects] = useState<SubjectItem[]>(() => {
    const saved = localStorage.getItem('smartstudy_courses_subjects_v7');
    return saved ? JSON.parse(saved) : INITIAL_COURSES_SUBJECTS;
  });
  const [coursesChapters, setCoursesChapters] = useState<ChapterItem[]>(() => {
    const saved = localStorage.getItem('smartstudy_courses_chapters_v7');
    return saved ? JSON.parse(saved) : INITIAL_COURSES_CHAPTERS;
  });

  // 3. এমসিকিউ ডাটা (সম্পূর্ণ আলাদা)
  const [mcqClasses, setMcqClasses] = useState<ClassCategory[]>(() => {
    const saved = localStorage.getItem('smartstudy_mcq_classes_v7');
    return saved ? JSON.parse(saved) : INITIAL_MCQ_CLASSES;
  });
  const [mcqSubjects, setMcqSubjects] = useState<SubjectItem[]>(() => {
    const saved = localStorage.getItem('smartstudy_mcq_subjects_v7');
    return saved ? JSON.parse(saved) : INITIAL_MCQ_SUBJECTS;
  });
  const [mcqChapters, setMcqChapters] = useState<MCQChapterItem[]>(() => {
    const saved = localStorage.getItem('smartstudy_mcq_chapters_v7');
    return saved ? JSON.parse(saved) : INITIAL_MCQ_CHAPTERS;
  });

  // 4. বিজ্ঞাপন সেটিংস (ফায়ারবেস ও লোকাল স্টোরেজ সিঙ্ক)
  const [adsConfig, setAdsConfig] = useState<AdsSystemConfig>(() => {
    const saved = localStorage.getItem('smartstudy_ads_config_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.redBanner && (parsed.redBanner.width !== 400 || parsed.redBanner.height !== 60)) {
          parsed.redBanner.width = 400;
          parsed.redBanner.height = 60;
          localStorage.setItem('smartstudy_ads_config_v1', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.warn(e);
      }
    }
    return DEFAULT_ADS_CONFIG;
  });

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem('smartstudy_home_classes_v7', JSON.stringify(homeClasses));
    localStorage.setItem('smartstudy_home_subjects_v7', JSON.stringify(homeSubjects));
    localStorage.setItem('smartstudy_home_chapters_v7', JSON.stringify(homeChapters));
  }, [homeClasses, homeSubjects, homeChapters]);

  useEffect(() => {
    localStorage.setItem('smartstudy_courses_classes_v7', JSON.stringify(coursesClasses));
    localStorage.setItem('smartstudy_courses_subjects_v7', JSON.stringify(coursesSubjects));
    localStorage.setItem('smartstudy_courses_chapters_v7', JSON.stringify(coursesChapters));
  }, [coursesClasses, coursesSubjects, coursesChapters]);

  useEffect(() => {
    localStorage.setItem('smartstudy_mcq_classes_v7', JSON.stringify(mcqClasses));
    localStorage.setItem('smartstudy_mcq_subjects_v7', JSON.stringify(mcqSubjects));
    localStorage.setItem('smartstudy_mcq_chapters_v7', JSON.stringify(mcqChapters));
  }, [mcqClasses, mcqSubjects, mcqChapters]);

  useEffect(() => {
    localStorage.setItem('smartstudy_ads_config_v1', JSON.stringify(adsConfig));
  }, [adsConfig]);

  // Firebase Realtime Listener: যখনই এডমিন কিছু যোগ বা ডিলিট করবে, ইউজার প্যানেলে সাথে সাথে চলে আসবে
  useEffect(() => {
    const unsub = firebaseSync.subscribe((data) => {
      if (!data) return;
      if (data.homeClasses && Array.isArray(data.homeClasses)) setHomeClasses(data.homeClasses);
      if (data.homeSubjects && Array.isArray(data.homeSubjects)) setHomeSubjects(data.homeSubjects);
      if (data.homeChapters && Array.isArray(data.homeChapters)) setHomeChapters(data.homeChapters);

      if (data.coursesClasses && Array.isArray(data.coursesClasses)) setCoursesClasses(data.coursesClasses);
      if (data.coursesSubjects && Array.isArray(data.coursesSubjects)) setCoursesSubjects(data.coursesSubjects);
      if (data.coursesChapters && Array.isArray(data.coursesChapters)) setCoursesChapters(data.coursesChapters);

      if (data.mcqClasses && Array.isArray(data.mcqClasses)) setMcqClasses(data.mcqClasses);
      if (data.mcqSubjects && Array.isArray(data.mcqSubjects)) setMcqSubjects(data.mcqSubjects);
      if (data.mcqChapters && Array.isArray(data.mcqChapters)) setMcqChapters(data.mcqChapters);

      if (data.adsConfig) setAdsConfig(data.adsConfig);
    });

    return () => unsub();
  }, []);

  // Admin Modal State (Cryptographically Secured)
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setPinError('অনুগ্রহ করে পাসওয়ার্ড দিন');
      return;
    }
    setIsVerifying(true);
    try {
      const res = await verifyAdminCredentials(pinInput);
      if (res.success) {
        setIsAdminOpen(true);
        setShowAdminPinModal(false);
        setPinInput('');
        setPinError('');
      } else {
        setPinError(res.error || 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const bgImage = '/assets/aistudio/1793637299357_4f44950f.jpg';

  // ---------------- FULLSCREEN ADMIN PANEL ----------------
  if (isAdminOpen) {
    return (
      <AdminPanel
        homeClasses={homeClasses}
        homeSubjects={homeSubjects}
        homeChapters={homeChapters}
        onSaveHome={(c, s, ch) => {
          setHomeClasses(c);
          setHomeSubjects(s);
          setHomeChapters(ch);
          try {
            localStorage.setItem('smartstudy_home_classes_v7', JSON.stringify(c));
            localStorage.setItem('smartstudy_home_subjects_v7', JSON.stringify(s));
            localStorage.setItem('smartstudy_home_chapters_v7', JSON.stringify(ch));
          } catch (e) {
            console.warn(e);
          }
          firebaseSync.syncToCloud({
            homeClasses: c,
            homeSubjects: s,
            homeChapters: ch,
            coursesClasses,
            coursesSubjects,
            coursesChapters,
            mcqClasses,
            mcqSubjects,
            mcqChapters,
            adsConfig
          }).catch(console.warn);
        }}
        coursesClasses={coursesClasses}
        coursesSubjects={coursesSubjects}
        coursesChapters={coursesChapters}
        onSaveCourses={(c, s, ch) => {
          setCoursesClasses(c);
          setCoursesSubjects(s);
          setCoursesChapters(ch);
          try {
            localStorage.setItem('smartstudy_courses_classes_v7', JSON.stringify(c));
            localStorage.setItem('smartstudy_courses_subjects_v7', JSON.stringify(s));
            localStorage.setItem('smartstudy_courses_chapters_v7', JSON.stringify(ch));
          } catch (e) {
            console.warn(e);
          }
          firebaseSync.syncToCloud({
            homeClasses,
            homeSubjects,
            homeChapters,
            coursesClasses: c,
            coursesSubjects: s,
            coursesChapters: ch,
            mcqClasses,
            mcqSubjects,
            mcqChapters,
            adsConfig
          }).catch(console.warn);
        }}
        mcqClasses={mcqClasses}
        mcqSubjects={mcqSubjects}
        mcqChapters={mcqChapters}
        onSaveMCQ={(c, s, ch) => {
          setMcqClasses(c);
          setMcqSubjects(s);
          setMcqChapters(ch);
          try {
            localStorage.setItem('smartstudy_mcq_classes_v7', JSON.stringify(c));
            localStorage.setItem('smartstudy_mcq_subjects_v7', JSON.stringify(s));
            localStorage.setItem('smartstudy_mcq_chapters_v7', JSON.stringify(ch));
          } catch (e) {
            console.warn(e);
          }
          firebaseSync.syncToCloud({
            homeClasses,
            homeSubjects,
            homeChapters,
            coursesClasses,
            coursesSubjects,
            coursesChapters,
            mcqClasses: c,
            mcqSubjects: s,
            mcqChapters: ch,
            adsConfig
          }).catch(console.warn);
        }}
        adsConfig={adsConfig}
        onSaveAds={(newAds) => {
          setAdsConfig(newAds);
          try {
            localStorage.setItem('smartstudy_ads_config_v1', JSON.stringify(newAds));
          } catch (e) {
            console.warn(e);
          }
          firebaseSync.syncToCloud({
            homeClasses,
            homeSubjects,
            homeChapters,
            coursesClasses,
            coursesSubjects,
            coursesChapters,
            mcqClasses,
            mcqSubjects,
            mcqChapters,
            adsConfig: newAds
          }).catch(console.warn);
        }}
        onExitAdmin={() => setIsAdminOpen(false)}
      />
    );
  }

  const isHomePage = currentTab === 'home';

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between relative bg-cover bg-center select-none"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundColor: '#ffffff'
      }}
    >
      {/* Top Header / App Brand with Back Button & Active Subpage Title - এডমিন প্যানেল সরানো হয়েছে প্রোফাইলে */}
      {currentTab !== 'calculator' && (
        <div className="w-full border-b border-slate-200/80 app-top-header-container relative z-50 bg-white/95 backdrop-blur-md">
          <header className="app-top-header w-full max-w-md mx-auto pt-3 pb-2.5 px-3 sm:px-4 flex items-center justify-between gap-2 z-50 transition-all duration-300 animate-fade-in">
            {/* Left: Optional Back button next to logo + SmartStudy Official Logo */}
            <div className="flex items-center gap-2">
              {navState.onBack && (
                <button
                  onClick={navState.onBack}
                  className="w-9 h-9 rounded-full bg-white/95 hover:bg-white text-amber-700 hover:text-amber-800 flex items-center justify-center border border-slate-200/90 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
                  title="পূর্ববর্তী পেজ"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
              )}
              <img
                src="/app_logo.png"
                alt="SmartStudy App Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-2xs shrink-0"
              />
              <img
                src="/assets/aistudio/smartstudy_logo.png"
                alt="SmartStudy"
                className="h-8 sm:h-9 w-auto max-w-[135px] sm:max-w-[170px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              />
            </div>

            {/* Right: Active Page Title Badge or Install PWA Button */}
            <div className="flex items-center gap-2 shrink-0">
              {navState.title ? (
                <div className="px-3 py-1 rounded-full bg-white/95 text-slate-800 text-xs font-bold border border-slate-200/80 shadow-2xs max-w-[170px] truncate text-right">
                  <span className="truncate">{navState.title}</span>
                </div>
              ) : (
                <PWAInstallButton variant="header" />
              )}
            </div>
          </header>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-48 transition-all duration-300 max-w-md">
        
        {/* ---------------- ১. হোম পেজ (সম্পূর্ণ আলাদা) ---------------- */}
        {currentTab === 'home' && (
          <HomeSection
            classes={homeClasses}
            subjects={homeSubjects}
            chapters={homeChapters}
            adsConfig={adsConfig}
            onNavChange={setNavState}
          />
        )}

        {/* ---------------- ২. কোর্সসমূহ পেজ (সম্পূর্ণ আলাদা) ---------------- */}
        {currentTab === 'courses' && (
          <CoursesSection
            classes={coursesClasses}
            subjects={coursesSubjects}
            chapters={coursesChapters}
            adsConfig={adsConfig}
            onNavChange={setNavState}
          />
        )}

        {/* ---------------- ৩. এমসিকিউ পেজ (সম্পূর্ণ আলাদা) ---------------- */}
        {currentTab === 'quizHub' && (
          <MCQSection
            classes={mcqClasses}
            subjects={mcqSubjects}
            chapters={mcqChapters}
            adsConfig={adsConfig}
            onNavChange={setNavState}
            onOpenCalculator={() => {
              setCurrentTab('calculator');
              setNavState({ title: null, onBack: null });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAI={() => {
              setCurrentTab('rewards');
              setNavState({ title: null, onBack: null });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ---------------- ৪. ক্যালকুলেটর পেজ: CASIO fx-570MS ---------------- */}
        {currentTab === 'calculator' && (
          <ScientificCalculator
            onBack={() => {
              setCurrentTab('home');
              setNavState({ title: null, onBack: null });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ---------------- ৫. AI ASSISTANT (জেমিনি এআই ও রোবট) ---------------- */}
        {currentTab === 'rewards' && (
          <SmartStudyAIChat
            classes={homeClasses}
            subjects={homeSubjects}
            chapters={homeChapters}
            adsConfig={adsConfig}
            onNavigateHome={() => {
              setCurrentTab('home');
              setNavState({ title: null, onBack: null });
            }}
          />
        )}

        {/* ---------------- ৬. PROFILE TAB (এডমিন প্যানেল সহ) ---------------- */}
        {currentTab === 'profile' && (
          <StudentToolsProfile
            adsConfig={adsConfig}
            onOpenCalculator={() => {
              setCurrentTab('calculator');
              setNavState({ title: null, onBack: null });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmin={() => setShowAdminPinModal(true)}
          />
        )}

      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setNavState({ title: null, onBack: null });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Admin Security Login Modal */}
      {showAdminPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center relative">
            <button
              onClick={() => {
                setShowAdminPinModal(false);
                setPinInput('');
                setPinError('');
              }}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-500/30">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">এডমিন প্যানেলে প্রবেশ</h3>
            <p className="text-xs text-slate-500 mt-1">ফুলস্ক্রিন এডমিন প্যানেলে প্রবেশ করতে পাসওয়ার্ড দিন</p>

            <form onSubmit={handlePinSubmit} className="mt-4 space-y-3">
              <input
                type="password"
                autoFocus
                placeholder="পাসওয়ার্ড লিখুন"
                value={pinInput}
                onChange={e => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                className="w-full text-center text-lg tracking-wider font-mono py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              {pinError && (
                <p className="text-xs text-rose-600 font-semibold leading-relaxed">{pinError}</p>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 disabled:opacity-60 text-white text-xs font-bold shadow-sm transition-all"
              >
                {isVerifying ? 'যাচাই করা হচ্ছে...' : 'প্রবেশ করুন'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
