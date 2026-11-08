import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

export const InstallPromptModal: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // If already installed, don't show prompt
    if (isInstalled) return;

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('smartstudy_install_prompt_dismissed');
    if (isDismissed) return;

    // Trigger after 30 seconds of entering the app
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [isInstalled]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('smartstudy_install_prompt_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (isInstallable) {
      setIsInstalling(true);
      try {
        const success = await install();
        if (success) {
          setIsOpen(false);
        }
      } finally {
        setIsInstalling(false);
      }
    } else {
      // Fallback instruction if browser beforeinstallprompt hasn't fired yet
      setShowIOSGuide(true);
    }
  };

  if (!isOpen || isInstalled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative text-center">
        
        {/* উপরে ক্রস বার (Close Button) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>

        {/* অ্যাপ লোগো ও প্রিভিউ */}
        <div className="relative mx-auto w-16 h-16 mb-3 mt-1">
          <img
            src="/app_logo.png"
            alt="SmartStudy App"
            className="w-16 h-16 rounded-2xl shadow-md object-cover border-2 border-amber-100"
          />
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 shadow-xs">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        {/* অ্যাপ সম্পর্কে নোটিফিকেশন টাইটেল ও বর্ণনা */}
        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
          SmartStudy অ্যাপ ইনস্টল করুন
        </h3>
        
        <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[10px] font-bold text-amber-800">
          <Smartphone className="w-3 h-3 text-amber-600" />
          <span>অফিসিয়াল মোবাইল অ্যাপ</span>
        </div>

        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          সহজে ক্লাস করতে, অধ্যায়ের ভিডিও লেকচার দেখতে এবং কুইজ ও পরীক্ষা নিরবচ্ছিন্নভাবে উপভোগ করতে SmartStudy মোবাইল অ্যাপটি আপনার ফোনে ইনস্টল করে নিন।
        </p>

        {/* ফিচার বুলেট পয়েন্টস */}
        <div className="mt-3.5 space-y-1.5 text-left bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] text-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>হোম স্ক্রিন থেকে এক ক্লিকে সরাসরি ক্লাসে প্রবেশ</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>অফলাইন সাপোর্ট ও দ্রুতগতির লোডিং সুবিধা</span>
          </div>
        </div>

        {/* নিচে ইনস্টল বাটন - ক্লিক করলে সরাসরি অ্যাপ ইনস্টল হবে */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-black text-xs shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isInstalling ? 'ইনস্টল হচ্ছে...' : 'অ্যাপ ইনস্টল করুন'}</span>
          </button>

          <button
            onClick={handleClose}
            className="w-full py-1.5 text-slate-400 hover:text-slate-600 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            পরে ইনস্টল করব
          </button>
        </div>

        {/* iOS বা ম্যানুয়াল ইন্সটলেশন গাইড */}
        {showIOSGuide && (
          <div className="mt-3 text-left bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 space-y-1">
            <p className="font-bold">সরাসরি ইনস্টল করতে:</p>
            {isIOS ? (
              <p>সাফারি ব্রাউজারের নিচে <strong>Share</strong> চাপুন এবং <strong>'Add to Home Screen'</strong> বেছে নিন।</p>
            ) : (
              <p>ব্রাউজারের ওপরের <strong>তিনটি ডট (⋮)</strong> মেনু থেকে <strong>'Install app'</strong> বা <strong>'Add to Home screen'</strong> চাপুন।</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
