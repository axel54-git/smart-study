import React, { useEffect } from 'react';
import { AdPlacementConfig } from '../data/adsConfig';

interface SocialBarAdProps {
  config?: AdPlacementConfig;
  className?: string;
}

export const SocialBarAd: React.FC<SocialBarAdProps> = ({ config, className = '' }) => {
  const isEnabled = Boolean(config && config.enabled !== false);
  const scriptUrl = config?.scriptUrl || 'https://bauval.org/14/d5971812e8228bafc23fefa5e2dcedb5';

  useEffect(() => {
    if (!isEnabled) return;

    // 0. Clear any Adsterra frequency capping cookies so the notification fires reliably on this page
    try {
      const past = 'Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/;';
      document.cookie = `co_d5971812e8228bafc23fefa5e2dcedb5=; ${past}`;
      document.cookie = `co_d5971812e8228bafc23fefa5e2dcedb5_218=; ${past}`;
      document.cookie = `co_d5971812e8228bafc23fefa5e2dcedb5_cap=; ${past}`;
    } catch (e) {}

    // 1. Inject custom CSS style to guarantee notification popup stays BELOW top header (under green line)
    const styleId = 'smartstudy-socialbar-position-override';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        /* Ensure SmartStudy top header is always strictly on top of notifications */
        .app-top-header-container, 
        header.app-top-header {
          z-index: 99999999 !important;
          position: relative !important;
        }
        /* Keep any fixed/floating notifications strictly BELOW the top header (below green mark) */
        div[style*="position: fixed"][style*="top:"],
        div[style*="position:fixed"][style*="top:"],
        div[class*="adsterra"][style*="top"],
        div[id*="adsterra"][style*="top"],
        iframe[style*="position: fixed"][style*="top:"],
        iframe[style*="position:fixed"][style*="top:"] {
          top: 68px !important;
        }
      `;
      document.head.appendChild(styleEl);
    }

    // 2. Track existing body children to cleanly remove any injected ad elements on unmount
    const initialElements = new Set(Array.from(document.body.children));

    // 3. Inject the Adsterra Social Bar script with timestamp to bypass stale 0-byte cache
    const scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';
    scriptEl.setAttribute('data-cfasync', 'false');
    const separator = scriptUrl.includes('?') ? '&' : '?';
    scriptEl.src = `${scriptUrl}${separator}_t=${Date.now()}`;
    scriptEl.async = true;
    scriptEl.id = 'smartstudy-socialbar-script';
    document.body.appendChild(scriptEl);

    // 4. CLEANUP ON UNMOUNT: Ensures notifications ONLY appear on this specific page
    return () => {
      // Remove style override
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }

      // Remove script
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }

      // Remove any DOM elements / popups created by this script
      const currentElements = Array.from(document.body.children);
      for (const el of currentElements) {
        if (!initialElements.has(el)) {
          const tag = el.tagName.toLowerCase();
          const html = el.outerHTML.toLowerCase();
          if (
            tag === 'div' || 
            tag === 'iframe' || 
            tag === 'ins' ||
            html.includes('bauval.org') ||
            html.includes('adsterra') ||
            html.includes('d5971812e8228bafc23fefa5e2dcedb5') ||
            el.className?.toString().toLowerCase().includes('social') ||
            el.id?.toString().toLowerCase().includes('social')
          ) {
            try {
              el.remove();
            } catch (e) {
              // ignore
            }
          }
        }
      }
    };
  }, [isEnabled, scriptUrl]);

  if (!isEnabled) return null;

  return (
    <div className={`w-full overflow-hidden ${className}`} id="smartstudy-socialbar-anchor" />
  );
};
