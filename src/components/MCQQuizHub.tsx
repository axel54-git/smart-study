import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  Calculator, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  BookOpen, 
  HelpCircle,
  Trophy,
  BrainCircuit
} from 'lucide-react';

interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  needsCalc?: boolean;
}

const MCQ_DATABASE: Record<string, Question[]> = {
  physics: [
    {
      id: 1,
      subject: 'পদার্থবিজ্ঞান',
      question: 'একটি বস্তুর উপর 10 N বল প্রয়োগ করায় বস্তুটি বলের দিকে 5 m সরে গেল। কৃতকাজ (Work) কত?',
      options: ['50 J', '2 J', '15 J', '0.5 J'],
      correctIndex: 0,
      explanation: 'আমরা জানি, কাজ W = F × s = 10 N × 5 m = 50 Joule (জুল)।',
      needsCalc: true
    },
    {
      id: 2,
      subject: 'পদার্থবিজ্ঞান',
      question: 'অভিকর্ষজ ত্বরণ g = 9.8 m/s² হলে 2.5 kg ভরের বস্তুর ওজন কত?',
      options: ['24.5 N', '19.6 N', '4.9 N', '12.25 N'],
      correctIndex: 0,
      explanation: 'ওজন W = m × g = 2.5 kg × 9.8 m/s² = 24.5 N।',
      needsCalc: true
    },
    {
      id: 3,
      subject: 'পদার্থবিজ্ঞান',
      question: 'আলোর গতিবেগ শূন্য মাধ্যমে প্রায় কত?',
      options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
      correctIndex: 0,
      explanation: 'শূন্য মাধ্যমে আলোর গতিবেগ c = 2.9979 × 10⁸ m/s ≈ 3 × 10⁸ m/s।'
    }
  ],
  math: [
    {
      id: 4,
      subject: 'উচ্চতর গণিত',
      question: 'sin(30°) + cos(60°) এর মান কত?',
      options: ['1', '0.5', '0', '√3/2'],
      correctIndex: 0,
      explanation: 'sin(30°) = 1/2 এবং cos(60°) = 1/2। অতএব 1/2 + 1/2 = 1।',
      needsCalc: true
    },
    {
      id: 5,
      subject: 'উচ্চতর গণিত',
      question: 'log₁₀(1000) এর মান কত?',
      options: ['3', '2', '10', '100'],
      correctIndex: 0,
      explanation: '1000 = 10³। সুতরাং log₁₀(10³) = 3 log₁₀(10) = 3 × 1 = 3।',
      needsCalc: true
    },
    {
      id: 6,
      subject: 'উচ্চতর গণিত',
      question: 'সমকোণী ত্রিভুজের অতিভুজ 5 এবং ভূমি 4 হলে লম্ব কত?',
      options: ['3', '4', '2', '1'],
      correctIndex: 0,
      explanation: 'পিথাগোরাসের উপপাদ্য: লম্ব = √(5² - 4²) = √(25 - 16) = √9 = 3।'
    }
  ],
  ict: [
    {
      id: 7,
      subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
      question: 'বাইনারি সংখ্যা 1010 এর সমতুল্য ডেসিমেল (দশমিক) মান কত?',
      options: ['10', '8', '12', '14'],
      correctIndex: 0,
      explanation: '1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 0 + 2 + 0 = 10।',
      needsCalc: true
    },
    {
      id: 8,
      subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
      question: 'HTML-এ সবচেয়ে বড় হেডিং ট্যাগ কোনটি?',
      options: ['<h1>', '<h6>', '<head>', '<header>'],
      correctIndex: 0,
      explanation: 'HTML-এ h1 সবচেয়ে বড় এবং h6 সবচেয়ে ছোট হেডিং প্রদর্শনে ব্যবহৃত হয়।'
    }
  ]
};

interface MCQQuizHubProps {
  onOpenCalculator: () => void;
  onOpenAI: () => void;
}

