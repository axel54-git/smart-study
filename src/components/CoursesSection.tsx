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
import { BOARD_CQ_DATA, BoardCQItem } from '../data/boardCQData';
import { 
  BookOpen, 
  GraduationCap, 
  BookMarked, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Clock,
  Sparkles,
  FileQuestion,
  Copy,
  Check,
  Video
} from 'lucide-react';

interface CoursesSectionProps {
  classes: ClassCategory[];
  subjects: SubjectItem[];
  chapters: ChapterItem[];
  adsConfig?: AdsSystemConfig;
  onNavChange?: (nav: { title: string | null; onBack: (() => void) | null }) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  classes,
  subjects,
  chapters,
  adsConfig,
  onNavChange
}) => {
  // Mode switcher: 'boardCQ' or 'videoCourses'
  const [activeMode, setActiveMode] = useState<'boardCQ' | 'videoCourses'>('boardCQ');

  // Navigation State for Video Courses
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Board CQ Filtering State
  const [cqLevelFilter, setCqLevelFilter] = useState<'ALL' | 'SSC' | 'HSC'>('ALL');
  const [cqSubjectFilter, setCqSubjectFilter] = useState<string>('ALL');
  const [cqExpandedId, setCqExpandedId] = useState<string | null>(null);
  const [copiedCqId, setCopiedCqId] = useState<string | null>(null);

  const handleCopyCQ = (item: BoardCQItem) => {
    const text = `[Board CQ: ${item.subject} (${item.level}) - ${item.board} ${item.year}]\n${item.chapter}\n\nউদ্দীপক:\n${item.stem}\n\nক. ${item.questions.a}\nখ. ${item.questions.b}\nগ. ${item.questions.c}\nঘ. ${item.questions.d}\n\n[সমাধান / উত্তর]:\nক. ${item.answers.a}\n\nখ. ${item.answers.b}\n\nগ. ${item.answers.c}\n\nঘ. ${item.answers.d}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch (e) {
      console.warn(e);
    }
    setCopiedCqId(item.id);
    setTimeout(() => setCopiedCqId(null), 2000);
  };

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

    if (activeMode === 'videoCourses') {
      if (activeVideo) {
        onNavChange({
          title: 'কোর্স চলছে',
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
    } else {
      onNavChange({
        title: null,
        onBack: null
      });
    }
  }, [activeMode, selectedClassId, selectedSubjectId, selectedChapterId, activeVideo, currentClass, currentSubject, currentChapter, onNavChange]);

  // Soft light pastel coloring helpers for buttons
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
    <div className="space-y-4 animate-fade-in py-1">

      {/* Top Dual Tab Switcher: Board CQ vs Video Courses */}
      <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80 max-w-sm mx-auto shadow-inner">
        <button
          onClick={() => setActiveMode('boardCQ')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMode === 'boardCQ'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileQuestion className="w-3.5 h-3.5" />
          <span>Board CQ প্রশ্নব্যাংক</span>
        </button>

        <button
          onClick={() => setActiveMode('videoCourses')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMode === 'videoCourses'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>ভিডিও কোর্সসমূহ</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* ---------------- MODE A: BOARD CQ QUESTION BANK -------------- */}
      {/* ============================================================== */}
      {activeMode === 'boardCQ' && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center mb-3">
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full inline-block mb-1 shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 inline-block mr-1 text-indigo-600" />
              Board CQ • বিগত বোর্ড প্রশ্ন ও মডেল সমাধান
            </span>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">বোর্ড সৃজনশীল প্রশ্ন (CQ)</h2>
            <p className="text-xs text-slate-500 mt-0.5">SSC ও HSC বিগত বছরের বোর্ড পরীক্ষা প্রশ্ন ও পূর্ণাঙ্গ সমাধান</p>
          </div>

          {/* Level Filter Pills: ALL / SSC / HSC */}
          <div className="flex gap-2 justify-center">
            {(['ALL', 'SSC', 'HSC'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setCqLevelFilter(lvl)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                  cqLevelFilter === lvl
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lvl === 'ALL' ? 'সকল শ্রেণি' : lvl === 'SSC' ? 'SSC (৯ম-১০ম)' : 'HSC (১১শ-১২শ)'}
              </button>
            ))}
          </div>

          {/* Subject Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold no-scrollbar justify-start sm:justify-center px-1">
            {['ALL', 'ICT', 'বাংলা', 'গণিত', 'পদার্থ', 'রসায়ন'].map(sub => (
              <button
                key={sub}
                onClick={() => setCqSubjectFilter(sub)}
                className={`px-3 py-1 rounded-xl shrink-0 transition-all cursor-pointer border ${
                  cqSubjectFilter === sub
                    ? 'bg-indigo-100 text-indigo-900 border-indigo-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                {sub === 'ALL' ? 'সকল বিষয়' : sub}
              </button>
            ))}
          </div>

          {/* লাল দাগ ব্যানার অ্যাড (ফিল্টারের নিচে) */}
          <BannerAd type="red" config={adsConfig?.redBanner} />

          {/* CQ Questions List */}
          <div className="space-y-4">
            {BOARD_CQ_DATA
              .filter(item => cqLevelFilter === 'ALL' || item.level === cqLevelFilter)
              .filter(item => {
                if (cqSubjectFilter === 'ALL') return true;
                return item.subject.toLowerCase().includes(cqSubjectFilter.toLowerCase());
              })
              .map((item, idx) => {
                const isExpanded = cqExpandedId === item.id;
                return (
                  <React.Fragment key={item.id}>
                    <div className="bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 rounded-3xl border border-indigo-200/90 p-4 sm:p-5 shadow-2xs space-y-3 transition-all hover:border-indigo-300">
                      {/* Header Badge */}
                      <div className="flex items-center justify-between text-[11px] gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            item.level === 'SSC'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : 'bg-amber-100 text-amber-900 border-amber-200'
                          }`}>
                            {item.level}
                          </span>
                          <span className="font-extrabold text-slate-800 text-xs sm:text-sm">{item.subject}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 text-[10px]">
                            {item.board} {item.year}
                          </span>
                        </div>

                        <button
                          onClick={() => handleCopyCQ(item)}
                          className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 shrink-0 p-1 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors"
                          title="প্রশ্ন ও উত্তর কপি করুন"
                        >
                          {copiedCqId === item.id ? (
                            <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              কপি হয়েছে
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-500 text-[10px] font-medium">
                              <Copy className="w-3.5 h-3.5" />
                              কপি
                            </span>
                          )}
                        </button>
                      </div>

                      <p className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                        <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{item.chapter}</span>
                      </p>

                      {/* Stem / উদ্দীপক */}
                      <div className="p-3 sm:p-3.5 rounded-2xl bg-white/95 border border-indigo-100 text-xs text-slate-800 leading-relaxed font-serif shadow-2xs">
                        <span className="font-sans font-extrabold text-indigo-900 block mb-1 text-[11px] uppercase tracking-wider">
                          উদ্দীপক:
                        </span>
                        {item.stem}
                      </div>

                      {/* Questions ক, খ, গ, ঘ */}
                      <div className="space-y-1.5 text-xs">
                        <div className="p-2 rounded-xl bg-white/80 border border-slate-200/70 text-slate-800 flex items-start gap-2">
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">ক</span>
                          <span className="flex-1">{item.questions.a}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">(১)</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/80 border border-slate-200/70 text-slate-800 flex items-start gap-2">
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">খ</span>
                          <span className="flex-1">{item.questions.b}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">(২)</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/80 border border-slate-200/70 text-slate-800 flex items-start gap-2">
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">গ</span>
                          <span className="flex-1">{item.questions.c}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">(৩)</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/80 border border-slate-200/70 text-slate-800 flex items-start gap-2">
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">ঘ</span>
                          <span className="flex-1">{item.questions.d}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">(৪)</span>
                        </div>
                      </div>

                      {/* Toggle Solution */}
                      <button
                        onClick={() => setCqExpandedId(isExpanded ? null : item.id)}
                        className={`w-full py-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isExpanded
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-xs hover:from-indigo-600 hover:to-indigo-700'
                        }`}
                      >
                        <span>{isExpanded ? 'মডেল সমাধান লুকিয়ে রাখুন' : 'উত্তর ও পূর্ণাঙ্গ মডেল সমাধান দেখুন'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      {/* Solution Box */}
                      {isExpanded && (
                        <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs space-y-3 animate-fade-in">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-900 border-b border-emerald-200/80 pb-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>বোর্ড স্ট্যান্ডার্ড মডেল সমাধান ও ব্যাখ্যা:</span>
                          </div>
                          <div>
                            <span className="font-bold text-emerald-800 block text-[11px]">ক-এর উত্তর (জ্ঞানমূলক):</span>
                            <p className="text-slate-800 mt-0.5 whitespace-pre-wrap">{item.answers.a}</p>
                          </div>
                          <div>
                            <span className="font-bold text-emerald-800 block text-[11px]">খ-এর উত্তর (অনুধাবনমূলক):</span>
                            <p className="text-slate-800 mt-0.5 whitespace-pre-wrap">{item.answers.b}</p>
                          </div>
                          <div>
                            <span className="font-bold text-emerald-800 block text-[11px]">গ-এর উত্তর (প্রয়োগমূলক):</span>
                            <div className="text-slate-800 mt-0.5 whitespace-pre-wrap font-sans bg-white/95 p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs">
                              {item.answers.c}
                            </div>
                          </div>
                          <div>
                            <span className="font-bold text-emerald-800 block text-[11px]">ঘ-এর উত্তর (উচ্চতর দক্ষতামূলক):</span>
                            <div className="text-slate-800 mt-0.5 whitespace-pre-wrap font-sans bg-white/95 p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs">
                              {item.answers.d}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* লাল দাগ ব্যানার অ্যাড (প্রতি ২ প্রশ্ন পরপর) */}
                    {(idx + 1) % 2 === 0 && (
                      <BannerAd type="red" config={adsConfig?.redBanner} />
                    )}
                  </React.Fragment>
                );
              })}
          </div>

          {/* সবুজ দাগ ব্যানার অ্যাড (বোর্ড CQ তালিকার নিচে) */}
          <BannerAd type="green" config={adsConfig?.greenBanner} />
        </div>
      )}

      {/* ============================================================== */}
      {/* ---------------- MODE B: VIDEO COURSES & LECTURES ------------ */}
      {/* ============================================================== */}
      {activeMode === 'videoCourses' && (
        <div className="space-y-4 animate-fade-in">
          {/* ---------------- LEVEL 1: COURSE BATCH / CLASS SELECTION ---------------- */}
          {!selectedClassId && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">আপনার কোর্সের শ্রেণি বেছে নিন</h2>
                <p className="text-xs text-slate-500 mt-0.5">বোর্ড পরীক্ষা ও এডমিশন প্রস্তুতির পূর্ণাঙ্গ কোর্স দেখতে ট্যাপ করুন</p>
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
                            <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-emerald-800 transition-colors">
                              {item.title}
                            </h3>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                              item.code === '9-10'
                                ? 'bg-purple-200/80 text-purple-900 border-purple-300/80'
                                : 'bg-amber-200/80 text-amber-950 border-amber-300/80'
                            }`}>
                              {item.code === '9-10' ? 'SSC Course' : 'HSC Course'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-normal mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 border ${
                        item.code === '9-10'
                          ? 'bg-white/95 text-purple-700 border-purple-200 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600'
                          : 'bg-white/95 text-amber-800 border-amber-200 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600'
                      }`}>
                        <ChevronRight className="w-4 h-4 stroke-[2.3]" />
                      </div>
                    </button>

                    {/* লাল দাগ ব্যানার অ্যাড (প্রতিটি কোর্সের নিচে) */}
                    <BannerAd type="red" config={adsConfig?.redBanner} />
                  </React.Fragment>
                ))}

                {/* সবুজ দাগ ব্যানার অ্যাড (কোর্স শ্রেণি তালিকার নিচে) */}
                <BannerAd type="green" config={adsConfig?.greenBanner} />
              </div>
            </div>
          )}

          {/* ---------------- LEVEL 2: COURSE SUBJECT SELECTION ---------------- */}
          {selectedClassId && !selectedSubjectId && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">কোর্স বিষয় নির্বাচন করুন</h2>
                <p className="text-xs text-slate-500 mt-0.5">অধ্যায়ভিত্তিক ভিডিও কোর্স মডিউল দেখতে যেকোনো বিষয়ে ট্যাপ করুন</p>
              </div>

              <div className="space-y-3.5">
                {availableSubjects.map((sub, sIdx) => (
                  <React.Fragment key={sub.id}>
                    <button
                      onClick={() => setSelectedSubjectId(sub.id)}
                      className={`w-full text-left p-4 sm:p-5 rounded-[26px] transition-all duration-200 flex items-center justify-between group border ${getSoftSubjectStyle(sIdx)} hover:shadow-md active:scale-[0.99] cursor-pointer touch-manipulation`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-inner ${sub.bgColor}`}>
                          <BookMarked className={`w-7 h-7 ${sub.iconColor}`} />
                        </div>

                        <div className="flex flex-col">
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors">
                            {sub.name}
                          </h3>
                          <p className="text-xs text-slate-600 font-normal mt-0.5">
                            {sub.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="w-9 h-9 rounded-full bg-white/95 border border-slate-200/70 shadow-2xs flex items-center justify-center text-slate-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all shrink-0">
                        <ChevronRight className="w-4 h-4 stroke-[2.3]" />
                      </div>
                    </button>

                    {/* লাল দাগ ব্যানার অ্যাড (প্রতিটি কোর্স বিষয়ের নিচে) */}
                    <BannerAd type="red" config={adsConfig?.redBanner} />
                  </React.Fragment>
                ))}

                {availableSubjects.length === 0 && (
                  <div className="text-center p-8 bg-white/80 rounded-3xl border border-slate-200">
                    <p className="text-xs text-slate-500">এই শ্রেণিতে এখনও কোনো কোর্স বিষয় নেই। এডমিন প্যানেল থেকে যোগ করতে পারেন।</p>
                  </div>
                )}

                {/* সবুজ দাগ ব্যানার অ্যাড (কোর্স বিষয় তালিকার নিচে) */}
                <BannerAd type="green" config={adsConfig?.greenBanner} />
              </div>
            </div>
          )}

          {/* ---------------- LEVEL 3: COURSE CHAPTER SELECTION ---------------- */}
          {selectedClassId && selectedSubjectId && !selectedChapterId && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">কোর্স অধ্যায় বাছুন</h2>
                <p className="text-xs text-slate-500 mt-0.5">সম্পূর্ণ ক্লাস লেকচার প্লেলিস্ট দেখতে যেকোনো অধ্যায়ে ট্যাপ করুন</p>
              </div>

              <div className="space-y-3.5">
                {availableChapters.map((chap, cIdx) => (
                  <React.Fragment key={chap.id}>
                    <button
                      onClick={() => setSelectedChapterId(chap.id)}
                      className={`w-full text-left p-4 sm:p-5 rounded-[26px] transition-all duration-200 flex items-center justify-between group border ${getSoftChapterStyle(cIdx)} hover:shadow-md active:scale-[0.99] cursor-pointer touch-manipulation`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-inner ${chap.bgColor}`}>
                          <Layers className={`w-7 h-7 ${chap.iconColor}`} />
                        </div>

                        <div className="flex flex-col">
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors">
                            {chap.chapterNumber}
                          </h3>
                          <p className="text-xs text-slate-600 font-normal mt-0.5 line-clamp-1">
                            {chap.title} {chap.subtitle ? `• ${chap.subtitle}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="w-9 h-9 rounded-full bg-white/95 border border-slate-200/70 shadow-2xs flex items-center justify-center text-slate-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all shrink-0">
                        <ChevronRight className="w-4 h-4 stroke-[2.3]" />
                      </div>
                    </button>

                    {/* লাল দাগ ব্যানার অ্যাড (অধ্যায় কার্ডের মাঝে) */}
                    <BannerAd type="red" config={adsConfig?.redBanner} />
                  </React.Fragment>
                ))}

                {availableChapters.length === 0 && (
                  <div className="text-center p-8 bg-white/80 rounded-3xl border border-slate-200">
                    <p className="text-xs text-slate-500">এই বিষয়ে এখনও কোনো কোর্স অধ্যায় নেই। এডমিন প্যানেল থেকে যোগ করুন।</p>
                  </div>
                )}

                {/* সবুজ দাগ ব্যানার অ্যাড (কোর্স অধ্যায় তালিকার নিচে) */}
                <BannerAd type="green" config={adsConfig?.greenBanner} />
              </div>
            </div>
          )}

          {/* ---------------- LEVEL 4: COURSE LECTURE THUMBNAIL FEED ---------------- */}
          {selectedClassId && selectedSubjectId && selectedChapterId && currentChapter && !activeVideo && (
            <div className="space-y-4 animate-fade-in">
              {/* পপ আপ নোটিফিকেশন অ্যাড (শুধু এই পেজে ও হেডার লাইনের নিচে কার্যকর) */}
              <SocialBarAd config={adsConfig?.socialBar} />

              <div className="flex items-center justify-between px-1 pt-1">
                <h4 className="text-base font-extrabold text-slate-900 font-sans">কোর্স লেকচারসমূহ</h4>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {currentChapter.videos.length}টি লেকচার
                </span>
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
                    <p className="text-xs text-slate-500">এই কোর্সে এখনও কোনো ভিডিও যুক্ত করা হয়নি।</p>
                    <p className="text-[11px] text-emerald-600 mt-1 font-semibold">এডমিন প্যানেল থেকে ভিডিও যুক্ত করুন।</p>
                  </div>
                )}

                {/* সবুজ দাগ ব্যানার অ্যাড (লেকচার তালিকা পেজের নিচে) */}
                <BannerAd type="green" config={adsConfig?.greenBanner} />
              </div>
            </div>
          )}

          {/* ---------------- LEVEL 5: DEDICATED COURSE SINGLE VIDEO PLAYER PAGE ---------------- */}
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
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-xs">
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
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1.5 mx-auto py-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>কোর্সের অন্যান্য লেকচার তালিকা দেখতে ফিরে যান</span>
                </button>
              </div>

              {/* সবুজ দাগ ব্যানার অ্যাড: ভিডিও পেজের একদম নিচে নেভিগেশনের ওপরে (৩০০×২৫০) */}
              <BannerAd type="green" config={adsConfig?.greenBanner} />
            </div>
          )}
        </div>
      )}

    </div>
  );
};
