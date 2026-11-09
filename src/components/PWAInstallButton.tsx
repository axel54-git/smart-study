import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card' | 'badge';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'card',
  className = '' 
}) => {
  const { isInstallable, isInstalled, isIOS, install, markAsInstalled } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  // অ্যাপ ইনস্টল থাকলে এই নোটিশ ও বাটন আর থাকবে না
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (isInstallable) {
      setInstalling(true);
      try {
        const success = await install();
        if (success) {
          setShowIOSGuide(false);
        }
      } finally {
        setInstalling(false);
      }
    } else {
      // Fallback instruction for browsers where beforeinstallprompt isn't fired yet
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'header' ? (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-extrabold shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer ${className}`}
          title="হোম স্ক্রিনে ইনস্টল করুন"
        >
          <img src="/app_logo.png" alt="SmartStudy" className="w-3.5 h-3.5 rounded-full object-cover" />
          <span>{installing ? 'ইনস্টল হচ্ছে...' : 'অ্যাপ ইনস্টল'}</span>
          <Download className="w-3 h-3 stroke-[2.5]" />
        </button>
      ) : (
        <div
          className={`relative w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200/80 hover:border-amber-300 transition-all ${className}`}
        >
          <div 
            onClick={handleInstallClick}
            className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
          >
            <img src="/app_logo.png" alt="SmartStudy" className="w-10 h-10 rounded-2xl shadow-xs object-cover shrink-0" />
            <div className="text-left min-w-0">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="truncate">স্মার্টস্টাডি অ্যাপ ফোনে ইনস্টল করুন</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold shrink-0">PWA</span>
              </h4>
              <p className="text-[11px] text-slate-500 truncate">হোম স্ক্রিনে শর্টকাট আইকন হিসেবে সরাসরি ব্যবহার করুন</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              onClick={handleInstallClick}
              disabled={installing}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-75"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{installing ? 'হচ্ছে...' : 'ইনস্টল করুন'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Guide Modal for iOS Safari / Manual Installation */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-slate-100 space-y-3.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/app_logo.png" alt="SmartStudy" className="w-10 h-10 rounded-2xl shadow-xs" />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">স্মার্টস্টাডি অ্যাপ ইনস্টল</h3>
                  <p className="text-[11px] text-slate-500">হোম স্ক্রিনে যুক্ত করার নিয়ম</p>
                </div>
              </div>
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">১</span>
                    <p>সাফারি ব্রাউজারের নিচে <strong>Share (শেয়ার)</strong> বাটনে ট্যাপ করুন।</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">২</span>
                    <p>মেনু স্ক্রল করে <strong>'Add to Home Screen'</strong> নির্বাচন করুন।</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">৩</span>
                    <p>উপরে ডানপাশে <strong>'Add'</strong> চাপলেই আপনার ফোনে স্মার্টস্টাডি অ্যাপ হিসেবে সেভ হয়ে যাবে।</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">১</span>
                    <p>ব্রাউজারের ওপরের ডানপাশের <strong>তিনটি ডট (⋮)</strong> মেনু বাটনে ট্যাপ করুন।</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">২</span>
                    <p><strong>'Install app'</strong> বা <strong>'Add to Home screen'</strong> চাপুন।</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">৩</span>
                    <p>এখন সাধারণ অ্যাপের মতো যেকোনো সময় ফোনে সরাসরি ব্যবহার করুন।</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  markAsInstalled();
                  setShowIOSGuide(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                ইনস্টল সম্পন্ন হয়েছে
              </button>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs active:scale-98 transition-all cursor-pointer"
              >
                বন্ধ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
