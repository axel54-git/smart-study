import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Smartphone } from 'lucide-react';

export const InstallPromptModal: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install, markAsInstalled } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Timer reference to manage exact 30-second intervals
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Schedule next 30-second prompt
  const scheduleNextPrompt = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Only schedule if the app is NOT installed
    if (!isInstalled) {
      timerRef.current = setTimeout(() => {
        setIsOpen(true);
      }, 30000); // Exactly 30 seconds
    }
  }, [isInstalled]);

  // Initial 30-second trigger on app entry
  useEffect(() => {
    if (isInstalled) {
      setIsOpen(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Start initial 30-second timer
    scheduleNextPrompt();

    // Recurring safety interval (every 30 seconds) ensuring the prompt reappears if closed
    const recurringInterval = setInterval(() => {
      setIsOpen((currentlyOpen) => {
        // If not installed and not already open, show notice
        if (!isInstalled && !currentlyOpen) {
          return true;
        }
        return currentlyOpen;
      });
    }, 30000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      clearInterval(recurringInterval);
    };
  }, [isInstalled, scheduleNextPrompt]);

  // Handle user closing the modal: closes and schedules next prompt in 30 seconds
  const handleClose = () => {
    setIsOpen(false);
    setShowGuide(false);
    // Restart 30-second timer so it pops up again after 30 seconds
    scheduleNextPrompt();
  };

  const handleInstallClick = async () => {
    // 1. If native browser PWA install prompt is ready, trigger directly
    if (isInstallable) {
      setIsInstalling(true);
      try {
        const success = await install();
        if (success) {
          markAsInstalled();
          setIsOpen(false);
          return;
        }
      } catch (err) {
        console.warn('Install error:', err);
      } finally {
        setIsInstalling(false);
      }
    }

    // 2. If running inside an iframe (like AI Studio preview), opening top window enables native Chrome install
    try {
      if (typeof window !== 'undefined' && window.self !== window.top) {
        window.open(window.location.href, '_blank');
      }
    } catch {}

    // Show step-by-step guide
    setShowGuide(true);
  };

  // If the app is already installed on the phone, NEVER show this notice
  if (!isOpen || isInstalled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative text-center">
        
        {/* Top-right cross close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          title="Close (Reappears in 30 seconds if not installed)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* App Logo */}
        <div className="mx-auto w-16 h-16 mb-3 mt-1">
          <img
            src="/app_logo.png"
            alt="SmartStudy App"
            className="w-16 h-16 rounded-2xl shadow-md object-cover border-2 border-amber-100"
          />
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

        {/* Action Buttons in English - Compact Size */}
        <div className="mt-5 flex flex-col items-center gap-2">
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-xs shadow-sm shadow-orange-500/20 inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-75"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
          </button>

          <button
            onClick={handleClose}
            className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer pt-1"
          >
            Maybe Later
          </button>
        </div>

        {/* Step-by-step Guide */}
        {showGuide && (
          <div className="mt-3.5 text-left bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-950 space-y-2 animate-fade-in">
            <p className="font-bold text-slate-900">How to install:</p>
            {isIOS ? (
              <p className="text-[11px] text-slate-700">
                1. Tap the <strong>Share</strong> button at bottom of Safari.<br />
                2. Select <strong>'Add to Home Screen'</strong>.<br />
                3. Tap <strong>'Add'</strong> at top right.
              </p>
            ) : (
              <p className="text-[11px] text-slate-700">
                1. Tap the <strong>three dots (⋮)</strong> menu in Chrome.<br />
                2. Tap <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.
              </p>
            )}
            <button
              onClick={handleClose}
              className="w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-[11px] text-center cursor-pointer transition-colors"
            >
              OK, Got it
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
