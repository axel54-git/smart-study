import React, { useState, useEffect, useRef } from 'react';
import { AdPlacementConfig } from '../data/adsConfig';

interface BannerAdProps {
  type: 'red' | 'green';
  config?: AdPlacementConfig;
  className?: string;
  label?: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({
  type,
  config,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleX, setScaleX] = useState(0.855); // Default 400 / 468 = 0.855

  const isEnabled = Boolean(config && config.enabled !== false);
  const isGreen = type === 'green';
  const nativeWidth = isGreen ? 300 : 468;
  const nativeHeight = isGreen ? 250 : 60;

  const key = config?.key || (isGreen ? '911ee250303f0d466e6e2cab58b077e0' : '5febadcb47e71b73b1202fd206a76c5c');
  const scriptUrl = config?.scriptUrl || `https://bauval.org/22/${key}`;
  const format = config?.format || 'iframe';
  const customCode = config?.customCode || '';

  useEffect(() => {
    if (!isEnabled) return;
    const update = () => {
      if (containerRef.current) {
        const availableW = containerRef.current.clientWidth || window.innerWidth;
        if (availableW > 0) {
          if (isGreen) {
            setScaleX(availableW < 300 ? availableW / 300 : 1);
          } else {
            // Target width 400px (468 scaled to 400 is ~0.855)
            const targetW = Math.min(availableW - 8, 400);
            setScaleX(Math.max(0.65, Math.min(1, targetW / 468)));
          }
        }
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isEnabled, isGreen]);

  if (!isEnabled) {
    return null;
  }

  const isCustomHtml = customCode.trim().length > 0 && 
    (customCode.includes('<img') || customCode.includes('<div') || customCode.includes('<a '));

  const adFrameUrl = `/ad-frame.html?key=${encodeURIComponent(key)}&width=${nativeWidth}&height=${nativeHeight}&format=${encodeURIComponent(format)}&scriptUrl=${encodeURIComponent(scriptUrl)}`;

  return (
    <div 
      ref={containerRef}
      className={`w-full flex items-center justify-center my-3 px-1 ${className}`}
    >
      <div 
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all ${
          isGreen ? 'w-[300px] h-[250px]' : 'w-full max-w-[400px] h-[60px]'
        }`}
      >
        <div 
          style={{
            width: `${nativeWidth}px`,
            height: `${nativeHeight}px`,
            transform: `scale(${scaleX}, ${isGreen ? scaleX : 1})`,
            transformOrigin: 'center center'
          }}
          className="shrink-0 flex items-center justify-center overflow-hidden"
        >
          <iframe
            title={`SmartStudy Ad ${config?.id || 'slot'}`}
            src={isCustomHtml ? undefined : adFrameUrl}
            srcDoc={isCustomHtml ? customCode : undefined}
            width={nativeWidth}
            height={nativeHeight}
            scrolling="no"
            frameBorder="0"
            className="border-0 overflow-hidden block"
            style={{ width: `${nativeWidth}px`, height: `${nativeHeight}px` }}
          />
        </div>
      </div>
    </div>
  );
};
