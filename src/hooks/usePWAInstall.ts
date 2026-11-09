import { useEffect, useState, useCallback } from 'react';
import { appAnalytics } from '../services/appAnalytics';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// Versioned key to prevent false positives from previous test clicks
const VERIFIED_INSTALLED_KEY = 'smartstudy_pwa_verified_installed_v2';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Checks if the web app is running in actual standalone mode on phone or verified as installed
  const checkIsStandaloneOrInstalled = useCallback((): boolean => {
    try {
      if (typeof window === 'undefined') return false;

      // 1. Check if user is currently inside the standalone installed PWA
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches;
      if (isStandalone) {
        try { localStorage.setItem(VERIFIED_INSTALLED_KEY, 'true'); } catch {}
        return true;
      }

      // 2. iOS standalone mode (launched from home screen icon)
      if ((window.navigator as unknown as { standalone?: boolean }).standalone === true) {
        try { localStorage.setItem(VERIFIED_INSTALLED_KEY, 'true'); } catch {}
        return true;
      }

      // 3. Android WebAPK / TWA launcher
      if (typeof document !== 'undefined' && document.referrer && document.referrer.startsWith('android-app://')) {
        try { localStorage.setItem(VERIFIED_INSTALLED_KEY, 'true'); } catch {}
        return true;
      }

      // 4. Verified installation record (only saved upon real install completion)
      if (localStorage.getItem(VERIFIED_INSTALLED_KEY) === 'true') {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }, []);

  const [isInstalled, setIsInstalled] = useState<boolean>(() => checkIsStandaloneOrInstalled());
  const [isIOS, setIsIOS] = useState(false);

  const markAsInstalled = useCallback(() => {
    setIsInstalled(true);
    setDeferredPrompt(null);
    try {
      localStorage.setItem(VERIFIED_INSTALLED_KEY, 'true');
      window.dispatchEvent(new Event('smartstudy-app-installed'));
      appAnalytics.recordAppInstall();
    } catch {}
  }, []);

  useEffect(() => {
    // Check initial state
    if (checkIsStandaloneOrInstalled()) {
      setIsInstalled(true);
    }

    // Check Chrome / Android getInstalledRelatedApps API
    if (typeof navigator !== 'undefined' && 'getInstalledRelatedApps' in navigator) {
      (navigator as any).getInstalledRelatedApps().then((relatedApps: any[]) => {
        if (relatedApps && relatedApps.length > 0) {
          markAsInstalled();
        }
      }).catch(() => {});
    }

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // If already installed, don't store prompt
      if (checkIsStandaloneOrInstalled()) return;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      markAsInstalled();
    };

    const handleCustomInstallEvent = () => {
      setIsInstalled(true);
    };

    // Watch for media query change to standalone
    const mql = window.matchMedia('(display-mode: standalone)');
    const handleDisplayChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        markAsInstalled();
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('smartstudy-app-installed', handleCustomInstallEvent);
    window.addEventListener('focus', () => {
      if (checkIsStandaloneOrInstalled()) {
        setIsInstalled(true);
      }
    });

    if (mql && mql.addEventListener) {
      mql.addEventListener('change', handleDisplayChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('smartstudy-app-installed', handleCustomInstallEvent);
      if (mql && mql.removeEventListener) {
        mql.removeEventListener('change', handleDisplayChange);
      }
    };
  }, [checkIsStandaloneOrInstalled, markAsInstalled]);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      markAsInstalled();
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt && !isInstalled,
    isInstalled,
    isIOS,
    install,
    markAsInstalled,
  };
}
