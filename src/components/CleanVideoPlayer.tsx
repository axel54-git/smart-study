import React, { useRef, useEffect } from 'react';

interface CleanVideoPlayerProps {
  videoUrl: string;
  title: string;
  chapterInfo?: string;
  duration?: string;
  instructor?: string;
}

export const CleanVideoPlayer: React.FC<CleanVideoPlayerProps> = ({ 
  videoUrl, 
  title, 
  chapterInfo,
  duration,
  instructor 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Prevent external redirect attempts while video is open
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return (e.returnValue = '');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Enforce 360p (medium) playback quality via YouTube postMessage API
  const enforce360pQuality = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    try {
      // 1. Set playback quality to medium (360p)
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'setPlaybackQuality',
        args: ['medium']
      }), '*');

      // 2. Lock playback quality range to 360p
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'setPlaybackQualityRange',
        args: ['medium', 'medium']
      }), '*');
    } catch (e) {
      // Fallback silently if sandboxed message passing is restricted
    }
  };

  // Helper to extract clean YouTube ID
  const getYouTubeId = (url?: string) => {
    if (!url) return 'zF_QuSpQdsI';
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : 'zF_QuSpQdsI';
  };

  const isDirectVideo = videoUrl && (
    videoUrl.endsWith('.mp4') || 
    videoUrl.endsWith('.webm') || 
    videoUrl.includes('.mp4?') ||
    videoUrl.startsWith('blob:')
  );

  const ytId = getYouTubeId(videoUrl);

  // YouTube embed URL locked to 360p (vq=medium)
  const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&controls=1&disablekb=0&fs=1&vq=medium&enablejsapi=1`;

  return (
    <div className="w-full space-y-2">
      {/* 
        360p Optimized & Security Protected Video Frame:
        - vq=medium: Forces YouTube to stream in 360p resolution (saves mobile MB and ensures zero buffering)
        - sandbox without allow-top-navigation & without allow-popups:
          Clicking anywhere on the video CANNOT redirect away to other websites
        - youtube-nocookie privacy mode
        - iv_load_policy=3: disables popup cards/annotations on video
      */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-video min-h-[230px] xs:min-h-[250px] sm:min-h-[340px] md:min-h-[420px] rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-200"
      >
        {isDirectVideo ? (
          /* Native HTML5 Video */
          <video
            src={videoUrl}
            autoPlay
            controls
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          /* YouTube Embed with 360p Lock & Strict Sandbox Security */
          <iframe
            ref={iframeRef}
            key={ytId}
            src={embedUrl}
            title={title || 'SmartStudy ভিডিও'}
            onLoad={() => {
              // Trigger 360p quality enforcement upon load
              setTimeout(enforce360pQuality, 1000);
              setTimeout(enforce360pQuality, 3000);
            }}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
          />
        )}
      </div>
    </div>
  );
};
