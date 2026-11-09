import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Sparkles, RotateCcw, Copy, Check, BookOpen, Award, GraduationCap } from 'lucide-react';
import { ChapterItem, ClassCategory, SubjectItem } from '../data/hierarchyData';
import { BannerAd } from './BannerAd';
import { AdsSystemConfig } from '../data/adsConfig';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface SmartStudyAIChatProps {
  classes: ClassCategory[];
  subjects: SubjectItem[];
  chapters: ChapterItem[];
  adsConfig?: AdsSystemConfig;
  onNavigateHome?: () => void;
}

// Cute Robot Mascot Matching Screenshot
export const CuteRobotMascot: React.FC<{ className?: string; size?: number }> = ({ className = 'w-16 h-16', size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Antennas */}
    <circle cx="36" cy="15" r="4.5" fill="currentColor" />
    <path d="M36 15 L42 27" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="64" cy="15" r="4.5" fill="currentColor" />
    <path d="M64 15 L58 27" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />

    {/* Side Earphone / Ear Pieces */}
    <rect x="17" y="42" width="7" height="18" rx="3.5" fill="currentColor" />
    <rect x="76" y="42" width="7" height="18" rx="3.5" fill="currentColor" />

    {/* Robot Head Bubble Body */}
    <path
      d="M50 25 C30 25 22 36 22 52 C22 67 31 77 42 77 L37 86 C36 88 38 90 40 89 L51 81 C68 81 78 69 78 52 C78 36 68 25 50 25 Z"
      fill="currentColor"
    />

    {/* Inner Screen Face */}
    <rect x="29" y="37" width="42" height="30" rx="9" fill="white" />

    {/* Smiling Curved Eyes (Arch shape) */}
    <path d="M36 50 Q41 42 46 50" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M54 50 Q59 42 64 50" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />

    {/* Cute Smile */}
    <path d="M47 57 Q50 60 53 57" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const SmartStudyAIChat: React.FC<SmartStudyAIChatProps> = ({
  classes,
  subjects,
  chapters,
  adsConfig,
  onNavigateHome
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `Hello! 👋\nI'm **SmartStudy AI**.\nHow can I help you today?`,
      timestamp: 'এইমাত্র'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setShowQuickMenu(false);
    setIsLoading(true);

    try {
      // Build history payload
      const historyPayload = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload
        })
      });

      const data = await res.json();
      const replyText = data.reply || data.error || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।';

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: '🎉 **SmartStudy AI:**\n\nদুঃখিত, সংযোগে সাময়িক বিলম্ব হচ্ছে। SmartStudy প্ল্যাটফর্মে আপনার পাঠ্যবইয়ের বাংলা, ইংরেজি, গণিত ও আইসিটির যাবতীয় প্রশ্ন সমাধান এবং এইচএসসি ও এসএসসি মেগা স্কলারশিপ টেস্টের বিস্তারিত তথ্য সংরক্ষিত রয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-1',
        role: 'assistant',
        text: `Hello! 👋\nI'm **SmartStudy AI**.\nHow can I help you today?`,
        timestamp: 'এইমাত্র'
      }
    ]);
    setShowQuickMenu(false);
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in relative pb-16 pt-1">
      {/* Robot Mascot Emoji (রোবট ইমোজি - বড় ও দৃষ্টিনন্দন) */}
      <div className="flex items-center justify-center pt-2 pb-3 text-slate-900 transition-all duration-300 hover:scale-105">
        <CuteRobotMascot className="w-24 h-24 sm:w-28 sm:h-28 text-slate-950 drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]" />
      </div>

      {/* 2. CHAT FEED CONTAINER */}
      <div className="w-full max-w-md space-y-4 px-1">
        
        {/* Messages Stream */}
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          
          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end animate-fade-in">
                <div className="max-w-[85%] bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3.5 rounded-2xl rounded-tr-xs shadow-md shadow-amber-500/10">
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-[10px] text-amber-100/90 font-mono block text-right mt-1.5">{msg.timestamp}</span>
                </div>
              </div>
            );
          }

          // Welcome Greeting / Assistant Card (Styled like Screenshot)
          if (index === 0) {
            return (
              <React.Fragment key={msg.id}>
                <div 
                  className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/90 flex items-start gap-3.5 transition-all animate-fade-in hover:shadow-md"
                >
                {/* Robot Circle Avatar */}
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-900 shadow-inner">
                  <CuteRobotMascot className="w-8 h-8 text-slate-900" />
                </div>

                {/* Greeting Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                    Hello! <span className="text-xl">👋</span>
                  </h3>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    I'm <span className="text-amber-600">SmartStudy AI</span>.
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    How can I help you today?
                  </p>
                </div>
              </div>

              {/* লাল দাগ ব্যানার অ্যাড (ওয়েলকাম বার্তার নিচে) */}
              <BannerAd type="red" config={adsConfig?.redBanner} />
              </React.Fragment>
            );
          }

          // Regular AI Answer Message Card
          return (
            <div key={msg.id} className="flex items-start gap-2.5 animate-fade-in">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                <CuteRobotMascot className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 bg-white rounded-2xl rounded-tl-xs p-4 shadow-sm border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-100">
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> SmartStudy AI
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="hover:text-slate-700 transition-colors flex items-center gap-1"
                      title="কপি করুন"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-[10px] text-emerald-600 font-bold">কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">কপি</span>
                        </>
                      )}
                    </button>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {/* Formatted Markdown Content */}
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator Matching Screenshot */}
        {isLoading && (
          <div className="flex items-start gap-2.5 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse border border-slate-700/50">
              <CuteRobotMascot className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs border border-slate-200/90 flex items-center gap-2.5">
              <div className="flex gap-1.5 py-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-700 font-bold tracking-wide">
                Typing...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. BOTTOM FLOATING INPUT BAR (Styled exactly like the screenshot capsule input) */}
      <div className="w-full max-w-md px-2 mt-4 sticky bottom-16 z-30">
        
        {/* Quick Menu Popover (when '+' is clicked) */}
        {showQuickMenu && (
          <div className="mb-2 bg-white rounded-2xl p-3 shadow-xl border border-slate-200 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> এআই স্টাডি অ্যাকশন
              </span>
              <button
                onClick={handleResetChat}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> নতুন চ্যাট শুরু করুন
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  handleSend('এইচএসসি ও এসএসসি মেগা স্কলারশিপ টেস্ট ২০২৬ পুরস্কার ও অংশগ্রহণের নিয়মাবলী বিস্তারিত বলো।');
                }}
                className="text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-[11px] font-semibold text-slate-700 hover:text-amber-900 border border-slate-100"
              >
                🏆 স্কলারশিপ ও পুরস্কার
              </button>
              <button
                onClick={() => {
                  handleSend('বাংলা ১ম পত্রের অপরিচিতা গল্পের অনুপমের চরিত্র বিশ্লেষণ করো।');
                }}
                className="text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-[11px] font-semibold text-slate-700 hover:text-amber-900 border border-slate-100"
              >
                📖 অপরিচিতা বিশ্লেষণ
              </button>
              <button
                onClick={() => {
                  handleSend('সি প্রোগ্রামিংয়ে লুপ (for, while) কিভাবে কাজ করে কোড উদাহরণসহ বুঝিয়ে দাও।');
                }}
                className="text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-[11px] font-semibold text-slate-700 hover:text-amber-900 border border-slate-100"
              >
                💻 সি প্রোগ্রামিং লুপ
              </button>
              <button
                onClick={() => {
                  handleSend('এইচএসসি বা এসএসসির সাধারণ গণিতের ত্রিকোণমিতি সূত্রাবলি একনজরে লিখে দাও।');
                }}
                className="text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-[11px] font-semibold text-slate-700 hover:text-amber-900 border border-slate-100"
              >
                📐 ত্রিকোণমিতি সূত্র
              </button>
            </div>
          </div>
        )}

        {/* Floating Input Capsule Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="bg-white/95 backdrop-blur-md rounded-full shadow-[0_6px_25px_rgba(0,0,0,0.12)] border border-slate-200/90 p-1.5 pl-2 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-amber-500/40 focus-within:border-amber-400"
        >
          {/* Plus Button on Left */}
          <button
            type="button"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all shrink-0"
            title="মেনু ও টপিক সাজেশন"
          >
            <Plus className={`w-5 h-5 stroke-[2.5] transition-transform ${showQuickMenu ? 'rotate-45 text-rose-500' : ''}`} />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none px-1"
          />

          {/* Send Button on Right (Black circle with paper airplane icon) */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
              input.trim() && !isLoading
                ? 'bg-slate-950 text-white shadow-md hover:bg-slate-800 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="পাঠান"
          >
            <Send className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
