import React, { useState } from 'react';
import { 
  ClassCategory, 
  SubjectItem 
} from '../data/hierarchyData';
import { 
  MCQChapterItem, 
  MCQQuestionItem 
} from '../data/mcqData';
import { BannerAd } from './BannerAd';
import { AdsSystemConfig } from '../data/adsConfig';
import { 
  BookOpen, 
  GraduationCap, 
  BookMarked, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Calculator, 
  Trophy, 
  Award,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface MCQSectionProps {
  classes: ClassCategory[];
  subjects: SubjectItem[];
  chapters: MCQChapterItem[];
  adsConfig?: AdsSystemConfig;
  onOpenCalculator: () => void;
  onOpenAI: () => void;
  onNavChange?: (nav: { title: string | null; onBack: (() => void) | null }) => void;
}

export const MCQSection: React.FC<MCQSectionProps> = ({
  classes,
  subjects,
  chapters,
  adsConfig,
  onOpenCalculator,
  onOpenAI,
  onNavChange
}) => {
  // Completely Independent Navigation State for MCQ Tab
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  // Multiple-Question Exam & Sheet State
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isEvaluated, setIsEvaluated] = useState(false);

  // Derived current items
  const currentClass = classes.find(c => c.id === selectedClassId);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentChapter = chapters.find(ch => ch.id === selectedChapterId);

  // Filtered lists
  const availableSubjects = subjects.filter(s => s.classId === selectedClassId);
  const availableChapters = chapters.filter(ch => ch.subjectId === selectedSubjectId);

  // Current questions for the selected chapter
  const chapterQuestions: MCQQuestionItem[] = currentChapter?.questions || [];

  // Sync navigation title & back handler with top header
  React.useEffect(() => {
    if (!onNavChange) return;

    if (selectedChapterId && currentChapter) {
      onNavChange({
        title: `${currentChapter.chapterNumber} • এমসিকিউ`,
        onBack: () => {
          setSelectedChapterId(null);
          setUserAnswers({});
          setIsEvaluated(false);
        }
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
  }, [selectedClassId, selectedSubjectId, selectedChapterId, currentClass, currentSubject, currentChapter, onNavChange]);

  // Handlers for Exam Sheet
  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (isEvaluated) return; // Prevent changing after evaluation
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optIdx
    }));
  };

  const handleResetExam = () => {
    setUserAnswers({});
    setIsEvaluated(false);
  };

  const handleEvaluate = () => {
    setIsEvaluated(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Evaluation Metrics
  const totalQuestions = chapterQuestions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = chapterQuestions.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);
  const wrongCount = chapterQuestions.reduce((acc, q) => {
    return userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.correctIndex ? acc + 1 : acc;
  }, 0);
  const unansweredCount = totalQuestions - answeredCount;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Bengali numerals helper
  const toBn = (num: number) => {
    const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(d => bnNums[Number(d)] || d).join('');
  };

  return (
    <div className="space-y-4 animate-fade-in py-1">
      {/* ---------------- LEVEL 1: MCQ CLASS SELECTION ---------------- */}
      {!selectedClassId && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center mb-5">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block mb-1.5 shadow-2xs">
              <CheckSquare className="w-3.5 h-3.5 inline-block mr-1 text-amber-600" />
              এমসিকিউ হাব • শ্রেণি নির্বাচন
            </span>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">আপনার এমসিকিউ শ্রেণি বাছুন</h2>
            <p className="text-xs text-slate-500 mt-0.5">অধ্যায়ভিত্তিক বোর্ড স্ট্যান্ডার্ড এমসিকিউ সমাধান ও পরীক্ষা দিতে ট্যাপ করুন</p>
          </div>

          <div className="space-y-3.5">
            {classes.map((item, idx) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => setSelectedClassId(item.id)}
                  className="w-full text-left p-4 sm:p-5 rounded-[26px] bg-white transition-all duration-200 flex items-center justify-between group shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100 hover:border-amber-400 hover:shadow-[0_8px_25px_rgba(245,158,11,0.12)] active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-inner ${item.bgColor}`}>
                      {item.code === '9-10' ? (
                        <BookOpen className={`w-7 h-7 ${item.iconColor}`} />
                      ) : (
                        <GraduationCap className={`w-7 h-7 ${item.iconColor}`} />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-amber-700 transition-colors">
                          {item.title}
                        </h3>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          এমসিকিউ
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-normal mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* লাল দাগ ব্যানার অ্যাড (প্রতিটি শ্রেণির নিচে) */}
                <BannerAd type="red" config={adsConfig?.redBanner} />
              </React.Fragment>
            ))}

            {/* সবুজ দাগ ব্যানার অ্যাড (শ্রেণি তালিকার নিচে) */}
            <BannerAd type="green" config={adsConfig?.greenBanner} />
          </div>
        </div>
      )}

      {/* ---------------- LEVEL 2: MCQ SUBJECT SELECTION ---------------- */}
      {selectedClassId && !selectedSubjectId && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center mb-5">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block mb-1.5 shadow-2xs">
              {currentClass?.title} • এমসিকিউ বিষয়সমূহ
            </span>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">পাঠ্যবিষয় নির্বাচন করুন</h2>
            <p className="text-xs text-slate-500 mt-0.5">অধ্যায়ভিত্তিক এমসিকিউ ও ব্যাখ্যা দেখতে বিষয়ে ট্যাপ করুন</p>
          </div>

          <div className="space-y-3.5">
            {availableSubjects.map((sub, sIdx) => (
              <React.Fragment key={sub.id}>
                <button
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className="w-full text-left p-4 sm:p-5 rounded-[26px] bg-white transition-all duration-200 flex items-center justify-between group shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100 hover:border-amber-400 hover:shadow-[0_8px_25px_rgba(245,158,11,0.12)] active:scale-[0.99]"
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

                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* লাল দাগ ব্যানার অ্যাড (প্রতিটি বিষয়ের নিচে) */}
                <BannerAd type="red" config={adsConfig?.redBanner} />
              </React.Fragment>
            ))}

            {availableSubjects.length === 0 && (
              <div className="text-center p-8 bg-white/80 rounded-3xl border border-slate-200">
                <p className="text-xs text-slate-500">এই শ্রেণিতে এখনও কোনো এমসিকিউ বিষয় নেই। এডমিন প্যানেল থেকে যোগ করতে পারেন।</p>
              </div>
            )}

            {/* সবুজ দাগ ব্যানার অ্যাড (বিষয় তালিকার নিচে) */}
            <BannerAd type="green" config={adsConfig?.greenBanner} />
          </div>
        </div>
      )}

      {/* ---------------- LEVEL 3: MCQ CHAPTER SELECTION ---------------- */}
      {selectedClassId && selectedSubjectId && !selectedChapterId && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center mb-5">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block mb-1.5 shadow-2xs">
              {currentSubject?.name} • এমসিকিউ অধ্যায়
            </span>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">অধ্যায় বেছে নিন</h2>
            <p className="text-xs text-slate-500 mt-0.5">অধ্যায়ের এমসিকিউ পরীক্ষা শুরু করতে যেকোনো একটিতে ট্যাপ করুন</p>
          </div>

          <div className="space-y-3.5">
            {availableChapters.map((chap, cIdx) => (
              <React.Fragment key={chap.id}>
                <button
                  onClick={() => {
                    setSelectedChapterId(chap.id);
                    handleResetExam();
                  }}
                  className="w-full text-left p-4 sm:p-5 rounded-[26px] bg-white transition-all duration-200 flex items-center justify-between group shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100 hover:border-amber-400 hover:shadow-[0_8px_25px_rgba(245,158,11,0.12)] active:scale-[0.99] cursor-pointer"
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

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {chap.questions?.length || 0}টি প্রশ্ন
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* লাল দাগ ব্যানার অ্যাড (প্রতিটি অধ্যায়ের নিচে) */}
                <BannerAd type="red" config={adsConfig?.redBanner} />
              </React.Fragment>
            ))}

            {availableChapters.length === 0 && (
              <div className="text-center p-8 bg-white/80 rounded-3xl border border-slate-200">
                <p className="text-xs text-slate-500">এই বিষয়ে এখনও কোনো এমসিকিউ অধ্যায় নেই। এডমিন প্যানেল থেকে যোগ করুন।</p>
              </div>
            )}

            {/* সবুজ দাগ ব্যানার অ্যাড (অধ্যায় তালিকার নিচে) */}
            <BannerAd type="green" config={adsConfig?.greenBanner} />
          </div>
        </div>
      )}

      {/* ---------------- LEVEL 4: COMPACT BOARD-STYLE MCQ QUESTION SHEET & TEACHER AUTO EVALUATION ---------------- */}
      {selectedClassId && selectedSubjectId && selectedChapterId && currentChapter && (
        <div className="space-y-3.5 animate-fade-in pb-24">
          {/* পরিচ্ছন্ন শিরোনাম ও রিসেট - অতিরিক্ত কোনো ব্যানার বা লেখা নেই */}
          <div className="flex items-center justify-between px-1 pt-0.5 pb-1">
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                {currentChapter.title}
              </h2>
              <p className="text-[11px] text-slate-500">
                মোট প্রশ্ন: {toBn(totalQuestions)}টি
              </p>
            </div>

            <button
              onClick={handleResetExam}
              className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer shadow-2xs"
              title="উত্তর মুছে নতুন করে শুরু"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট</span>
            </button>
          </div>

          {/* COMPACT QUESTION LIST (Arranged just like the exam sheet in the photo) */}
          <div className="space-y-3">
            {chapterQuestions.map((q, qIdx) => {
              const selectedIdx = userAnswers[q.id];
              const isAnswered = selectedIdx !== undefined;
              const isCorrect = isAnswered && selectedIdx === q.correctIndex;
              const isWrong = isAnswered && selectedIdx !== q.correctIndex;

              // Card styling based on evaluation mode
              let cardBorder = 'border-slate-200 bg-white';
              if (isEvaluated) {
                if (isCorrect) cardBorder = 'border-emerald-300 bg-emerald-50/20 ring-1 ring-emerald-200';
                else if (isWrong) cardBorder = 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200';
                else cardBorder = 'border-amber-200 bg-amber-50/10';
              }

              return (
                <React.Fragment key={q.id}>
                  <div 
                    className={`rounded-2xl p-3 sm:p-4 border shadow-2xs transition-all space-y-2.5 ${cardBorder}`}
                  >
                    {/* Question Header & Title */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        {/* Bengali Question Number */}
                        <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-900 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {toBn(qIdx + 1)}
                        </span>

                        {/* Question Text */}
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug whitespace-pre-line flex-1">
                          {q.question}
                        </h3>
                      </div>

                      {/* Status Badge in Evaluation Mode */}
                      {isEvaluated && (
                        <div className="shrink-0">
                          {isCorrect && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>সঠিক (+১)</span>
                            </span>
                          )}
                          {isWrong && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>ভুল (০)</span>
                            </span>
                          )}
                          {!isAnswered && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                              উত্তরহীন
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 4 Options Grid: Compact, 2 Columns (ক, খ, গ, ঘ) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-0 sm:pl-8">
                      {q.options.map((opt, optIdx) => {
                        const isOptionSelected = selectedIdx === optIdx;
                        const isThisCorrect = optIdx === q.correctIndex;
                        const optionLabels = ['ক', 'খ', 'গ', 'ঘ'];

                        let optStyle = 'border-slate-200 bg-slate-50/80 hover:bg-purple-50/50 hover:border-purple-300 text-slate-800';

                        if (!isEvaluated) {
                          if (isOptionSelected) {
                            optStyle = 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-2xs ring-1 ring-purple-400';
                          }
                        } else {
                          // After evaluation mode:
                          if (isThisCorrect) {
                            optStyle = 'border-emerald-600 bg-emerald-100/90 text-emerald-950 font-black shadow-xs ring-2 ring-emerald-400';
                          } else if (isOptionSelected && !isThisCorrect) {
                            optStyle = 'border-rose-500 bg-rose-100/80 text-rose-950 font-bold line-through opacity-90';
                          } else {
                            optStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isEvaluated}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 active:scale-98 cursor-pointer ${optStyle}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                isEvaluated && isThisCorrect 
                                  ? 'bg-emerald-600 text-white' 
                                  : isOptionSelected 
                                    ? (isEvaluated && !isThisCorrect ? 'bg-rose-600 text-white' : 'bg-purple-600 text-white')
                                    : 'bg-white text-slate-600 border border-slate-300'
                              }`}>
                                {optionLabels[optIdx]}
                              </span>
                              <span className="truncate">{opt}</span>
                            </div>

                            {/* Evaluation Icon Marker */}
                            {isEvaluated && (
                              <div className="shrink-0">
                                {isThisCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[2.5]" />}
                                {isOptionSelected && !isThisCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                  </div>

                  {/* লাল ব্যানার অ্যাড প্রতি ২টি প্রশ্নের পর */}
                  {(qIdx + 1) % 2 === 0 && (
                    <BannerAd type="red" config={adsConfig?.redBanner} />
                  )}
                </React.Fragment>
              );
            })}

            {chapterQuestions.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                এই অধ্যায়ে এখনও কোনো প্রশ্ন যোগ করা হয়নি। এডমিন প্যানেল থেকে যোগ করুন।
              </div>
            )}
          </div>

          {/* লাল দাগ ব্যানার অ্যাড (ফলাফল বাটনের ঠিক উপরে) */}
          <BannerAd type="red" config={adsConfig?.redBanner} />

          {/* সবকটা নৈর্ব্যক্তিক শেষে ফলাফল দেখুন বাটন ও ফলাফল কার্ড */}
          {chapterQuestions.length > 0 && (
            <div className="pt-2 pb-4 space-y-3">
              {!isEvaluated ? (
                <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">উত্তর সম্পন্ন:</span>
                    <span className="font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {toBn(answeredCount)} / {toBn(totalQuestions)}
                    </span>
                  </div>

                  <button
                    onClick={handleEvaluate}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold text-sm rounded-xl shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                  >
                    <Award className="w-5 h-5 text-amber-300" />
                    <span>ফলাফল দেখুন</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">পরীক্ষার ফলাফল</span>
                      <span className="text-base font-black text-slate-800">
                        স্কোর: {toBn(correctCount)} / {toBn(totalQuestions)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
                        সঠিক: {toBn(correctCount)} | ভুল: {toBn(wrongCount)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleResetExam}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-xl shadow-md shadow-amber-500/30 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>পুনরায় পরীক্ষা দিন</span>
                  </button>
                </div>
              )}

              {/* সবুজ দাগ ব্যানার অ্যাড (পরীক্ষা পেজের একদম নিচে) */}
              <BannerAd type="green" config={adsConfig?.greenBanner} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
