import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

export const InstallPromptModal: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install, markAsInstalled } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // If the app is already installed on the mobile device, NEVER show this notice
    if (isInstalled) {
      setIsOpen(false);
      return;
    }

    // Initial trigger after 30 seconds
    const initialTimer = setTimeout(() => {
      setIsOpen(true);
    }, 30000);

    // Repeat prompt every 1 minute (60 seconds) if not installed
    const intervalTimer = setInterval(() => {
      // Re-check installed status before showing
      const saved = localStorage.getItem('smartstudy_app_is_installed') === 'true';
      if (!saved) {
        setIsOpen(true);
      }
    }, 60000); // 1 minute interval

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [isInstalled]);

  const handleClose = () => {
    setIsOpen(false);
    setShowIOSGuide(false);
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
          markAsInstalled();
          setIsOpen(false);
        }
      } finally {
        setIsInstalling(false);
      }
    } else {
      setShowIOSGuide(true);
    }
  };

  // If installed, never display anything
  if (!isOpen || isInstalled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative text-center">
        
        {/* Top-right close button (ক্রস বোতাম) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* App Logo */}
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

        {/* Title in English */}
        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
          Install SmartStudy App
        </h3>
        
        {/* Badge in English */}
        <div className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-bold text-amber-800">
          <Smartphone className="w-3.5 h-3.5 text-amber-600" />
          <span>Official Mobile App</span>
        </div>

        {/* Note: Middle text and bullet points highlighted in red box have been completely deleted as requested */}

        {/* Action Buttons in English */}
        <div className="mt-5 space-y-2.5">
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-black text-xs shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
          </button>

          <button
            onClick={handleClose}
            className="w-full py-1.5 text-slate-400 hover:text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>

        {/* iOS / Manual Guide (in English) */}
        {showIOSGuide && (
          <div className="mt-3.5 text-left bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-950 space-y-2">
            <p className="font-bold">How to install:</p>
            {isIOS ? (
              <p className="text-[11px]">Tap the <strong>Share</strong> icon in Safari and select <strong>'Add to Home Screen'</strong>.</p>
            ) : (
              <p className="text-[11px]">Tap the <strong>three dots (⋮)</strong> menu in Chrome and select <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.</p>
            )}
            <button
              onClick={() => {
                markAsInstalled();
                setShowIOSGuide(false);
                setIsOpen(false);
              }}
              className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs text-center cursor-pointer shadow-xs"
            >
              Already Installed
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