export const MCQQuizHub: React.FC<MCQQuizHubProps> = ({ onOpenCalculator, onOpenAI }) => {
  const [selectedSubject, setSelectedSubject] = useState<'physics' | 'math' | 'ict'>('physics');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const questions = MCQ_DATABASE[selectedSubject];
  const currentQuestion = questions[currentIndex % questions.length];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(idx);
    setAnsweredCount(prev => prev + 1);
    if (idx === currentQuestion.correctIndex) {
      setScore(prev => prev + 10);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setCurrentIndex(prev => (prev + 1) % questions.length);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setCurrentIndex(0);
    setScore(0);
    setAnsweredCount(0);
  };

  return (
    <div className="space-y-4 animate-fade-in py-2 pb-6">
      {/* Header Banner */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300 shadow-2xs mb-1.5">
          <BrainCircuit className="w-3.5 h-3.5 text-amber-600" />
          <span>দৈনিক এমসিকিউ প্র্যাকটিস ও কুইজ টেস্ট</span>
        </div>
        <h2 className="text-xl font-black text-slate-800">স্মার্টস্টাডি এমসিকিউ হাব</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          বোর্ড পরীক্ষার কমন উপযোগী এমসিকিউ সমাধান করুন ও মেধা যাচাই করুন
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-2xs">
        <button
          onClick={() => {
            setSelectedSubject('physics');
            handleReset();
          }}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
            selectedSubject === 'physics'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          পদার্থবিজ্ঞান
        </button>
        <button
          onClick={() => {
            setSelectedSubject('math');
            handleReset();
          }}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
            selectedSubject === 'math'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          উচ্চতর গণিত
        </button>
        <button
          onClick={() => {
            setSelectedSubject('ict');
            handleReset();
          }}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
            selectedSubject === 'ict'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          আইসিটি
        </button>
      </div>

      {/* Interactive Question Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-md relative overflow-hidden">
        {/* Top Status Bar: Question Number + Live Score + Calculator Quick Link */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-600">
            <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-black">
              {currentIndex + 1}
            </span>
            <span>প্রশ্ন {currentIndex + 1} / {questions.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg font-bold text-[11px] border border-emerald-200">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              <span>স্কোর: {score}</span>
            </div>

            {/* Mobile Calculator Quick Icon */}
            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-2xs transition-all active:scale-95"
              title="fx-570MS সাইন্টিফিক ক্যালকুলেটর"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>ক্যালকুলেটর</span>
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded inline-block mb-1.5">
            {currentQuestion.subject}
          </span>
          <h3 className="text-base font-extrabold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-2 mb-4">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctIndex;
            const showFeedback = selectedOption !== null;

            let btnStyle = 'border-slate-200 bg-white hover:border-amber-400 text-slate-800';
            if (showFeedback) {
              if (isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
              } else if (isSelected) {
                btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
              } else {
                btnStyle = 'border-slate-100 bg-slate-50/60 text-slate-400 opacity-70';
              }
            }

            const optionLabels = ['ক', 'খ', 'গ', 'ঘ'];

            return (
              <button
                key={idx}
                disabled={showFeedback}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-3 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between text-xs sm:text-sm ${btnStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-100 font-bold text-xs flex items-center justify-center shrink-0 text-slate-700">
                    {optionLabels[idx]}
                  </span>
                  <span>{opt}</span>
                </div>

                {showFeedback && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Box (Visible after answering) */}
        {selectedOption !== null && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-4 animate-fade-in text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={`font-bold flex items-center gap-1 ${
                selectedOption === currentQuestion.correctIndex ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                {selectedOption === currentQuestion.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>সঠিক উত্তর হয়েছে! (+১০ পয়েন্ট)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>ভুল উত্তর! সঠিক উত্তর নিচে দেখুন:</span>
                  </>
                )}
              </span>

              {currentQuestion.needsCalc && (
                <button
                  onClick={onOpenCalculator}
                  className="text-[11px] text-amber-700 underline font-bold flex items-center gap-1"
                >
                  <Calculator className="w-3 h-3" />
                  ক্যালকুলেটরে যাচাই করুন
                </button>
              )}
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>ব্যাখ্যা:</strong> {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Bottom Actions: Next / Reset */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>রিসেট</span>
          </button>

          {selectedOption !== null ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <span>পরবর্তী প্রশ্ন</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 italic">
              যেকোনো একটি অপশন নির্বাচন করুন
            </span>
          )}
        </div>
      </div>

      {/* Mega Scholarship Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full inline-block">
            মেগা স্কলারশিপ টেস্ট ২০২৬
          </span>
          <Award className="w-5 h-5 text-yellow-200" />
        </div>

        <h3 className="text-base font-black leading-snug">
          এইচএসসি ও এসএসসি মেগা স্কলারশিপ টেস্ট ২০২৬
        </h3>
        <p className="text-xs text-amber-100 leading-relaxed">
          ১০০ জন কৃতী শিক্ষার্থীর জন্য নগদ শিক্ষাবৃত্তি, ট্যাবলেট ও জাতীয় ডিজিটাল সার্টিফিকেট। নিয়মিত এমসিকিউ প্র্যাকটিসে স্কলারশিপ স্কোরে এগিয়ে থাকুন!
        </p>

        <button
          onClick={onOpenAI}
          className="w-full py-2.5 bg-white hover:bg-amber-50 text-amber-900 text-xs font-black rounded-xl shadow-sm transition-all active:scale-[0.98]"
        >
          স্মার্টস্টাডি এআই অ্যাসিস্ট্যান্ট থেকে বিস্তারিত জানুন
        </button>
      </div>
    </div>
  );
};
