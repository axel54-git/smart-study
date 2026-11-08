import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Smartphone } from 'lucide-react';

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
    // 1. If native install prompt is ready, trigger immediately
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

    // 2. If inside iframe (like AI Studio preview), opening directly in browser enables Chrome native install prompt
    try {
      if (typeof window !== 'undefined' && window.self !== window.top) {
        window.open(window.location.href, '_blank');
      }
    } catch {}

    setShowIOSGuide(true);
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

        {/* App Logo without star */}
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

        {/* Action Buttons in English - Compact Sized Button as requested */}
        <div className="mt-5 flex flex-col items-center gap-2">
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-xs shadow-sm shadow-orange-500/20 inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-75"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
          </button>

          <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-slate-400">
            <button
              onClick={() => {
                markAsInstalled();
                setIsOpen(false);
              }}
              className="hover:text-amber-600 transition-colors cursor-pointer"
            >
              Already Installed
            </button>
            <span>•</span>
            <button
              onClick={handleClose}
              className="hover:text-slate-600 transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
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
