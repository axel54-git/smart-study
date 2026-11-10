import React, { useState, useEffect } from 'react';
import { 
  ClassCategory, 
  SubjectItem, 
  ChapterItem, 
  VideoItem 
} from '../data/hierarchyData';
import { VideoFeedCard } from './VideoFeedCard';
import { CleanVideoPlayer } from './CleanVideoPlayer';
import { BannerAd } from './BannerAd';
import { SocialBarAd } from './SocialBarAd';
import { AdsSystemConfig } from '../data/adsConfig';
import { 
  BookOpen, 
  GraduationCap, 
  BookMarked, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Clock 
} from 'lucide-react';

interface HomeSectionProps {
  classes: ClassCategory[];
  subjects: SubjectItem[];
  chapters: ChapterItem[];
  adsConfig?: AdsSystemConfig;
  onNavChange?: (nav: { title: string | null; onBack: (() => void) | null }) => void;
  resetTrigger?: number;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  classes,
  subjects,
  chapters,
  adsConfig,
  onNavChange,
  resetTrigger
}) => {
  // Navigation State for Home Tab
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Immediately reset back to root classes view whenever resetTrigger is incremented
  useEffect(() => {
    setSelectedClassId(null);
    setSelectedSubjectId(null);
    setSelectedChapterId(null);
    setActiveVideo(null);
  }, [resetTrigger]);

  // Derived current items
  const currentClass = classes.find(c => c.id === selectedClassId);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentChapter = chapters.find(ch => ch.id === selectedChapterId);

  // Filtered lists
  const availableSubjects = subjects.filter(s => s.classId === selectedClassId);
  const availableChapters = chapters.filter(ch => ch.subjectId === selectedSubjectId);

  // When chapter is opened, start on thumbnail list page
  useEffect(() => {
    setActiveVideo(null);
  }, [selectedChapterId]);

  // Sync navigation title & back handler with top header
  useEffect(() => {
    if (!onNavChange) return;

    if (activeVideo) {
      onNavChange({
        title: 'ভিডিও চলছে',
        onBack: () => setActiveVideo(null)
      });
    } else if (selectedChapterId && currentChapter) {
      onNavChange({
        title: currentChapter.chapterNumber,
        onBack: () => setSelectedChapterId(null)
      });
    } else if (selectedSubjectId && currentSubject) {
      onNavChange({
        title: currentSubject.name,
        onBack: () => setSelectedSubjectId(null)
      });
    } else if (selectedClassId && currentClass) {
      onNavChange({
        title: currentClass.title,
        onBack: () => setSelectedClassId(null)
      });
    } else {
      onNavChange({
        title: null,
        onBack: null
      });
    }
  }, [selectedClassId, selectedSubjectId, selectedChapterId, activeVideo, currentClass, currentSubject, currentChapter, onNavChange]);

  // Soft light pastel coloring helpers for buttons (light, aesthetic, clearly visible pastel tones)
  const getSoftClassStyle = (code: string, idx: number) => {
    if (code === '9-10') {
      return 'bg-gradient-to-br from-violet-100/95 via-purple-50 to-indigo-50/90 border-violet-200 hover:border-violet-400 shadow-[0_4px_18px_rgba(139,92,246,0.10)]';
    }
    if (code === '11-12') {
      return 'bg-gradient-to-br from-amber-100/95 via-orange-50 to-yellow-50/90 border-amber-200 hover:border-amber-400 shadow-[0_4px_18px_rgba(245,158,11,0.10)]';
    }
    const fallbacks = [
      'bg-gradient-to-br from-teal-100/95 via-emerald-50 to-cyan-50/90 border-teal-200 hover:border-teal-400 shadow-[0_4px_18px_rgba(20,184,166,0.10)]',
      'bg-gradient-to-br from-rose-100/95 via-pink-50 to-red-50/90 border-rose-200 hover:border-rose-400 shadow-[0_4px_18px_rgba(244,63,94,0.10)]',
      'bg-gradient-to-br from-sky-100/95 via-blue-50 to-cyan-50/90 border-sky-200 hover:border-sky-400 shadow-[0_4px_18px_rgba(14,165,233,0.10)]'
    ];
    return fallbacks[idx % fallbacks.length];
  };

  const getSoftSubjectStyle = (idx: number) => {
    const styles = [
      'bg-gradient-to-br from-rose-100/90 via-pink-50 to-orange-50/80 border-rose-200 hover:border-rose-400 shadow-[0_3px_15px_rgba(244,63,94,0.08)]',
      'bg-gradient-to-br from-sky-100/90 via-cyan-50 to-blue-50/80 border-sky-200 hover:border-sky-400 shadow-[0_3px_15px_rgba(14,165,233,0.08)]',
      'bg-gradient-to-br from-emerald-100/90 via-teal-50 to-green-50/80 border-emerald-200 hover:border-emerald-400 shadow-[0_3px_15px_rgba(16,185,129,0.08)]',
      'bg-gradient-to-br from-violet-100/90 via-purple-50 to-indigo-50/80 border-violet-200 hover:border-violet-400 shadow-[0_3px_15px_rgba(139,92,246,0.08)]',
      'bg-gradient-to-br from-amber-100/90 via-yellow-50 to-orange-50/80 border-amber-200 hover:border-amber-400 shadow-[0_3px_15px_rgba(245,158,11,0.08)]',
      'bg-gradient-to-br from-teal-100/90 via-emerald-50 to-cyan-50/80 border-teal-200 hover:border-teal-400 shadow-[0_3px_15px_rgba(20,184,166,0.08)]'
    ];
    return styles[idx % styles.length];
  };

  const getSoftChapterStyle = (idx: number) => {
    const styles = [
      'bg-gradient-to-br from-indigo-100/90 via-blue-50 to-violet-50/80 border-indigo-200 hover:border-indigo-400 shadow-[0_3px_15px_rgba(99,102,241,0.08)]',
      'bg-gradient-to-br from-teal-100/90 via-emerald-50 to-cyan-50/80 border-teal-200 hover:border-teal-400 shadow-[0_3px_15px_rgba(20,184,166,0.08)]',
      'bg-gradient-to-br from-amber-100/90 via-orange-50 to-yellow-50/80 border-amber-200 hover:border-amber-400 shadow-[0_3px_15px_rgba(245,158,11,0.08)]',
      'bg-gradient-to-br from-fuchsia-100/90 via-pink-50 to-purple-50/80 border-fuchsia-200 hover:border-fuchsia-400 shadow-[0_3px_15px_rgba(217,70,239,0.08)]',
      'bg-gradient-to-br from-cyan-100/90 via-sky-50 to-teal-50/80 border-cyan-200 hover:border-cyan-400 shadow-[0_3px_15px_rgba(6,182,212,0.08)]'
    ];
    return styles[idx % styles.length];
  };

  return (
    <div className="space-y-4 animate-fade-in">

      {/* ---------------- LEVEL 1: CLASS SELECTION (৯-১০, ১১-১২) ---------------- */}
      {!selectedClassId && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">আপনার শ্রেণি বেছে নিন</h2>
            <p className="text-xs text-slate-500 mt-0.5">বিষয় ও ভিডিও গাইড দেখতে যেকোনো একটি শ্রেণিতে ট্যাপ করুন</p>
          </div>

          <div className="space-y-3.5">
            {classes.map((item, idx) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => setSelectedClassId(item.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-[26px] transition-all duration-200 flex items-center justify-between group border ${getSoftClassStyle(item.code, idx)} hover:shadow-md active:scale-[0.99] cursor-pointer touch-manipulation`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-inner ${
                      item.code === '9-10' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.code === '9-10' ? (
                        <BookOpen className="w-7 h-7 text-purple-700" />
                      ) : (
                        <GraduationCap className="w-7 h-7 text-amber-800" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-amber-800 transition-colors">
                          {item.title}
                        </h3>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          item.code === '9-10'
                            ? 'bg-purple-200/80 text-purple-900 border-purple-300/80'
                            : 'bg-amber-200/80 text-amber-950 border-amber-300/80'
                        }`}>
                          {item.code === '9-10' ? 'SSC' : 'HSC'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-normal mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 border ${
                    item.code === '9-10'
                      ? 'bg-white/95 text-purple-700 border-purple-200 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600'
                      : 'bg-white/95 text-amber-800 border-amber-200 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500'
                  }`}>
                    <ChevronRight className="w-4 h-4 stroke-[2.3]" />
                  </div>
                </button>

                {/* লাল দাগ ব্যানার অ্যাড (প্রতিটি শ্রেণির নিচে) */}
                <BannerAd type="red" config={adsConfig?.redBanner} />
              </React.Fragment>
            ))}

            {/* সবুজ দাগ ব্যানার অ্যাড (শ্রেণি পেজের একদম নিচে) */}
            <BannerAd type="green" config={adsConfig?.greenBanner} />
          </div>
        </div>
      )}

      {/* ---------------- LEVEL 2: SUBJECT SELECTION ---------------- */}
      {selectedClassId && !selectedSubjectId && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">পাঠ্যবিষয় নির্বাচন করুন</h2>
            <p className="text-xs text-slate-500 mt-0.5">অধ্যায়ভিত্তিক ভিডিও ক্লাস ও গাইড দেখতে বিষয় নির্বাচন করুন</p>
          </div>

          <div className="space-y-3.5">
            {availableSubjects.map((sub, sIdx) => (
              <React.Fragment key={sub.id}>
                <button
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-[26px] transition-all duration-200 flex items-center justify-between group shadow-2xs border ${getSoftSubjectStyle(sIdx)} hover:shadow-xs active:scale-[0.99] cursor-pointer touch-manipulation`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-inner ${sub.bgColor}`}>
                      <BookMarked className={`w-7 h-7 ${sub.iconColor}`} />
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-amber-700 transition-colors">
                        {sub.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-normal mt-0.5">
                        {sub.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/90 border border-slate-200/70 shadow-2xs flex items-center justify-center text-slate-500 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* লাল দাগ ব্যানার অ্যাড (প্রতিটি পাঠ্যবিষয়ের নিচে) */}
                <BannerAd type="red" config={adsConfig?.redBanner} />
              </React.Fragment>
            ))}

            {availableSubjects.length === 0 && (
              <div className="text-center p-8 bg-white/80 rounded-3xl border border-slate-200">
                <p className="text-xs text-slate-500">এই শ্রেণিতে এখনও কোনো বিষয় নেই। এডমিন প্যানেল থেকে যোগ করতে পারেন।</p>
              </div>
            )}

            {/* সবুজ দাগ ব্যানার অ্যাড (বিষয় পেজের নিচে) */}
            <BannerAd type="green" config={adsConfig?.greenBanner} />
          </div>
        </div>
      )}

      {/* ---------------- LEVEL 3: CHAPTER SELECTION ---------------- */}
      {selectedClassId && selectedSubjectId && !selectedChapterId && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">অধ্যায় বেছে নিন</h2>
            <p className="text-xs text-slate-500 mt-0.5">ভিডিও প্লেলিস্ট দেখতে যেকোনো একটি অধ্যায়ে ট্যাপ করুন</p>
          </div>

          <div className="space-y-3.5">
            {availableChapters.map((chap, cIdx) => (
              <React.Fragment key={chap.id}>
                <button
                  onClick={() => setSelectedChapterId(chap.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-[26px] transition-all duration-200 flex items-center justify-between group shadow-2xs border ${getSoftChapterStyle(cIdx)} hover:shadow-xs active:scale-[0.99] cursor-pointer touch-manipulation`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-inner ${chap.bgColor}`}>
                      <Layers className={`w-7 h-7 ${chap.iconColor}`} />
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-amber-700 transition-colors">
                        {chap.chapterNumber}
                      </h3>
                      <p className="text-xs text-slate-500 font-normal mt-0.5 line-clamp-1">
                        {chap.title} {chap.subtitle ? `• ${chap.subtitle}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/90 border border-slate-200/70 shadow-2xs flex items-center justify-center text-slate-500 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* লাল দাগ ব্যানার অ্যাড (অধ্যায় কার্ডের মাঝে) */}
                <BannerAd type="red" config={adsConfig?.redBanner} />
              </React.Fragment>
            ))}

            {availableChapters.length === 0 && (
              <div className="text-center p-8 bg-white/80 rounded-3xl border border-slate-200">
                <p className="text-xs text-slate-500">এই বিষয়ে এখনও কোনো অধ্যায় যোগ করা হয়নি। এডমিন প্যানেল থেকে যোগ করুন।</p>
              </div>
            )}

            {/* সবুজ দাগ ব্যানার অ্যাড (অধ্যায় পেজের নিচে) */}
            <BannerAd type="green" config={adsConfig?.greenBanner} />
          </div>
        </div>
      )}

      {/* ---------------- LEVEL 4: CHAPTER THUMBNAIL FEED ---------------- */}
      {selectedClassId && selectedSubjectId && selectedChapterId && currentChapter && !activeVideo && (
        <div className="space-y-4 animate-fade-in">
          {/* পপ আপ নোটিফিকেশন অ্যাড (শুধু এই পেজে ও হেডার লাইনের নিচে কার্যকর) */}
          <SocialBarAd config={adsConfig?.socialBar} />

          <div className="px-1 pt-1">
            <h4 className="text-base font-extrabold text-slate-900 font-sans">ক্লাস লেকচারসমূহ</h4>
          </div>

          <div className="space-y-4">
            {currentChapter.videos.map((vid, vIdx) => (
              <React.Fragment key={vid.id}>
                <VideoFeedCard
                  video={vid}
                  index={vIdx}
                  isActive={false}
                  onPlay={(selectedVid) => {
                    setActiveVideo(selectedVid);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
                {/* লাল দাগ ব্যানার অ্যাড (ভিডিও কার্ডের মাঝে) */}
                <BannerAd type="red" config={adsConfig?.redBanner} />
              </React.Fragment>
            ))}

            {currentChapter.videos.length === 0 && (
              <div className="text-center p-8 bg-white/90 rounded-3xl border border-slate-200">
                <Play className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-xs text-slate-500">এই অধ্যায়ে এখনও কোনো ভিডিও যুক্ত করা হয়নি।</p>
                <p className="text-[11px] text-amber-600 mt-1 font-semibold">এডমিন প্যানেল থেকে ভিডিও যুক্ত করুন।</p>
              </div>
            )}

            {/* সবুজ দাগ ব্যানার অ্যাড (ভিডিও তালিকা পেজের নিচে) */}
            <BannerAd type="green" config={adsConfig?.greenBanner} />
          </div>
        </div>
      )}

      {/* ---------------- LEVEL 5: DEDICATED SINGLE VIDEO PLAYER PAGE ---------------- */}
      {selectedClassId && selectedSubjectId && selectedChapterId && currentChapter && activeVideo && (
        <div className="space-y-4 animate-fade-in">
          {/* পপ আপ নোটিফিকেশন অ্যাড (ভিডিও পেজে হেডার লাইনের নিচে কার্যকর) */}
          <SocialBarAd config={adsConfig?.socialBar} />

          {/* লাল দাগ ব্যানার অ্যাড ১: ভিডিও প্লেয়ারের ঠিক উপরে */}
          <BannerAd type="red" config={adsConfig?.redBanner} />

          <div className="bg-white rounded-3xl p-2 sm:p-3 shadow-xl border border-slate-200/90 transition-all space-y-3">
            <CleanVideoPlayer
              videoUrl={activeVideo.youtubeUrl || 'https://youtu.be/zF_QuSpQdsI'}
              title={activeVideo.title}
              chapterInfo={`${currentChapter.chapterNumber} • ${currentSubject?.name}`}
              duration={activeVideo.duration}
              instructor={activeVideo.instructor}
            />

            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1.5">
              <div>
                <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-xs">
                  {currentChapter.chapterNumber} • {currentSubject?.name}
                </span>
              </div>

              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                {activeVideo.title}
              </h3>
            </div>
          </div>

          {/* লাল দাগ ব্যানার অ্যাড ২: ভিডিও কার্ডের নিচে */}
          <BannerAd type="red" config={adsConfig?.redBanner} />

          <div className="p-4 bg-white/90 rounded-2xl border border-slate-200/80 text-center">
            <button
              onClick={() => setActiveVideo(null)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center justify-center gap-1.5 mx-auto py-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>অধ্যায়ের অন্যান্য ক্লাস তালিকা দেখতে ফিরে যান</span>
            </button>
          </div>

          {/* সবুজ দাগ ব্যানার অ্যাড: ভিডিও পেজের একদম নিচে নেভিগেশনের ওপরে (৩০০×২৫০) */}
          <BannerAd type="green" config={adsConfig?.greenBanner} />
        </div>
      )}
    </div>
  );
};
