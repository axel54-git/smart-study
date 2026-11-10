import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  X, 
  Calendar, 
  Clock, 
  BookOpen, 
  CheckSquare, 
  ListTodo, 
  Bell, 
  Sparkles, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  ChevronRight,
  FlaskConical,
  Binary,
  Layers,
  ArrowRightLeft,
  Lock,
  FileQuestion,
  Target,
  GraduationCap,
  Copy
} from 'lucide-react';
import { BannerAd } from './BannerAd';
import { PWAInstallButton } from './PWAInstallButton';
import { AdsSystemConfig } from '../data/adsConfig';
import { BOARD_CQ_DATA } from '../data/boardCQData';

interface StudentToolsProfileProps {
  onOpenCalculator: () => void;
  onOpenAdmin: () => void;
  adsConfig?: AdsSystemConfig;
}

type ActiveModal = 
  | null
  | 'boardCQ'
  | 'studyPlanner'
  | 'ageCalc'
  | 'gpaCalc'
  | 'converter'
  | 'numberConverter'
  | 'formulas'
  | 'notebook'
  | 'todoList'
  | 'reminder'
  | 'routine'
  | 'pomodoro'
  | 'checklist';

export const StudentToolsProfile: React.FC<StudentToolsProfileProps> = ({ 
  onOpenCalculator, 
  onOpenAdmin,
  adsConfig
}) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // ---------------- AGE CALCULATOR STATE ----------------
  const [birthDate, setBirthDate] = useState('2007-01-01');
  const [ageResult, setAgeResult] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculateAge = (dateStr: string) => {
    if (!dateStr) return;
    const birth = new Date(dateStr);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    setAgeResult({ years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) });
  };

  useEffect(() => {
    calculateAge(birthDate);
  }, [birthDate]);

  // ---------------- GPA CALCULATOR STATE ----------------
  const [gpaSubjects, setGpaSubjects] = useState([
    { name: 'বাংলা', grade: 5 },
    { name: 'ইংরেজি', grade: 5 },
    { name: 'গণিত', grade: 5 },
    { name: 'আইসিটি', grade: 5 },
    { name: 'পদার্থ / বিজ্ঞান', grade: 4 },
  ]);

  const gradeOptions = [
    { label: 'A+ (5.0)', point: 5.0 },
    { label: 'A (4.0)', point: 4.0 },
    { label: 'A- (3.5)', point: 3.5 },
    { label: 'B (3.0)', point: 3.0 },
    { label: 'C (2.0)', point: 2.0 },
    { label: 'D (1.0)', point: 1.0 },
    { label: 'F (0.0)', point: 0.0 },
  ];

  const calculatedGPA = (
    gpaSubjects.reduce((acc, s) => acc + s.grade, 0) / (gpaSubjects.length || 1)
  ).toFixed(2);

  // ---------------- NUMBER CONVERTER STATE ----------------
  const [decInput, setDecInput] = useState('255');
  const [binVal, setBinVal] = useState('11111111');
  const [hexVal, setHexVal] = useState('FF');
  const [octVal, setOctVal] = useState('377');

  const handleDecChange = (val: string) => {
    setDecInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setBinVal(num.toString(2));
      setHexVal(num.toString(16).toUpperCase());
      setOctVal(num.toString(8));
    } else {
      setBinVal('');
      setHexVal('');
      setOctVal('');
    }
  };

  // ---------------- UNIT CONVERTER STATE ----------------
  const [unitCategory, setUnitCategory] = useState<'length' | 'weight' | 'temp'>('length');
  const [inputVal, setInputVal] = useState('1');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');

  const convertUnits = () => {
    const val = parseFloat(inputVal) || 0;
    if (unitCategory === 'length') {
      let meters = val;
      if (fromUnit === 'kilometer') meters = val * 1000;
      if (fromUnit === 'mile') meters = val * 1609.34;
      if (fromUnit === 'feet') meters = val * 0.3048;

      if (toUnit === 'meter') return meters.toFixed(3);
      if (toUnit === 'kilometer') return (meters / 1000).toFixed(4);
      if (toUnit === 'mile') return (meters / 1609.34).toFixed(4);
      if (toUnit === 'feet') return (meters / 0.3048).toFixed(2);
    }
    if (unitCategory === 'weight') {
      let kg = val;
      if (fromUnit === 'gram') kg = val / 1000;
      if (fromUnit === 'pound') kg = val * 0.453592;

      if (toUnit === 'kg') return kg.toFixed(3);
      if (toUnit === 'gram') return (kg * 1000).toFixed(1);
      if (toUnit === 'pound') return (kg / 0.453592).toFixed(3);
    }
    return val.toString();
  };

  // ---------------- POMODORO TIMER STATE ----------------
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [pomoActive, setPomoActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (pomoActive && pomoSeconds > 0) {
      interval = setInterval(() => {
        setPomoSeconds(sec => sec - 1);
      }, 1000);
    } else if (pomoSeconds === 0) {
      setPomoActive(false);
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoSeconds]);

  const formatPomoTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ---------------- NOTEBOOK STATE (LOCALSTORAGE) ----------------
  const [notes, setNotes] = useState<string[]>(() => {
    const saved = localStorage.getItem('smartstudy_student_notes');
    return saved ? JSON.parse(saved) : [
      'এইচএসসি আইসিটি ৩য় অধ্যায়ের ২ এর পরিপূরক রিভিশন দিতে হবে।',
      'উচ্চতর গণিত ম্যাট্রিক্সের বিপরীত ম্যাট্রিক্স নির্ণয় অনুশীলন।'
    ];
  });
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const updated = [newNote.trim(), ...notes];
    setNotes(updated);
    localStorage.setItem('smartstudy_student_notes', JSON.stringify(updated));
    setNewNote('');
  };

  const handleDeleteNote = (idx: number) => {
    const updated = notes.filter((_, i) => i !== idx);
    setNotes(updated);
    localStorage.setItem('smartstudy_student_notes', JSON.stringify(updated));
  };

  // ---------------- TO-DO LIST STATE (LOCALSTORAGE) ----------------
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean }[]>(() => {
    const saved = localStorage.getItem('smartstudy_student_todos');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'বাংলা ১ম পত্র অপরিচিতা গল্পের এমসিকিউ পরীক্ষা', done: true },
      { id: '2', text: 'পদার্থবিজ্ঞান ৩য় অধ্যায় লেকচার ক্লাস দেখা', done: false },
      { id: '3', text: 'fx-570MS দিয়ে দ্বিঘাত সমীকরণ সমাধান প্র্যাকটিস', done: false },
    ];
  });
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    const updated = [...todos, { id: Date.now().toString(), text: newTodo.trim(), done: false }];
    setTodos(updated);
    localStorage.setItem('smartstudy_student_todos', JSON.stringify(updated));
    setNewTodo('');
  };

  const handleToggleTodo = (id: string) => {
    const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTodos(updated);
    localStorage.setItem('smartstudy_student_todos', JSON.stringify(updated));
  };

  // ---------------- CHECKLIST STATE ----------------
  const [checkItems, setCheckItems] = useState([
    { id: 'c1', label: 'এডমিট কার্ড ও রেজিস্ট্রেশন কার্ড', checked: true },
    { id: 'c2', label: 'fx-570MS সাইন্টিফিক ক্যালকুলেটর ব্যাটারি চেক', checked: true },
    { id: 'c3', label: 'কালো কালির বলপয়েন্ট কলম ও পেন্সিল', checked: false },
    { id: 'c4', label: 'জ্যামিতি বক্স ও স্কেল', checked: true },
    { id: 'c5', label: 'বোর্ড এমসিকিউ রিভিশন শিট', checked: false },
  ]);

  // ---------------- BOARD CQ STATE ----------------
  const [cqLevelFilter, setCqLevelFilter] = useState<'ALL' | 'SSC' | 'HSC'>('ALL');
  const [cqSubjectFilter, setCqSubjectFilter] = useState<string>('ALL');
  const [cqExpandedId, setCqExpandedId] = useState<string | null>(null);
  const [copiedCqId, setCopiedCqId] = useState<string | null>(null);

  const handleCopyCQ = (item: any) => {
    const text = `[Board CQ: ${item.subject} (${item.level}) - ${item.board} ${item.year}]\n${item.chapter}\n\nউদ্দীপক:\n${item.stem}\n\nক. ${item.questions.a}\nখ. ${item.questions.b}\nগ. ${item.questions.c}\nঘ. ${item.questions.d}\n\n[সমাধান / উত্তর]:\nক. ${item.answers.a}\n\nখ. ${item.answers.b}\n\nগ. ${item.answers.c}\n\nঘ. ${item.answers.d}`;
    navigator.clipboard.writeText(text);
    setCopiedCqId(item.id);
    setTimeout(() => setCopiedCqId(null), 2000);
  };

  // ---------------- STUDY PLANNER STATE ----------------
  const [targetHours, setTargetHours] = useState(() => {
    return localStorage.getItem('smartstudy_target_hours') || '4';
  });
  const [plannerTasks, setPlannerTasks] = useState<{ id: string; subject: string; target: string; done: boolean }[]>(() => {
    const saved = localStorage.getItem('smartstudy_planner_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', subject: 'Board CQ', target: 'HSC ICT Chapter 5 (2 Questions)', done: true },
      { id: 'p2', subject: 'Math', target: 'Trigonometry & Calculus formulas', done: false },
      { id: 'p3', subject: 'Bangla', target: 'Aparichita CQ Question practice', done: false },
    ];
  });
  const [newPlannerSubject, setNewPlannerSubject] = useState('ICT');
  const [newPlannerTarget, setNewPlannerTarget] = useState('');

  const handleAddPlannerTask = () => {
    if (!newPlannerTarget.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      subject: newPlannerSubject.trim() || 'General',
      target: newPlannerTarget.trim(),
      done: false
    };
    const updated = [...plannerTasks, newTask];
    setPlannerTasks(updated);
    localStorage.setItem('smartstudy_planner_tasks', JSON.stringify(updated));
    setNewPlannerTarget('');
  };

  const handleTogglePlannerTask = (id: string) => {
    const updated = plannerTasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setPlannerTasks(updated);
    localStorage.setItem('smartstudy_planner_tasks', JSON.stringify(updated));
  };

  const handleDeletePlannerTask = (id: string) => {
    const updated = plannerTasks.filter(t => t.id !== id);
    setPlannerTasks(updated);
    localStorage.setItem('smartstudy_planner_tasks', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4 animate-fade-in py-1">
      {/* PWA App Install Banner Card */}
      <PWAInstallButton variant="card" />

      {/* ---------------- 1. ACADEMIC & STUDY TOOLS GRID (3x2) ---------------- */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* 1. Scientific Calculator (Casio fx-570MS) */}
        <button
          onClick={onOpenCalculator}
          className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-amber-200/80 hover:border-amber-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100/90 border border-amber-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5 text-amber-700 stroke-[2.2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            Calculator
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-bold text-amber-600 mt-0.5 truncate max-w-full px-0.5 leading-none">
            fx-570MS
          </span>
        </button>

        {/* 3. Unit Converter */}
        <button
          onClick={() => setActiveModal('converter')}
          className="bg-gradient-to-br from-teal-50/90 via-emerald-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-teal-200/80 hover:border-teal-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-100/90 border border-teal-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <ArrowRightLeft className="w-5 h-5 text-teal-700 stroke-[2.2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            Converter
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-medium text-teal-600/90 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Unit Converter
          </span>
        </button>

        {/* 4. Age Calculator */}
        <button
          onClick={() => setActiveModal('ageCalc')}
          className="bg-gradient-to-br from-orange-50/90 via-amber-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-orange-200/80 hover:border-orange-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-100/90 border border-orange-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform relative">
            <Calendar className="w-5 h-5 text-orange-700 stroke-[2.2]" />
            <span className="absolute bottom-1.5 text-[7px] font-black text-orange-900 leading-none">25</span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            Age Calc
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-medium text-orange-600/90 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Age & Birth Date
          </span>
        </button>

        {/* 5. Formulas */}
        <button
          onClick={() => setActiveModal('formulas')}
          className="bg-gradient-to-br from-purple-50/90 via-fuchsia-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-purple-200/80 hover:border-purple-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100/90 border border-purple-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <FlaskConical className="w-5 h-5 text-purple-700 stroke-[2.2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            Formulas
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-medium text-purple-600/90 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Math & Physics
          </span>
        </button>

        {/* 6. GPA Calculator */}
        <button
          onClick={() => setActiveModal('gpaCalc')}
          className="bg-gradient-to-br from-yellow-50/90 via-amber-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-amber-200/80 hover:border-amber-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-yellow-100/90 border border-amber-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <span className="font-mono text-xs font-black text-amber-800">GPA</span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            GPA Calculator
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-medium text-amber-700/90 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Grade Point
          </span>
        </button>

        {/* 7. Number Converter */}
        <button
          onClick={() => setActiveModal('numberConverter')}
          className="bg-gradient-to-br from-sky-50/90 via-cyan-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-sky-200/80 hover:border-sky-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-100/90 border border-sky-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <Binary className="w-5 h-5 text-sky-700 stroke-[2.2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            Number Base
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-medium text-sky-600/90 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Binary & Hex
          </span>
        </button>

        {/* 8. Study Planner (New addition in menu) */}
        <button
          onClick={() => setActiveModal('studyPlanner')}
          className="bg-gradient-to-br from-violet-50/90 via-indigo-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-violet-200/80 hover:border-violet-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-100/90 border border-violet-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <Target className="w-5 h-5 text-violet-700 stroke-[2.2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            Study Planner
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-medium text-violet-600/90 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Target & Hours
          </span>
        </button>

        {/* 9. Study Notebook */}
        <button
          onClick={() => setActiveModal('notebook')}
          className="bg-gradient-to-br from-rose-50/90 via-pink-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-rose-200/80 hover:border-rose-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-100/90 border border-rose-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-rose-700 stroke-[2.2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            Study Notes
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-medium text-rose-600/90 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Quick Notes
          </span>
        </button>
      </div>

      {/* লাল দাগ ব্যানার অ্যাড (টুলস গ্রিডের মাঝে) */}
      <BannerAd type="red" config={adsConfig?.redBanner} />

      {/* ---------------- 2. SECTION TITLE: Personal & Productivity (সব ইংরেজিতে) ---------------- */}
      <div className="flex items-center gap-2 pt-1 px-1">
        <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
          <Layers className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight">
          Personal & Productivity
        </h3>
      </div>

      {/* ---------------- 3. PERSONAL TOOLS GRID (3x2) ---------------- */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* 10. To-Do List */}
        <button
          onClick={() => setActiveModal('todoList')}
          className="bg-gradient-to-br from-cyan-50/90 via-sky-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-cyan-200/80 hover:border-cyan-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-100/90 border border-cyan-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <ListTodo className="w-5 h-5 text-cyan-700 stroke-[2.2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            To-Do List
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-medium text-cyan-600/90 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Daily Tasks
          </span>
        </button>

        {/* 11. Reminder */}
        <button
          onClick={() => setActiveModal('reminder')}
          className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-emerald-200/80 hover:border-emerald-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100/90 border border-emerald-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <Bell className="w-5 h-5 text-emerald-700 stroke-[2.2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            Reminder
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-medium text-emerald-600/90 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Exam & Alerts
          </span>
        </button>

        {/* 12. Class Routine */}
        <button
          onClick={() => setActiveModal('routine')}
          className="bg-gradient-to-br from-indigo-50/90 via-blue-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-indigo-200/80 hover:border-indigo-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-100/90 border border-indigo-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5 text-indigo-700 stroke-[2.2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            Routine
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-medium text-indigo-600/90 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Weekly Schedule
          </span>
        </button>

        {/* 13. Pomodoro Focus Timer */}
        <button
          onClick={() => setActiveModal('pomodoro')}
          className="bg-gradient-to-br from-rose-50/90 via-red-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-rose-200/80 hover:border-rose-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-100/90 border border-rose-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <span className="text-rose-700 font-mono font-black text-xs">25m</span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            Pomodoro
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-medium text-rose-600/90 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Focus Timer
          </span>
        </button>

        {/* 14. Exam Checklist */}
        <button
          onClick={() => setActiveModal('checklist')}
          className="bg-gradient-to-br from-lime-50/90 via-emerald-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-lime-200/80 hover:border-lime-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-lime-100/90 border border-lime-200/70 flex items-center justify-center mb-1 shadow-2xs group-hover:scale-105 transition-transform">
            <CheckSquare className="w-5 h-5 text-lime-700 stroke-[2.2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            Checklist
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-medium text-lime-700/90 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Exam Kit Check
          </span>
        </button>

        {/* 15. Admin Panel */}
        <button
          onClick={onOpenAdmin}
          className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-2xs border border-amber-300 hover:border-amber-400 hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-75 cursor-pointer min-h-[84px] sm:min-h-[88px] group touch-manipulation"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-1 shadow-xs shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Lock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            Admin Panel
          </span>
          <span className="text-[8.5px] sm:text-[9px] font-bold text-amber-700 mt-0.5 truncate max-w-full px-0.5 leading-none">
            Secured Access
          </span>
        </button>
      </div>

      {/* সবুজ দাগ ব্যানার অ্যাড (প্রোফাইল পেজের একদম নিচে) */}
      <BannerAd type="green" config={adsConfig?.greenBanner} />

      {/* ---------------- INTERACTIVE MODALS FOR TOOLS ---------------- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className={`w-full ${activeModal === 'boardCQ' ? 'max-w-md' : 'max-w-sm'} bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-100 max-h-[88vh] overflow-y-auto relative`}>
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 1. BOARD CQ (সৃজনশীল প্রশ্ন ব্যাংক) MODAL */}
            {activeModal === 'boardCQ' && (
              <div className="space-y-3.5">
                <div className="text-center pt-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Board CQ Question Bank</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">বোর্ড সৃজনশীল প্রশ্ন (CQ)</h3>
                  <p className="text-xs text-slate-500">SSC ও HSC বিগত বছরের বোর্ড পরীক্ষা প্রশ্ন ও মডেল সমাধান</p>
                </div>

                {/* Level Filter Pills: ALL / SSC / HSC */}
                <div className="flex gap-1.5 justify-center">
                  {(['ALL', 'SSC', 'HSC'] as const).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setCqLevelFilter(lvl)}
                      className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        cqLevelFilter === lvl
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {lvl === 'ALL' ? 'সকল শ্রেণি' : lvl === 'SSC' ? 'SSC (৯ম-১০ম)' : 'HSC (১১শ-১২শ)'}
                    </button>
                  ))}
                </div>

                {/* Subject Filter Pills */}
                <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] font-bold no-scrollbar">
                  {['ALL', 'ICT', 'বাংলা', 'গণিত', 'পদার্থ', 'রসায়ন'].map(sub => (
                    <button
                      key={sub}
                      onClick={() => setCqSubjectFilter(sub)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer ${
                        cqSubjectFilter === sub
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sub === 'ALL' ? 'সকল বিষয়' : sub}
                    </button>
                  ))}
                </div>

                {/* CQ List */}
                <div className="space-y-3 max-h-[62vh] overflow-y-auto pr-1">
                  {BOARD_CQ_DATA
                    .filter(item => cqLevelFilter === 'ALL' || item.level === cqLevelFilter)
                    .filter(item => {
                      if (cqSubjectFilter === 'ALL') return true;
                      return item.subject.toLowerCase().includes(cqSubjectFilter.toLowerCase());
                    })
                    .map(item => {
                      const isExpanded = cqExpandedId === item.id;
                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-indigo-100 p-3 shadow-2xs space-y-2 transition-all hover:border-indigo-300"
                        >
                          {/* Header Badge */}
                          <div className="flex items-center justify-between text-[11px] gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-100 font-bold text-indigo-800 text-[10px]">
                                {item.level}
                              </span>
                              <span className="font-bold text-slate-800">{item.subject}</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-amber-700 font-semibold">{item.board} {item.year}</span>
                            </div>
                            <button
                              onClick={() => handleCopyCQ(item)}
                              className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 shrink-0 p-1 rounded-md hover:bg-indigo-50 cursor-pointer"
                              title="কপি করুন"
                            >
                              {copiedCqId === item.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <p className="text-[11px] font-bold text-indigo-900">{item.chapter}</p>

                          {/* Stem / উদ্দীপক */}
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-serif">
                            <span className="font-sans font-bold text-slate-900 block mb-1">উদ্দীপক:</span>
                            {item.stem}
                          </div>

                          {/* Questions ক, খ, গ, ঘ */}
                          <div className="space-y-1 text-xs">
                            <div className="p-1.5 rounded-lg bg-indigo-50/50 text-slate-800">
                              <span className="font-bold text-indigo-700 mr-1.5">ক.</span> {item.questions.a} <span className="text-[10px] text-slate-400 font-mono">(১)</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-indigo-50/50 text-slate-800">
                              <span className="font-bold text-indigo-700 mr-1.5">খ.</span> {item.questions.b} <span className="text-[10px] text-slate-400 font-mono">(২)</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-indigo-50/50 text-slate-800">
                              <span className="font-bold text-indigo-700 mr-1.5">গ.</span> {item.questions.c} <span className="text-[10px] text-slate-400 font-mono">(৩)</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-indigo-50/50 text-slate-800">
                              <span className="font-bold text-indigo-700 mr-1.5">ঘ.</span> {item.questions.d} <span className="text-[10px] text-slate-400 font-mono">(৪)</span>
                            </div>
                          </div>

                          {/* Toggle Solution */}
                          <button
                            onClick={() => setCqExpandedId(isExpanded ? null : item.id)}
                            className="w-full py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>{isExpanded ? 'সমাধান লুকিয়ে রাখুন' : 'উত্তর ও সমাধান দেখুন'}</span>
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>

                          {/* Solution Box */}
                          {isExpanded && (
                            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2.5 animate-fade-in">
                              <span className="font-bold text-emerald-900 block border-b border-emerald-200 pb-1">
                                ✓ মডেল সমাধান ও ব্যাখ্যা:
                              </span>
                              <div>
                                <span className="font-bold text-emerald-800">ক-এর উত্তর:</span>
                                <p className="text-slate-800 mt-0.5 whitespace-pre-wrap">{item.answers.a}</p>
                              </div>
                              <div>
                                <span className="font-bold text-emerald-800">খ-এর উত্তর:</span>
                                <p className="text-slate-800 mt-0.5 whitespace-pre-wrap">{item.answers.b}</p>
                              </div>
                              <div>
                                <span className="font-bold text-emerald-800">গ-এর উত্তর:</span>
                                <div className="text-slate-800 mt-0.5 whitespace-pre-wrap font-sans bg-white/80 p-2 rounded-lg border border-emerald-100">
                                  {item.answers.c}
                                </div>
                              </div>
                              <div>
                                <span className="font-bold text-emerald-800">ঘ-এর উত্তর:</span>
                                <div className="text-slate-800 mt-0.5 whitespace-pre-wrap font-sans bg-white/80 p-2 rounded-lg border border-emerald-100">
                                  {item.answers.d}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 2. STUDY PLANNER MODAL */}
            {activeModal === 'studyPlanner' && (
              <div className="space-y-4">
                <div className="text-center pt-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold mb-1">
                    <Target className="w-3.5 h-3.5" />
                    <span>Daily Study Planner</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">দৈনিক স্টাডি প্ল্যানার</h3>
                  <p className="text-xs text-slate-500">প্রতিদিনের পড়ার টার্গেট ও সম্পন্নতার ট্র্যাকিং</p>
                </div>

                {/* Daily Target Hours */}
                <div className="p-3 bg-violet-50/70 border border-violet-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-violet-900 block">আজকের পড়ার লক্ষ্যমাত্রা</span>
                    <span className="text-[10px] text-violet-700">ডেইলি স্টাডি টাইম</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      max="16"
                      value={targetHours}
                      onChange={e => {
                        setTargetHours(e.target.value);
                        localStorage.setItem('smartstudy_target_hours', e.target.value);
                      }}
                      className="w-14 p-1.5 text-center text-sm font-black font-mono bg-white border border-violet-300 rounded-xl"
                    />
                    <span className="text-xs font-bold text-violet-900">ঘণ্টা</span>
                  </div>
                </div>

                {/* Add Planner Goal */}
                <div className="space-y-2">
                  <div className="flex gap-1.5">
                    <select
                      value={newPlannerSubject}
                      onChange={e => setNewPlannerSubject(e.target.value)}
                      className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-violet-800"
                    >
                      <option value="Board CQ">Board CQ</option>
                      <option value="ICT">ICT</option>
                      <option value="Math">Math</option>
                      <option value="Bangla">Bangla</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="English">English</option>
                    </select>
                    <input
                      type="text"
                      value={newPlannerTarget}
                      onChange={e => setNewPlannerTarget(e.target.value)}
                      placeholder="আজ কী পড়বেন লিখুন..."
                      className="flex-1 p-2 rounded-xl border border-slate-200 text-xs"
                      onKeyDown={e => e.key === 'Enter' && handleAddPlannerTask()}
                    />
                    <button
                      onClick={handleAddPlannerTask}
                      className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Planner List */}
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {plannerTasks.map(t => (
                    <div
                      key={t.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all ${
                        t.done ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white border-violet-100 text-slate-800'
                      }`}
                    >
                      <div
                        onClick={() => handleTogglePlannerTask(t.id)}
                        className="flex items-center gap-2 flex-1 cursor-pointer"
                      >
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          t.done ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-300'
                        }`}>
                          {t.done && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded mr-1.5 ${
                            t.done ? 'bg-slate-200 text-slate-500' : 'bg-violet-100 text-violet-800'
                          }`}>
                            {t.subject}
                          </span>
                          <span className={t.done ? 'line-through' : 'font-medium'}>{t.target}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeletePlannerTask(t.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Progress Summary */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-slate-700">আজকের অগ্রগতি (Progress)</span>
                    <span className="font-bold text-violet-700">
                      {plannerTasks.length > 0 ? Math.round((plannerTasks.filter(t => t.done).length / plannerTasks.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${plannerTasks.length > 0 ? Math.round((plannerTasks.filter(t => t.done).length / plannerTasks.length) * 100) : 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* AGE CALC MODAL */}
            {activeModal === 'ageCalc' && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900">বয়স ক্যালকুলেটর (Age Calc)</h3>
                  <p className="text-xs text-slate-500">আপনার সঠিক জন্মতারিখ নির্বাচন করুন</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">জন্মতারিখ:</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>
                {ageResult && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
                    <p className="text-xs text-orange-800 font-semibold mb-1">আপনার বর্তমান বয়স</p>
                    <div className="flex justify-around items-center pt-2">
                      <div>
                        <span className="text-2xl font-black text-orange-950">{ageResult.years}</span>
                        <p className="text-[10px] text-orange-700 font-bold">বছর</p>
                      </div>
                      <div>
                        <span className="text-2xl font-black text-orange-950">{ageResult.months}</span>
                        <p className="text-[10px] text-orange-700 font-bold">মাস</p>
                      </div>
                      <div>
                        <span className="text-2xl font-black text-orange-950">{ageResult.days}</span>
                        <p className="text-[10px] text-orange-700 font-bold">দিন</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GPA CALC MODAL */}
            {activeModal === 'gpaCalc' && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900">জিপিএ ক্যালকুলেটর (GPA Calc)</h3>
                  <p className="text-xs text-slate-500">বিষয় ও প্রাপ্ত গ্রেড পয়েন্ট</p>
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {gpaSubjects.map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-800">{sub.name}</span>
                      <select
                        value={sub.grade}
                        onChange={e => {
                          const updated = [...gpaSubjects];
                          updated[idx].grade = parseFloat(e.target.value);
                          setGpaSubjects(updated);
                        }}
                        className="p-1 rounded-lg border border-slate-200 font-bold text-amber-700 bg-white"
                      >
                        {gradeOptions.map(g => (
                          <option key={g.point} value={g.point}>{g.label}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                  <p className="text-xs text-amber-800 font-semibold">আপনার মোট আনুমানিক জিপিএ</p>
                  <span className="text-3xl font-black text-amber-900">{calculatedGPA}</span>
                  <p className="text-[10px] text-amber-700 font-bold mt-0.5">
                    {parseFloat(calculatedGPA) >= 5 ? '🌟 গোল্ডেন A+ প্রস্তুতি!' : 'সফল প্রস্তুতি চালিয়ে যান'}
                  </p>
                </div>
              </div>
            )}

            {/* UNIT CONVERTER MODAL */}
            {activeModal === 'converter' && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900">ইউনিট কনভার্টার (Converter)</h3>
                  <p className="text-xs text-slate-500">দৈর্ঘ্য ও ওজনের সহজ রূপান্তর</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setUnitCategory('length');
                      setFromUnit('meter');
                      setToUnit('kilometer');
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg ${unitCategory === 'length' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    দৈর্ঘ্য
                  </button>
                  <button
                    onClick={() => {
                      setUnitCategory('weight');
                      setFromUnit('kg');
                      setToUnit('pound');
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg ${unitCategory === 'weight' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    ওজন
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                    placeholder="মান লিখুন"
                  />
                  <div className="flex items-center gap-2 text-xs">
                    <select
                      value={fromUnit}
                      onChange={e => setFromUnit(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-slate-200 bg-white font-semibold"
                    >
                      {unitCategory === 'length' ? (
                        <>
                          <option value="meter">মিটার</option>
                          <option value="kilometer">কিলোমিটার</option>
                          <option value="mile">মাইল</option>
                          <option value="feet">ফুট</option>
                        </>
                      ) : (
                        <>
                          <option value="kg">কিলোগ্রাম (kg)</option>
                          <option value="gram">গ্রাম (g)</option>
                          <option value="pound">পাউন্ড (lb)</option>
                        </>
                      )}
                    </select>
                    <span className="font-bold text-slate-400">হতে</span>
                    <select
                      value={toUnit}
                      onChange={e => setToUnit(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-slate-200 bg-white font-semibold"
                    >
                      {unitCategory === 'length' ? (
                        <>
                          <option value="kilometer">কিলোমিটার</option>
                          <option value="meter">মিটার</option>
                          <option value="mile">মাইল</option>
                          <option value="feet">ফুট</option>
                        </>
                      ) : (
                        <>
                          <option value="pound">পাউন্ড (lb)</option>
                          <option value="kg">কিলোগ্রাম (kg)</option>
                          <option value="gram">গ্রাম (g)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-center">
                  <p className="text-xs text-teal-800 font-semibold">ফলাফল</p>
                  <span className="text-2xl font-black text-teal-950">{convertUnits()}</span>
                </div>
              </div>
            )}

            {/* NUMBER CONVERTER MODAL */}
            {activeModal === 'numberConverter' && (
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900">সংখ্যা রূপান্তর (Number Converter)</h3>
                  <p className="text-xs text-slate-500">আইসিটি বাইনারি, ডেসিমাল ও হেক্সাডেসিমাল</p>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">দশমিক (Decimal):</label>
                  <input
                    type="number"
                    value={decInput}
                    onChange={e => handleDecChange(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 flex justify-between items-center">
                    <span className="font-bold text-blue-900">Binary (২):</span>
                    <span className="font-mono font-bold text-blue-800 break-all">{binVal || '0'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Hexadecimal (১৬):</span>
                    <span className="font-mono font-bold text-slate-800">{hexVal || '0'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Octal (৮):</span>
                    <span className="font-mono font-bold text-slate-800">{octVal || '0'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* FORMULAS MODAL */}
            {activeModal === 'formulas' && (
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900">গুরুত্বপূর্ণ সূত্রাবলী (Formulas)</h3>
                  <p className="text-xs text-slate-500">পদার্থ, গণিত ও রসায়নের কুইক রেফারেন্স</p>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto text-xs pr-1">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200">
                    <span className="font-bold text-purple-900">গণিত: দ্বিপদী ও ত্রিকোণমিতি</span>
                    <p className="text-purple-800 font-mono mt-1">sin²θ + cos²θ = 1</p>
                    <p className="text-purple-800 font-mono">x = (-b ± √(b² - 4ac)) / (2a)</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
                    <span className="font-bold text-indigo-900">পদার্থবিজ্ঞান: গতি ও বল</span>
                    <p className="text-indigo-800 font-mono mt-1">v = u + at | s = ut + ½at²</p>
                    <p className="text-indigo-800 font-mono">F = ma | E = mc²</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="font-bold text-amber-900">রসায়ন: আদর্শ গ্যাস সমীকরণ</span>
                    <p className="text-amber-800 font-mono mt-1">PV = nRT</p>
                  </div>
                </div>
              </div>
            )}

            {/* POMODORO MODAL */}
            {activeModal === 'pomodoro' && (
              <div className="space-y-4 text-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">পোমোডোরো স্টাডি টাইমার</h3>
                  <p className="text-xs text-slate-500">২৫ মিনিট গভীর মনোযোগ দিয়ে পড়ার অভ্যাস</p>
                </div>
                <div className="w-36 h-36 rounded-full bg-rose-50 border-4 border-rose-400 flex items-center justify-center mx-auto shadow-inner">
                  <span className="text-3xl font-black font-mono text-rose-600">
                    {formatPomoTime(pomoSeconds)}
                  </span>
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setPomoActive(!pomoActive)}
                    className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    {pomoActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{pomoActive ? 'থামুন' : 'শুরু করুন'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setPomoActive(false);
                      setPomoSeconds(25 * 60);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>রিসেট</span>
                  </button>
                </div>
              </div>
            )}

            {/* NOTEBOOK MODAL */}
            {activeModal === 'notebook' && (
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900">স্টাডি নোটবুক</h3>
                  <p className="text-xs text-slate-500">পড়ার গুরুত্বপূর্ণ টিপস লিখে রাখুন</p>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="নতুন নোট লিখুন..."
                    className="flex-1 p-2 rounded-xl border border-slate-200 text-xs"
                    onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {notes.map((n, i) => (
                    <div key={i} className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start justify-between gap-2 text-xs">
                      <span className="text-slate-800 flex-1 leading-snug">{n}</span>
                      <button onClick={() => handleDeleteNote(i)} className="text-slate-400 hover:text-rose-600 p-0.5">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TO-DO LIST MODAL */}
            {activeModal === 'todoList' && (
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900">টু-ডু লিস্ট</h3>
                  <p className="text-xs text-slate-500">দৈনিক পড়া ও পরীক্ষার টাস্ক তালিকা</p>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    placeholder="নতুন টাস্ক লিখুন..."
                    className="flex-1 p-2 rounded-xl border border-slate-200 text-xs"
                    onKeyDown={e => e.key === 'Enter' && handleAddTodo()}
                  />
                  <button
                    onClick={handleAddTodo}
                    className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {todos.map(t => (
                    <div
                      key={t.id}
                      onClick={() => handleToggleTodo(t.id)}
                      className={`p-2 rounded-xl border flex items-center gap-2 text-xs cursor-pointer transition-all ${
                        t.done ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        t.done ? 'bg-cyan-600 border-cyan-600 text-white' : 'border-slate-300'
                      }`}>
                        {t.done && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="flex-1">{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CHECKLIST MODAL */}
            {activeModal === 'checklist' && (
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900">পরীক্ষার পূর্বপ্রস্তুতি চেকলিস্ট</h3>
                  <p className="text-xs text-slate-500">পরীক্ষার হলে যাওয়ার আগে মিলিয়ে নিন</p>
                </div>
                <div className="space-y-2">
                  {checkItems.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setCheckItems(items => items.map(it => it.id === c.id ? { ...it, checked: !it.checked } : it));
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs cursor-pointer hover:bg-slate-50"
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        c.checked ? 'bg-lime-600 border-lime-600 text-white' : 'border-slate-300'
                      }`}>
                        {c.checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`flex-1 font-semibold ${c.checked ? 'text-slate-800' : 'text-slate-600'}`}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REMINDER MODAL */}
            {activeModal === 'reminder' && (
              <div className="space-y-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">পরীক্ষা ও ক্লাস রিমাইন্ডার</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  বোর্ড পরীক্ষা ও অধ্যায়ভিত্তিক এমসিকিউ রিভিশনের জন্য স্মার্টস্টাডি প্ল্যাটফর্মের নোটিফিকেশন স্বয়ংক্রিয়ভাবে সক্রিয় রয়েছে।
                </p>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-bold">
                  🔔 নোটিফিকেশন চালু আছে
                </div>
              </div>
            )}

            {/* ROUTINE MODAL */}
            {activeModal === 'routine' && (
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900">সাপ্তাহিক স্টাডি রুটিন</h3>
                  <p className="text-xs text-slate-500">বোর্ড প্রস্তুতি সময়সূচী</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 flex justify-between">
                    <span className="font-bold text-indigo-900">শনিবার - সোমবার:</span>
                    <span className="text-indigo-800">গণিত ও পদার্থবিজ্ঞান লেকচার</span>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 flex justify-between">
                    <span className="font-bold text-purple-900">মঙ্গলবার - বুধবার:</span>
                    <span className="text-purple-800">আইসিটি ও ইংরেজি প্র্যাকটিস</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 flex justify-between">
                    <span className="font-bold text-amber-900">বৃহস্পতিবার - শুক্রবার:</span>
                    <span className="text-amber-800">৩০টি বোর্ড এমসিকিউ টেস্ট</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
