import React, { useState, useEffect, useRef } from 'react';
import { 
  RotateCcw, 
  History, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  Atom, 
  Sparkles, 
  HelpCircle,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';

interface CalculationRecord {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

interface ScientificCalculatorProps {
  onBack?: () => void;
}

// Common Physics & Chemistry Constants for HSC & SSC Students
const SCIENTIFIC_CONSTANTS = [
  { name: 'Speed of Light (c)', symbol: 'c', value: '299792458', unit: 'm/s', category: 'Physics' },
  { name: "Planck's Constant (h)", symbol: 'h', value: '6.62607015e-34', unit: 'J·s', category: 'Physics' },
  { name: 'Gravitational Constant (G)', symbol: 'G', value: '6.6743e-11', unit: 'N·m²/kg²', category: 'Physics' },
  { name: 'Acceleration of Gravity (g)', symbol: 'g', value: '9.80665', unit: 'm/s²', category: 'Physics' },
  { name: 'Elementary Charge (e)', symbol: 'e_charge', value: '1.602176634e-19', unit: 'C', category: 'Physics' },
  { name: 'Electron Mass (me)', symbol: 'm_e', value: '9.1093837e-31', unit: 'kg', category: 'Physics' },
  { name: 'Proton Mass (mp)', symbol: 'm_p', value: '1.6726219e-27', unit: 'kg', category: 'Physics' },
  { name: 'Avogadro Number (NA)', symbol: 'N_A', value: '6.02214076e23', unit: 'mol⁻¹', category: 'Chemistry' },
  { name: 'Molar Gas Constant (R)', symbol: 'R', value: '8.314462618', unit: 'J/(mol·K)', category: 'Chemistry' },
  { name: 'Boltzmann Constant (k)', symbol: 'k_b', value: '1.380649e-23', unit: 'J/K', category: 'Physics' },
  { name: 'Faraday Constant (F)', symbol: 'F', value: '96485.3321', unit: 'C/mol', category: 'Chemistry' },
  { name: 'Permittivity of Free Space (ε₀)', symbol: 'ε₀', value: '8.8541878e-12', unit: 'F/m', category: 'Physics' },
];

export const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({ onBack }) => {
  // Calculator States
  const [expression, setExpression] = useState<string>('');
  const [cursorPos, setCursorPos] = useState<number>(0);
  const [result, setResult] = useState<string>('0');
  const [lastAns, setLastAns] = useState<number>(0);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  
  // Status Flags
  const [shiftActive, setShiftActive] = useState<boolean>(false);
  const [alphaActive, setAlphaActive] = useState<boolean>(false);
  const [hypActive, setHypActive] = useState<boolean>(false);
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD' | 'GRA'>('DEG');
  const [memory, setMemory] = useState<number>(0);
  const [fractionMode, setFractionMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Modals & Panels
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showConstants, setShowConstants] = useState<boolean>(false);
  const [showModeModal, setShowModeModal] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculation History
  const [history, setHistory] = useState<CalculationRecord[]>(() => {
    const saved = localStorage.getItem('smartstudy_calc_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Cursor Blinker
  const [cursorBlink, setCursorBlink] = useState<boolean>(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorBlink(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('smartstudy_calc_history', JSON.stringify(history));
  }, [history]);

  // Audio Click Feedback
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  // Safe Insertion at current cursor position
  const insertText = (text: string) => {
    playClickSound();
    if (isEvaluated && !['+', '-', '×', '÷', '^', '%'].includes(text)) {
      // If user starts typing a number after evaluation, start new calculation
      setExpression(text);
      setCursorPos(text.length);
      setIsEvaluated(false);
      return;
    }

    if (isEvaluated && ['+', '-', '×', '÷', '^', '%'].includes(text)) {
      // If user presses operator after evaluation, chain from Ans
      const newExpr = `Ans${text}`;
      setExpression(newExpr);
      setCursorPos(newExpr.length);
      setIsEvaluated(false);
      return;
    }

    const before = expression.slice(0, cursorPos);
    const after = expression.slice(cursorPos);
    const newExpr = before + text + after;
    setExpression(newExpr);
    setCursorPos(cursorPos + text.length);
    setIsEvaluated(false);
    
    // Auto turn off Shift and Alpha after one keypress
    if (shiftActive) setShiftActive(false);
    if (alphaActive) setAlphaActive(false);
  };

  // Delete Backspace
  const handleDelete = () => {
    playClickSound();
    if (cursorPos === 0) return;
    
    // Check if deleting a multi-char token like 'sin(', 'cos(', 'Ans', 'log('
    const before = expression.slice(0, cursorPos);
    const tokens = ['sin⁻¹(', 'cos⁻¹(', 'tan⁻¹(', 'sinh(', 'cosh(', 'tanh(', 'sin(', 'cos(', 'tan(', 'log(', 'ln(', '³√(', '√(', 'Ans', '10^('];
    let deleteCount = 1;
    for (const t of tokens) {
      if (before.endsWith(t)) {
        deleteCount = t.length;
        break;
      }
    }

    const newExpr = expression.slice(0, cursorPos - deleteCount) + expression.slice(cursorPos);
    setExpression(newExpr);
    setCursorPos(Math.max(0, cursorPos - deleteCount));
    setIsEvaluated(false);
  };

  // All Clear (AC)
  const handleAllClear = () => {
    playClickSound();
    setExpression('');
    setCursorPos(0);
    setResult('0');
    setIsEvaluated(false);
    setShiftActive(false);
    setAlphaActive(false);
    setHistoryIndex(-1);
  };

  // Move Cursor Left
  const handleCursorLeft = () => {
    playClickSound();
    setCursorPos(prev => Math.max(0, prev - 1));
  };

  // Move Cursor Right
  const handleCursorRight = () => {
    playClickSound();
    setCursorPos(prev => Math.min(expression.length, prev + 1));
  };

  // Replay Up: Previous History
  const handleHistoryUp = () => {
    playClickSound();
    if (history.length === 0) return;
    const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : history.length - 1;
    setHistoryIndex(nextIdx);
    const item = history[nextIdx];
    if (item) {
      setExpression(item.expression);
      setCursorPos(item.expression.length);
      setResult(item.result);
      setIsEvaluated(true);
    }
  };

  // Replay Down: Next History
  const handleHistoryDown = () => {
    playClickSound();
    if (history.length === 0) return;
    const nextIdx = historyIndex - 1 >= 0 ? historyIndex - 1 : -1;
    setHistoryIndex(nextIdx);
    if (nextIdx === -1) {
      setExpression('');
      setCursorPos(0);
      setResult('0');
      setIsEvaluated(false);
    } else {
      const item = history[nextIdx];
      if (item) {
        setExpression(item.expression);
        setCursorPos(item.expression.length);
        setResult(item.result);
        setIsEvaluated(true);
      }
    }
  };

  // Convert decimal to authentic Casio fraction (e.g. 1⌟2 or 1⌟3⌟4)
  const decimalToCasioFraction = (val: number): string => {
    if (isNaN(val) || !isFinite(val) || Math.abs(val) > 1000000) return val.toString();
    const sign = val < 0 ? '-' : '';
    let num = Math.abs(val);

    const whole = Math.floor(num);
    const frac = num - whole;
    if (frac < 1e-9) return `${sign}${whole}`;

    // Continued fraction approximation
    const maxDenominator = 10000;
    let bestNum = 1;
    let bestDen = 1;
    let bestDiff = Math.abs(frac - bestNum / bestDen);

    for (let den = 1; den <= maxDenominator; den++) {
      const candidateNum = Math.round(frac * den);
      const diff = Math.abs(frac - candidateNum / den);
      if (diff < bestDiff) {
        bestNum = candidateNum;
        bestDen = den;
        bestDiff = diff;
        if (diff < 1e-8) break;
      }
    }

    if (bestDiff > 1e-4) {
      return val.toString();
    }

    if (whole === 0) {
      return `${sign}${bestNum}⌟${bestDen}`;
    } else {
      return `${sign}${whole}⌟${bestNum}⌟${bestDen}`;
    }
  };

  // Math Factorial
  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) throw new Error('Math ERROR');
    if (n > 170) return Infinity;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  // Permutation nPr
  const nPr = (n: number, r: number): number => {
    if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) throw new Error('Math ERROR');
    return factorial(n) / factorial(n - r);
  };

  // Combination nCr
  const nCr = (n: number, r: number): number => {
    if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) throw new Error('Math ERROR');
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  // Safe Math Expression Evaluator
  const evaluateExpression = (expr: string): { success: boolean; value: number; formatted: string; error?: string } => {
    if (!expr.trim()) return { success: true, value: 0, formatted: '0' };

    try {
      let parsed = expr;

      // Replace visual symbols
      parsed = parsed.replace(/×/g, '*');
      parsed = parsed.replace(/÷/g, '/');
      parsed = parsed.replace(/π/g, `(${Math.PI})`);
      parsed = parsed.replace(/\bAns\b/g, `(${lastAns})`);
      parsed = parsed.replace(/e_charge/g, '(1.602176634e-19)');
      parsed = parsed.replace(/m_e/g, '(9.1093837e-31)');
      parsed = parsed.replace(/m_p/g, '(1.6726219e-27)');
      parsed = parsed.replace(/N_A/g, '(6.02214076e23)');
      parsed = parsed.replace(/k_b/g, '(1.380649e-23)');

      // Casio fraction symbol '⌟' inside expression e.g. 3⌟4 -> (3/4)
      parsed = parsed.replace(/(\d+)\s*⌟\s*(\d+)\s*⌟\s*(\d+)/g, '($1 + $2/$3)');
      parsed = parsed.replace(/(\d+)\s*⌟\s*(\d+)/g, '($1/$2)');

      // EXP notation (e.g. 5 EXP 3 -> 5e3)
      parsed = parsed.replace(/EXP\s*(-?\d+)/g, '*10^($1)');

      // Handle angles conversion factor
      const toRad = angleMode === 'DEG' ? Math.PI / 180 : angleMode === 'GRA' ? Math.PI / 200 : 1;
      const fromRad = angleMode === 'DEG' ? 180 / Math.PI : angleMode === 'GRA' ? 200 / Math.PI : 1;

      // Inverse Trig Functions
      parsed = parsed.replace(/sin⁻¹\(/g, `__asin(`);
      parsed = parsed.replace(/cos⁻¹\(/g, `__acos(`);
      parsed = parsed.replace(/tan⁻¹\(/g, `__atan(`);

      // Hyperbolic
      parsed = parsed.replace(/sinh\(/g, `Math.sinh(`);
      parsed = parsed.replace(/cosh\(/g, `Math.cosh(`);
      parsed = parsed.replace(/tanh\(/g, `Math.tanh(`);

      // Standard Trig
      parsed = parsed.replace(/sin\(/g, `__sin(`);
      parsed = parsed.replace(/cos\(/g, `__cos(`);
      parsed = parsed.replace(/tan\(/g, `__tan(`);

      // Log & Roots
      parsed = parsed.replace(/log\(/g, `Math.log10(`);
      parsed = parsed.replace(/ln\(/g, `Math.log(`);
      parsed = parsed.replace(/³√\(/g, `Math.cbrt(`);
      parsed = parsed.replace(/√\(/g, `Math.sqrt(`);

      // Powers: x^y -> Math.pow(x, y)
      // Replace ^ with **
      parsed = parsed.replace(/\^/g, '**');

      // Factorial: e.g. 5! -> __fact(5)
      parsed = parsed.replace(/(\d+(?:\.\d+)?|\([^)]+\))!/g, '__fact($1)');

      // Implicit multiplication: e.g. 2(3) -> 2*(3), )2 -> )*2, )Math -> )*Math, 5Math -> 5*Math
      parsed = parsed.replace(/(\d)\s*\(/g, '$1*(');
      parsed = parsed.replace(/\)\s*(\d)/g, ')*$1');
      parsed = parsed.replace(/\)\s*\(/g, ')*(');
      parsed = parsed.replace(/(\d)\s*(Math|__sin|__cos|__tan|__asin|__acos|__atan)/g, '$1*$2');

      // Scope helper functions
      const scope = {
        Math,
        __sin: (x: number) => {
          const val = Math.sin(x * toRad);
          // clean floating imprecision like sin(180) -> 0
          return Math.abs(val) < 1e-15 ? 0 : val;
        },
        __cos: (x: number) => {
          const val = Math.cos(x * toRad);
          return Math.abs(val) < 1e-15 ? 0 : val;
        },
        __tan: (x: number) => {
          if (angleMode === 'DEG' && (Math.abs(x % 180) === 90)) {
            throw new Error('Math ERROR');
          }
          const val = Math.tan(x * toRad);
          return Math.abs(val) < 1e-15 ? 0 : val;
        },
        __asin: (x: number) => {
          if (x < -1 || x > 1) throw new Error('Math ERROR');
          return Math.asin(x) * fromRad;
        },
        __acos: (x: number) => {
          if (x < -1 || x > 1) throw new Error('Math ERROR');
          return Math.acos(x) * fromRad;
        },
        __atan: (x: number) => Math.atan(x) * fromRad,
        __fact: factorial,
        __nPr: nPr,
        __nCr: nCr,
      };

      // Safely evaluate using Function with scope parameters
      const fn = new Function(
        'Math', '__sin', '__cos', '__tan', '__asin', '__acos', '__atan', '__fact', '__nPr', '__nCr',
        `"use strict"; return (${parsed});`
      );

      const val = fn(
        scope.Math,
        scope.__sin,
        scope.__cos,
        scope.__tan,
        scope.__asin,
        scope.__acos,
        scope.__atan,
        scope.__fact,
        scope.__nPr,
        scope.__nCr
      );

      if (typeof val !== 'number' || isNaN(val)) {
        return { success: false, value: NaN, formatted: 'Math ERROR', error: 'Invalid operation' };
      }

      if (!isFinite(val)) {
        return { success: false, value: Infinity, formatted: 'Math ERROR', error: 'Infinite overflow' };
      }

      // Format clean precision
      let formatted: string;
      if (Math.abs(val) < 1e-12 && Math.abs(val) > 0) {
        formatted = val.toExponential(6);
      } else if (Math.abs(val) >= 1e10) {
        formatted = val.toExponential(6);
      } else {
        // Round to avoid float precision artifacts like 0.1 + 0.2 = 0.30000000000000004
        const rounded = Number(val.toPrecision(10));
        formatted = rounded.toString();
      }

      return { success: true, value: val, formatted };
    } catch {
      return { success: false, value: NaN, formatted: 'Syntax ERROR', error: 'Syntax Error' };
    }
  };

  // Execute Calculation
  const handleCalculate = () => {
    playClickSound();
    if (!expression.trim()) return;

    const res = evaluateExpression(expression);
    setResult(res.formatted);
    setIsEvaluated(true);

    if (res.success) {
      setLastAns(res.value);
      // Append to history
      const newRecord: CalculationRecord = {
        id: Date.now().toString(),
        expression,
        result: res.formatted,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newRecord, ...prev.slice(0, 29)]);
      setHistoryIndex(-1);
    }
  };

  // Copy to clipboard
  const handleCopyResult = () => {
    const textToCopy = fractionMode ? decimalToCasioFraction(lastAns) : result;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Memory Operations
  const handleMemoryAdd = () => {
    playClickSound();
    const evalRes = isEvaluated ? lastAns : evaluateExpression(expression).value;
    if (!isNaN(evalRes)) {
      setMemory(prev => prev + evalRes);
    }
  };

  const handleMemoryRecall = () => {
    playClickSound();
    insertText(memory.toString());
  };

  const handleMemoryClear = () => {
    playClickSound();
    setMemory(0);
  };

  // Toggle Fraction Display
  const handleFractionToggle = () => {
    playClickSound();
    if (isEvaluated && !isNaN(lastAns)) {
      setFractionMode(prev => !prev);
    } else {
      insertText('⌟');
    }
  };

  // Scientific Constants Insert
  const handleSelectConstant = (val: string) => {
    insertText(val);
    setShowConstants(false);
  };

  // Formatted display text
  const displayResult = fractionMode && !isNaN(lastAns)
    ? decimalToCasioFraction(lastAns)
    : result;

  return (
    <div className="w-full max-w-[340px] sm:max-w-[350px] mx-auto pb-24 pt-1 px-1.5 animate-fade-in font-sans select-none">
      
      {/* Top Bar with Only Home Return Button (Extra buttons deleted as requested) */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        {onBack && (
          <button
            onClick={onBack}
            className="px-2.5 py-1 rounded-lg bg-white/95 hover:bg-white text-slate-800 border border-slate-200/80 shadow-xs flex items-center gap-1 text-[11px] font-bold transition-all active:scale-95"
            title="হোম পেজে ফিরুন"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
            <span>হোমে ফিরুন</span>
          </button>
        )}
      </div>

      {/* ---------------- CASIO fx-570MS PHYSICAL BODY (COMPACT) ---------------- */}
      <div className="relative rounded-[26px] bg-gradient-to-b from-[#242732] via-[#1c1e26] to-[#14151b] p-2.5 sm:p-3 shadow-[0_16px_36px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] border-t border-slate-600/70">
        
        {/* Subtle Ergonomic Waist Curves on Sides */}
        <div className="absolute top-20 -left-1 w-1 h-28 bg-slate-800 rounded-r-md opacity-40 pointer-events-none" />
        <div className="absolute top-20 -right-1 w-1 h-28 bg-slate-800 rounded-l-md opacity-40 pointer-events-none" />

        {/* Brand & Model Header Bar - Authentic CASIO fx-570MS */}
        <div className="flex items-start justify-between pb-1 px-1 border-b border-slate-700/60 leading-none">
          <div>
            <span className="font-sans font-black tracking-wider text-sm sm:text-base text-white block">
              CASIO
            </span>
          </div>

          <div className="text-right">
            <span className="text-[7.5px] font-mono text-slate-300 tracking-wider block">
              SCIENTIFIC CALCULATOR <span className="font-bold text-white">fx-570MS</span>
            </span>
            <span className="font-black text-[10px] sm:text-[11px] tracking-widest text-[#f5c518] font-sans block mt-0.5">
              S-V.P.A.M.
            </span>
          </div>
        </div>

        {/* ---------------- 2-LINE DOT MATRIX LCD SCREEN (COMPACT) ---------------- */}
        <div className="mt-1.5 relative rounded-xl bg-[#bccabc] p-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.12)] border-2 border-slate-950/80 overflow-hidden font-mono text-slate-950">
          
          {/* LCD Glare Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/15 pointer-events-none" />

          {/* LCD Top Status Flags Bar */}
          <div className="flex items-center justify-between text-[8px] font-bold text-slate-800 border-b border-slate-800/15 pb-0.5 mb-0.5 leading-none">
            <div className="flex items-center gap-1.5">
              <span className={`px-0.5 rounded ${shiftActive ? 'bg-slate-900 text-[#bccabc]' : 'opacity-20'}`}>S</span>
              <span className={`px-0.5 rounded ${alphaActive ? 'bg-slate-900 text-[#bccabc]' : 'opacity-20'}`}>A</span>
              <span className={`px-0.5 rounded ${memory !== 0 ? 'bg-slate-900 text-[#bccabc]' : 'opacity-20'}`}>M</span>
              <span className={`px-0.5 rounded ${hypActive ? 'bg-slate-900 text-[#bccabc]' : 'opacity-20'}`}>hyp</span>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setAngleMode(prev => prev === 'DEG' ? 'RAD' : prev === 'RAD' ? 'GRA' : 'DEG')}
                className="hover:bg-slate-800/10 px-0.5 rounded flex items-center gap-0.5 cursor-pointer"
                title="ক্লিক করে কোণ পরিবর্তন করুন (DEG/RAD/GRA)"
              >
                <span className={angleMode === 'DEG' ? 'font-black underline' : 'opacity-30'}>D</span>
                <span className={angleMode === 'RAD' ? 'font-black underline' : 'opacity-30'}>R</span>
                <span className={angleMode === 'GRA' ? 'font-black underline' : 'opacity-30'}>G</span>
              </button>

              <span className={`text-[9px] ${history.length > 0 ? 'opacity-80' : 'opacity-20'}`}>▲▼</span>
            </div>
          </div>

          {/* Line 1: Expression with Interactive Cursor */}
          <div className="min-h-[18px] text-xs sm:text-[13px] tracking-wide flex items-center overflow-x-auto whitespace-nowrap scrollbar-none text-slate-900 font-semibold py-0">
            {expression ? (
              <span>
                {expression.slice(0, cursorPos)}
                <span className={`inline-block w-0.5 h-3.5 bg-slate-900 align-middle ${cursorBlink ? 'opacity-100' : 'opacity-0'}`} />
                {expression.slice(cursorPos)}
              </span>
            ) : (
              <span className="text-slate-700/60 flex items-center">
                <span>0</span>
                <span className={`inline-block w-0.5 h-3.5 bg-slate-900 align-middle ml-0.5 ${cursorBlink ? 'opacity-100' : 'opacity-0'}`} />
              </span>
            )}
          </div>

          {/* Line 2: High-Contrast Digital Result (Right Aligned) */}
          <div className="flex items-baseline justify-between pt-0.5">
            <div className="text-[9px] text-slate-700 flex items-center gap-1">
              {fractionMode && <span className="bg-slate-900 text-[#bccabc] px-1 py-0.2 rounded text-[7.5px] font-black">a b/c</span>}
              {isEvaluated && (
                <button
                  onClick={handleCopyResult}
                  className="p-0.5 hover:bg-slate-800/20 rounded text-slate-800 transition-colors"
                  title="ফলাফল কপি করুন"
                >
                  {copied ? <Check className="w-2.5 h-2.5 text-emerald-800" /> : <Copy className="w-2.5 h-2.5" />}
                </button>
              )}
            </div>

            <div className="text-lg sm:text-xl font-black tracking-tight text-right text-slate-950 font-mono truncate max-w-[85%]">
              {displayResult}
            </div>
          </div>

        </div>

        {/* ---------------- CASIO CONTROL & FUNCTION BUTTONS ---------------- */}
        <div className="mt-2 space-y-1">
          
          {/* Top Control Oval Buttons Row + Central REPLAY 4-Way Disc */}
          <div className="grid grid-cols-5 gap-1 items-center">
            
            {/* SHIFT (Yellow Accent) */}
            <div className="text-center">
              <span className="text-[7.5px] font-black tracking-tighter text-amber-400 block h-2">SHIFT</span>
              <button
                onClick={() => {
                  playClickSound();
                  setShiftActive(prev => !prev);
                  if (alphaActive) setAlphaActive(false);
                }}
                className={`w-full py-1 rounded-xl text-[10px] font-black shadow-xs border transition-all active:scale-95 ${
                  shiftActive
                    ? 'bg-amber-400 text-slate-950 border-amber-300 ring-1 ring-amber-400/50'
                    : 'bg-slate-700 text-amber-300 border-slate-600 hover:bg-slate-650'
                }`}
              >
                SHIFT
              </button>
            </div>

            {/* ALPHA (Pink Accent) */}
            <div className="text-center">
              <span className="text-[7.5px] font-black tracking-tighter text-rose-400 block h-2">ALPHA</span>
              <button
                onClick={() => {
                  playClickSound();
                  setAlphaActive(prev => !prev);
                  if (shiftActive) setShiftActive(false);
                }}
                className={`w-full py-1 rounded-xl text-[10px] font-black shadow-xs border transition-all active:scale-95 ${
                  alphaActive
                    ? 'bg-rose-500 text-white border-rose-400 ring-1 ring-rose-500/50'
                    : 'bg-slate-700 text-rose-300 border-slate-600 hover:bg-slate-650'
                }`}
              >
                ALPHA
              </button>
            </div>

            {/* Large REPLAY Disc Controller (Centered) */}
            <div className="relative flex flex-col items-center justify-center -my-1 z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)] border border-slate-500 relative flex items-center justify-center">
                
                {/* Up Button */}
                <button
                  onClick={handleHistoryUp}
                  className="absolute top-0 left-1/2 -translate-x-1/2 p-0.5 text-slate-700 hover:text-slate-950 active:scale-90"
                  title="পূর্ববর্তী হিসাব"
                >
                  <ChevronUp className="w-3 h-3 stroke-[2.5]" />
                </button>

                {/* Down Button */}
                <button
                  onClick={handleHistoryDown}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 p-0.5 text-slate-700 hover:text-slate-950 active:scale-90"
                  title="পরবর্তী হিসাব"
                >
                  <ChevronDown className="w-3 h-3 stroke-[2.5]" />
                </button>

                {/* Left Button */}
                <button
                  onClick={handleCursorLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-0.5 text-slate-700 hover:text-slate-950 active:scale-90"
                  title="কার্সর বামে"
                >
                  <ChevronLeft className="w-3 h-3 stroke-[2.5]" />
                </button>

                {/* Right Button */}
                <button
                  onClick={handleCursorRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-0.5 text-slate-700 hover:text-slate-950 active:scale-90"
                  title="কার্সর ডানে"
                >
                  <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                </button>

                {/* Center Badge */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-300 shadow-inner flex items-center justify-center border border-slate-400">
                  <span className="text-[6px] font-bold text-amber-600">RE</span>
                </div>
              </div>
            </div>

            {/* MODE / CLR */}
            <div className="text-center">
              <span className="text-[7.5px] font-bold text-amber-400 block h-2">CLR</span>
              <button
                onClick={() => {
                  playClickSound();
                  setShowModeModal(true);
                }}
                className="w-full py-1 rounded-xl bg-slate-700 hover:bg-slate-650 text-slate-200 border border-slate-600 shadow-xs text-[10px] font-bold transition-all active:scale-95"
              >
                MODE
              </button>
            </div>

            {/* ON Button */}
            <div className="text-center">
              <span className="text-[7.5px] font-bold text-slate-400 block h-2">RESET</span>
              <button
                onClick={handleAllClear}
                className="w-full py-1 rounded-xl bg-slate-700 hover:bg-slate-650 text-amber-300 border border-slate-600 shadow-xs text-[10px] font-black transition-all active:scale-95"
              >
                ON
              </button>
            </div>

          </div>

          {/* Row 2: Scientific Functions [CALC, ∫dx, x⁻¹, CONST] */}
          <div className="grid grid-cols-4 gap-1 pt-0.5">
            
            {/* CALC / SOLVE */}
            <div className="text-center">
              <div className="flex justify-between px-0.5 text-[7px] font-bold h-2">
                <span className="text-amber-400">SOLVE</span>
                <span className="text-rose-400">=</span>
              </div>
              <button
                onClick={handleCalculate}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 shadow-2xs active:scale-95"
              >
                CALC
              </button>
            </div>

            {/* ∫dx / d/dx */}
            <div className="text-center">
              <div className="flex justify-between px-0.5 text-[7px] font-bold h-2">
                <span className="text-amber-400">d/dx</span>
                <span className="text-rose-400">:</span>
              </div>
              <button
                onClick={() => insertText('(')}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 shadow-2xs active:scale-95"
              >
                ∫dx
              </button>
            </div>

            {/* x⁻¹ / x! */}
            <div className="text-center">
              <div className="flex justify-between px-0.5 text-[7px] font-bold h-2">
                <span className="text-amber-400">x!</span>
                <span className="text-cyan-400">LOGIC</span>
              </div>
              <button
                onClick={() => shiftActive ? insertText('!') : insertText('^(-1)')}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 shadow-2xs active:scale-95"
              >
                {shiftActive ? 'x!' : 'x⁻¹'}
              </button>
            </div>

            {/* CONST / CONV */}
            <div className="text-center">
              <div className="flex justify-between px-0.5 text-[7px] font-bold h-2">
                <span className="text-amber-400">CONV</span>
              </div>
              <button
                onClick={() => setShowConstants(true)}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-amber-300 text-[10px] font-bold border border-slate-700 shadow-2xs active:scale-95"
              >
                CONST
              </button>
            </div>

          </div>

          {/* Row 3: [a b/c, √, x², ^, log, ln] */}
          <div className="grid grid-cols-6 gap-1 pt-0.5">
            
            {/* a b/c */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-amber-400 block h-2">d/c</span>
              <button
                onClick={handleFractionToggle}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[9.5px] font-bold border border-slate-700 active:scale-95"
              >
                ab/c
              </button>
            </div>

            {/* Square Root */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-amber-400 block h-2">³√</span>
              <button
                onClick={() => shiftActive ? insertText('³√(') : insertText('√(')}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                {shiftActive ? '³√' : '√'}
              </button>
            </div>

            {/* x² */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-amber-400 block h-2">x³</span>
              <button
                onClick={() => shiftActive ? insertText('^3') : insertText('^2')}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                {shiftActive ? 'x³' : 'x²'}
              </button>
            </div>

            {/* ^ (Power) */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-amber-400 block h-2">ˣ√</span>
              <button
                onClick={() => insertText('^')}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                ^
              </button>
            </div>

            {/* log */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-amber-400 block h-2">10ˣ</span>
              <button
                onClick={() => shiftActive ? insertText('10^(') : insertText('log(')}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                {shiftActive ? '10ˣ' : 'log'}
              </button>
            </div>

            {/* ln */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-amber-400 block h-2">eˣ</span>
              <button
                onClick={() => shiftActive ? insertText('(2.718281828)^(') : insertText('ln(')}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                {shiftActive ? 'eˣ' : 'ln'}
              </button>
            </div>

          </div>

          {/* Row 4: [(-), ° ' ", hyp, sin, cos, tan] */}
          <div className="grid grid-cols-6 gap-1 pt-0.5">
            
            {/* (-) Negation */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-rose-400 block h-2">A</span>
              <button
                onClick={() => insertText('-')}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                (-)
              </button>
            </div>

            {/* Degrees Minutes Seconds */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-rose-400 block h-2">B</span>
              <button
                onClick={() => insertText('°')}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                ° ' "
              </button>
            </div>

            {/* hyp */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-rose-400 block h-2">C</span>
              <button
                onClick={() => {
                  playClickSound();
                  setHypActive(prev => !prev);
                }}
                className={`w-full py-1 rounded-md text-[10px] font-bold border transition-all active:scale-95 ${
                  hypActive 
                    ? 'bg-amber-400 text-slate-900 border-amber-300' 
                    : 'bg-[#252830] hover:bg-[#2d313a] text-slate-100 border-slate-700'
                }`}
              >
                hyp
              </button>
            </div>

            {/* sin */}
            <div className="text-center">
              <div className="flex justify-between px-0.5 text-[7px] font-bold h-2">
                <span className="text-amber-400">sin⁻¹</span>
                <span className="text-rose-400">D</span>
              </div>
              <button
                onClick={() => {
                  if (hypActive) insertText('sinh(');
                  else if (shiftActive) insertText('sin⁻¹(');
                  else insertText('sin(');
                }}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                {hypActive ? 'sinh' : shiftActive ? 'sin⁻¹' : 'sin'}
              </button>
            </div>

            {/* cos */}
            <div className="text-center">
              <div className="flex justify-between px-0.5 text-[7px] font-bold h-2">
                <span className="text-amber-400">cos⁻¹</span>
                <span className="text-rose-400">E</span>
              </div>
              <button
                onClick={() => {
                  if (hypActive) insertText('cosh(');
                  else if (shiftActive) insertText('cos⁻¹(');
                  else insertText('cos(');
                }}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                {hypActive ? 'cosh' : shiftActive ? 'cos⁻¹' : 'cos'}
              </button>
            </div>

            {/* tan */}
            <div className="text-center">
              <div className="flex justify-between px-0.5 text-[7px] font-bold h-2">
                <span className="text-amber-400">tan⁻¹</span>
                <span className="text-rose-400">F</span>
              </div>
              <button
                onClick={() => {
                  if (hypActive) insertText('tanh(');
                  else if (shiftActive) insertText('tan⁻¹(');
                  else insertText('tan(');
                }}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                {hypActive ? 'tanh' : shiftActive ? 'tan⁻¹' : 'tan'}
              </button>
            </div>

          </div>

          {/* Row 5: [RCL, ENG, (, ), ,, M+] */}
          <div className="grid grid-cols-6 gap-1 pt-0.5">
            
            {/* RCL / STO */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-amber-400 block h-2">STO</span>
              <button
                onClick={() => shiftActive ? handleMemoryAdd() : handleMemoryRecall()}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                {shiftActive ? 'STO' : 'RCL'}
              </button>
            </div>

            {/* ENG */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-amber-400 block h-2">←</span>
              <button
                onClick={() => {
                  if (isEvaluated && !isNaN(lastAns)) {
                    setResult(lastAns.toExponential(4));
                  }
                }}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                ENG
              </button>
            </div>

            {/* Left Bracket ( */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-rose-400 block h-2">X</span>
              <button
                onClick={() => insertText('(')}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[11px] font-bold border border-slate-700 active:scale-95"
              >
                (
              </button>
            </div>

            {/* Right Bracket ) */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-rose-400 block h-2">Y</span>
              <button
                onClick={() => insertText(')')}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[11px] font-bold border border-slate-700 active:scale-95"
              >
                )
              </button>
            </div>

            {/* Comma , */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-amber-400 block h-2">;</span>
              <button
                onClick={() => insertText(',')}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-slate-100 text-[11px] font-bold border border-slate-700 active:scale-95"
              >
                ,
              </button>
            </div>

            {/* M+ */}
            <div className="text-center">
              <span className="text-[7px] font-bold text-amber-400 block h-2">M-</span>
              <button
                onClick={handleMemoryAdd}
                className="w-full py-1 rounded-md bg-[#252830] hover:bg-[#2d313a] text-amber-300 text-[10px] font-bold border border-slate-700 active:scale-95"
              >
                M+
              </button>
            </div>

          </div>

          {/* ---------------- AUTHENTIC 5x4 NUMERIC KEYPAD (COMPACT) ---------------- */}
          <div className="pt-1 border-t border-slate-800/80 space-y-1">
            
            {/* Number Row 1: [7, 8, 9, DEL, AC] */}
            <div className="grid grid-cols-5 gap-1">
              
              {/* 7 */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">MAT</span>
                <button
                  onClick={() => insertText('7')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#e2e5eb] hover:bg-white text-slate-900 text-sm sm:text-base font-black shadow-xs border border-slate-300 active:scale-95 transition-all"
                >
                  7
                </button>
              </div>

              {/* 8 */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">VCT</span>
                <button
                  onClick={() => insertText('8')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#e2e5eb] hover:bg-white text-slate-900 text-sm sm:text-base font-black shadow-xs border border-slate-300 active:scale-95 transition-all"
                >
                  8
                </button>
              </div>

              {/* 9 */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-cyan-400 block h-2">k</span>
                <button
                  onClick={() => insertText('9')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#e2e5eb] hover:bg-white text-slate-900 text-sm sm:text-base font-black shadow-xs border border-slate-300 active:scale-95 transition-all"
                >
                  9
                </button>
              </div>

              {/* DEL (Coral Red / Pinkish Key) */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">INS</span>
                <button
                  onClick={handleDelete}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#de4350] hover:bg-[#ea525e] text-white text-xs sm:text-sm font-black shadow-xs border border-rose-600 active:scale-95 transition-all"
                >
                  DEL
                </button>
              </div>

              {/* AC (Coral Red / Pinkish Key) */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">OFF</span>
                <button
                  onClick={handleAllClear}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#de4350] hover:bg-[#ea525e] text-white text-xs sm:text-sm font-black shadow-xs border border-rose-600 active:scale-95 transition-all"
                >
                  AC
                </button>
              </div>

            </div>

            {/* Number Row 2: [4, 5, 6, ×, ÷] */}
            <div className="grid grid-cols-5 gap-1">
              
              {/* 4 */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2"></span>
                <button
                  onClick={() => insertText('4')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#e2e5eb] hover:bg-white text-slate-900 text-sm sm:text-base font-black shadow-xs border border-slate-300 active:scale-95 transition-all"
                >
                  4
                </button>
              </div>

              {/* 5 */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2"></span>
                <button
                  onClick={() => insertText('5')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#e2e5eb] hover:bg-white text-slate-900 text-sm sm:text-base font-black shadow-xs border border-slate-300 active:scale-95 transition-all"
                >
                  5
                </button>
              </div>

              {/* 6 */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2"></span>
                <button
                  onClick={() => insertText('6')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#e2e5eb] hover:bg-white text-slate-900 text-sm sm:text-base font-black shadow-xs border border-slate-300 active:scale-95 transition-all"
                >
                  6
                </button>
              </div>

              {/* × Multi (Shift: nPr) */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">nPr</span>
                <button
                  onClick={() => insertText('×')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#373b47] hover:bg-[#414654] text-slate-100 text-sm sm:text-base font-black shadow-xs border border-slate-600 active:scale-95 transition-all"
                >
                  ×
                </button>
              </div>

              {/* ÷ Divide (Shift: nCr) */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">nCr</span>
                <button
                  onClick={() => insertText('÷')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#373b47] hover:bg-[#414654] text-slate-100 text-sm sm:text-base font-black shadow-xs border border-slate-600 active:scale-95 transition-all"
                >
                  ÷
                </button>
              </div>

            </div>

            {/* Number Row 3: [1, 2, 3, +, -] */}
            <div className="grid grid-cols-5 gap-1">
              
              {/* 1 */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">S-SUM</span>
                <button
                  onClick={() => insertText('1')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#e2e5eb] hover:bg-white text-slate-900 text-sm sm:text-base font-black shadow-xs border border-slate-300 active:scale-95 transition-all"
                >
                  1
                </button>
              </div>

              {/* 2 */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">S-VAR</span>
                <button
                  onClick={() => insertText('2')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#e2e5eb] hover:bg-white text-slate-900 text-sm sm:text-base font-black shadow-xs border border-slate-300 active:scale-95 transition-all"
                >
                  2
                </button>
              </div>

              {/* 3 */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">DISTR</span>
                <button
                  onClick={() => insertText('3')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#e2e5eb] hover:bg-white text-slate-900 text-sm sm:text-base font-black shadow-xs border border-slate-300 active:scale-95 transition-all"
                >
                  3
                </button>
              </div>

              {/* + Add (Shift: Pol) */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">Pol</span>
                <button
                  onClick={() => insertText('+')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#373b47] hover:bg-[#414654] text-slate-100 text-sm sm:text-base font-black shadow-xs border border-slate-600 active:scale-95 transition-all"
                >
                  +
                </button>
              </div>

              {/* - Subtract (Shift: Rec) */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">Rec</span>
                <button
                  onClick={() => insertText('-')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#373b47] hover:bg-[#414654] text-slate-100 text-sm sm:text-base font-black shadow-xs border border-slate-600 active:scale-95 transition-all"
                >
                  -
                </button>
              </div>

            </div>

            {/* Number Row 4: [0, ., EXP, Ans, =] */}
            <div className="grid grid-cols-5 gap-1">
              
              {/* 0 */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">Rnd</span>
                <button
                  onClick={() => insertText('0')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#e2e5eb] hover:bg-white text-slate-900 text-sm sm:text-base font-black shadow-xs border border-slate-300 active:scale-95 transition-all"
                >
                  0
                </button>
              </div>

              {/* . (Decimal Point) */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">Ran#</span>
                <button
                  onClick={() => insertText('.')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#e2e5eb] hover:bg-white text-slate-900 text-sm sm:text-base font-black shadow-xs border border-slate-300 active:scale-95 transition-all"
                >
                  .
                </button>
              </div>

              {/* EXP / π */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">π</span>
                <button
                  onClick={() => shiftActive ? insertText('π') : insertText('EXP')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#373b47] hover:bg-[#414654] text-slate-100 text-xs sm:text-sm font-black shadow-xs border border-slate-600 active:scale-95 transition-all"
                >
                  {shiftActive ? 'π' : 'EXP'}
                </button>
              </div>

              {/* Ans (Shift: DRG) */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">DRG</span>
                <button
                  onClick={() => insertText('Ans')}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-[#373b47] hover:bg-[#414654] text-amber-300 text-xs sm:text-sm font-black shadow-xs border border-slate-600 active:scale-95 transition-all"
                >
                  Ans
                </button>
              </div>

              {/* = (Evaluate / Shift: %) */}
              <div className="text-center">
                <span className="text-[7px] font-bold text-amber-400 block h-2">%</span>
                <button
                  onClick={shiftActive ? () => insertText('%') : handleCalculate}
                  className="w-full py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm sm:text-base font-black shadow-md border border-amber-400 active:scale-95 transition-all"
                >
                  =
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ---------------- SCIENTIFIC CONSTANTS MODAL ---------------- */}
      {showConstants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Atom className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">বিজ্ঞান ও গণিতের ধ্রুবক (Constants)</h3>
              </div>
              <button
                onClick={() => setShowConstants(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 py-2">
              যে কোনো ধ্রুবকে ট্যাপ করলে সেটি সরাসরি ক্যালকুলেটরে যুক্ত হবে:
            </p>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {SCIENTIFIC_CONSTANTS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectConstant(c.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800">{c.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">{c.category}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                      {c.value} {c.unit}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    যুক্ত করুন +
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CALCULATION HISTORY MODAL ---------------- */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">হিসাবের হিস্টোরি (History)</h3>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {history.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                এখনো কোনো হিসাব করা হয়নি। ক্যালকুলেশন করলে স্বয়ংক্রিয়ভাবে এখানে জমা হবে।
              </div>
            ) : (
              <div className="overflow-y-auto space-y-2 py-3 pr-1 flex-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-amber-50/60 transition-colors"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs text-slate-600 font-mono truncate">{item.expression}</div>
                      <div className="text-sm font-bold text-slate-900 font-mono">= {item.result}</div>
                    </div>
                    <button
                      onClick={() => {
                        setExpression(item.expression);
                        setCursorPos(item.expression.length);
                        setResult(item.result);
                        setIsEvaluated(true);
                        setShowHistory(false);
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg shrink-0 transition-colors"
                    >
                      ব্যবহার
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem('smartstudy_calc_history');
                  }}
                  className="w-full py-2 text-xs text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition-colors mt-2"
                >
                  সব হিস্টোরি মুছে ফেলুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- MODE SELECTION MODAL ---------------- */}
      {showModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">কোণ মোড নির্বাচন করুন</h3>
              <button onClick={() => setShowModeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 py-3">
              <button
                onClick={() => {
                  setAngleMode('DEG');
                  setShowModeModal(false);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                  angleMode === 'DEG' ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className="block font-black">1. DEG (Degree)</span>
                  <span className="text-[10px] text-slate-500 font-normal">ডিগ্রি ভিত্তিক ত্রিকোণমিতি (এইচএসসি ও এসএসসি)</span>
                </div>
                {angleMode === 'DEG' && <Check className="w-4 h-4 text-amber-600" />}
              </button>

              <button
                onClick={() => {
                  setAngleMode('RAD');
                  setShowModeModal(false);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                  angleMode === 'RAD' ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className="block font-black">2. RAD (Radian)</span>
                  <span className="text-[10px] text-slate-500 font-normal">রেডিয়ান ভিত্তিক গণিত ও পদার্থবিজ্ঞান</span>
                </div>
                {angleMode === 'RAD' && <Check className="w-4 h-4 text-amber-600" />}
              </button>

              <button
                onClick={() => {
                  setAngleMode('GRA');
                  setShowModeModal(false);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                  angleMode === 'GRA' ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className="block font-black">3. GRA (Gradian)</span>
                  <span className="text-[10px] text-slate-500 font-normal">গ্র্যাডিয়ান মান</span>
                </div>
                {angleMode === 'GRA' && <Check className="w-4 h-4 text-amber-600" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- HELP MODAL ---------------- */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Casio fx-570MS ব্যবহারের টিপস</h3>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 py-3 pr-1 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                <span className="font-bold text-amber-900 block mb-0.5">১. SHIFT বাটন:</span>
                হলুদ রঙের SHIFT বাটন চাপলে বাটনের উপরের হলুদ ফাংশনগুলো সক্রিয় হবে (যেমন: sin⁻¹, cos⁻¹, x!, ³√, π ইত্যাদি)।
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 block mb-0.5">২. REPLAY ডিস্ক:</span>
                মাঝের গোল রিকার্সার ডিস্কের বাম (◄) ও ডান (►) বাটনে কার্সর মুভ করা যায়, আর উপর (▲) ও নিচে (▼) বাটনে পূর্ববর্তী হিসাব দেখা যায়।
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 block mb-0.5">৩. ভগ্নাংশ (a b/c):</span>
                হিসাবের পর 'a b/c' চাপলে সাধারণ ভগ্নাংশ (যেমন: 1⌟2) এবং মিশ্র ভগ্নাংশে ফলাফল দেখা যাবে।
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 block mb-0.5">৪. ধ্রুবক (CONST):</span>
                পদার্থ ও রসায়নের প্রয়োজনীয় আলোর বেগ c, প্ল্যাঙ্ক ধ্রুবক h, অভিকর্ষজ ত্বরণ g ইত্যাদি সরাসরি ব্যবহার করতে 'ধ্রুবক' মেনু ব্যবহার করুন।
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
