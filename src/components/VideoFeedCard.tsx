import React from 'react';
import { Play } from 'lucide-react';
import { VideoItem } from '../data/hierarchyData';

interface VideoFeedCardProps {
  video: VideoItem;
  index: number;
  isActive: boolean;
  onPlay: (video: VideoItem) => void;
  onDownload?: (video: VideoItem) => void;
}

export const VideoFeedCard: React.FC<VideoFeedCardProps> = ({
  video,
  index,
  isActive,
  onPlay
}) => {
  // Default high-quality thumbnails if not provided
  const fallbackThumbnails = [
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
  ];

  const getYouTubeThumb = (url?: string) => {
    if (!url) return null;
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
  };

  const ytThumb = getYouTubeThumb(video.youtubeUrl);
  const thumbUrl = video.thumbnail || ytThumb || fallbackThumbnails[index % fallbackThumbnails.length];

  return (
    <div 
      onClick={() => onPlay(video)}
      className="w-full bg-white rounded-3xl p-3 shadow-md border border-slate-100 transition-all hover:shadow-lg cursor-pointer group"
    >
      {/* 1. Large 16:9 Thumbnail Box */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900">
        {/* Background Thumbnail Image */}
        <img
          src={thumbUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Subtle Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:bg-black/40 transition-colors" />

        {/* Center Play Icon - ছোট ও মার্জিত সাইজ */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transition-transform duration-300 group-hover:scale-115 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            <Play className="w-7 h-7 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* 2. Below Thumbnail: Title Only */}
      <div className="pt-2.5 px-1.5 pb-0.5">
        <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
          {video.title}
        </h4>
      </div>

    </div>
  );
};

