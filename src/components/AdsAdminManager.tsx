import React, { useState } from 'react';
import { 
  Megaphone, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  Code, 
  Sparkles, 
  Layers, 
  Check, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AdsSystemConfig, DEFAULT_ADS_CONFIG } from '../data/adsConfig';
import { BannerAd } from './BannerAd';

interface AdsAdminManagerProps {
  adsConfig: AdsSystemConfig;
  onSaveAds: (config: AdsSystemConfig) => void;
  onTriggerToast: (msg: string) => void;
}

export const AdsAdminManager: React.FC<AdsAdminManagerProps> = ({
  adsConfig,
  onSaveAds,
  onTriggerToast
}) => {
  const [config, setConfig] = useState<AdsSystemConfig>(adsConfig);
  const [activeTab, setActiveTab] = useState<'red' | 'green' | 'social'>('red');
  const [pasteCodeInput, setPasteCodeInput] = useState('');

  // Auto-parse helper for ad network script tags
  const handleParseScript = (target: 'red' | 'green' | 'social') => {
    if (!pasteCodeInput.trim()) {
      onTriggerToast('অনুগ্রহ করে স্ক্রিপ্ট কোড পেস্ট করুন!');
      return;
    }

    try {
      const text = pasteCodeInput;

      // Extract key: 'key' : 'xyz' or key: "xyz" or /14/xyz or /22/xyz
      const keyMatch = text.match(/['"]key['"]\s*:\s*['"]([a-zA-Z0-9_-]+)['"]/) ||
        text.match(/\/(?:14|22)\/([a-zA-Z0-9_-]+)/);
      // Extract width: 'width' : 300
      const widthMatch = text.match(/['"]width['"]\s*:\s*(\d+)/);
      // Extract height: 'height' : 250
      const heightMatch = text.match(/['"]height['"]\s*:\s*(\d+)/);
      // Extract format: 'format' : 'iframe'
      const formatMatch = text.match(/['"]format['"]\s*:\s*['"]([a-zA-Z0-9_-]+)['"]/);
      // Extract script src: src="https://..."
      const srcMatch = text.match(/src=['"]([^'"]+)['"]/);

      const parsedKey = keyMatch ? keyMatch[1] : '';
      const parsedWidth = widthMatch ? parseInt(widthMatch[1], 10) : (target === 'red' ? 400 : target === 'green' ? 300 : 0);
      const parsedHeight = heightMatch ? parseInt(heightMatch[1], 10) : (target === 'red' ? 60 : target === 'green' ? 250 : 0);
      const parsedFormat = formatMatch ? formatMatch[1] : (target === 'social' ? 'social_bar' : 'iframe');
      const parsedSrc = srcMatch ? srcMatch[1] : '';

      setConfig(prev => {
        const next = { ...prev };
        if (target === 'social') {
          next.socialBar = {
            id: 'social_bar',
            name: 'পপ আপ নোটিফিকেশন অ্যাড (শুধু ক্লাস লেকচার পেজে)',
            key: parsedKey || next.socialBar?.key || 'd5971812e8228bafc23fefa5e2dcedb5',
            width: 0,
            height: 0,
            format: 'social_bar',
            scriptUrl: parsedSrc || next.socialBar?.scriptUrl || 'https://bauval.org/14/d5971812e8228bafc23fefa5e2dcedb5',
            enabled: true,
            customCode: text.trim()
          };
        } else {
          const bannerKey = target === 'red' ? 'redBanner' : 'greenBanner';
          next[bannerKey] = {
            ...next[bannerKey],
            key: parsedKey || next[bannerKey].key,
            width: parsedWidth || next[bannerKey].width,
            height: parsedHeight || next[bannerKey].height,
            format: parsedFormat || next[bannerKey].format,
            scriptUrl: parsedSrc || next[bannerKey].scriptUrl,
            customCode: text.trim()
          };
        }
        return next;
      });

      onTriggerToast('✓ স্ক্রিপ্ট কোড থেকে অ্যাড সেটিংস সফলভাবে সনাক্ত করা হয়েছে!');
      setPasteCodeInput('');
    } catch (e) {
      console.error(e);
      onTriggerToast('স্ক্রিপ্ট পার্স করতে সমস্যা হয়েছে। সরাসরি নিচে তথ্য লিখুন।');
    }
  };

  const handleSave = () => {
    onSaveAds(config);
    onTriggerToast('✓ বিজ্ঞাপন সেটিংস সংরক্ষিত ও ফায়ারবেসে ক্লাউড সিঙ্ক হয়েছে!');
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_ADS_CONFIG);
    onSaveAds(DEFAULT_ADS_CONFIG);
    onTriggerToast('✓ বিজ্ঞাপন সেটিংস ডিফল্ট কোডে রিসেট করা হয়েছে!');
  };

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-4 sm:p-5 text-white shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black leading-tight">অ্যাড ম্যানেজমেন্ট সিস্টেম</h2>
              <p className="text-xs text-amber-100">ফায়ারবেস ক্লাউডের সাথে রিয়েলটাইম যুক্ত ব্যানার নিয়ন্ত্রণ</p>
            </div>
          </div>

          {/* Master Switch */}
          <button
            onClick={() => setConfig(prev => ({ ...prev, globalEnabled: !prev.globalEnabled }))}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              config.globalEnabled 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' 
                : 'bg-rose-500/80 text-white hover:bg-rose-600'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{config.globalEnabled ? 'বিজ্ঞাপন সক্রিয়' : 'সব বন্ধ'}</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher: Red Banner vs Green Banner vs Social Bar */}
      <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-2xl text-[11px] sm:text-xs font-bold">
        <button
          onClick={() => setActiveTab('red')}
          className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
            activeTab === 'red'
              ? 'bg-white text-rose-700 shadow-xs border border-rose-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span className="truncate">১. লাল ব্যানার</span>
        </button>

        <button
          onClick={() => setActiveTab('green')}
          className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
            activeTab === 'green'
              ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="truncate">২. সবুজ ব্যানার</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
            activeTab === 'social'
              ? 'bg-white text-blue-700 shadow-xs border border-blue-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <span className="truncate">৩. পপ আপ নোটিফিকেশন</span>
        </button>
      </div>

      {/* RED BANNER CONFIGURATION */}
      {activeTab === 'red' && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
                  লাল দাগ ব্যানার অ্যাড (ইন-ফিড ব্যানার)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                শ্রেণি কার্ডের মাঝে, অধ্যায় তালিকার মাঝে, ভিডিও লেকচারের মাঝে এবং ভিডিও প্লেয়ারের উপরে ও মাঝে দেখাবে।
              </p>
            </div>

            {/* Toggle Status */}
            <button
              onClick={() => setConfig(prev => ({
                ...prev,
                redBanner: { ...prev.redBanner, enabled: !prev.redBanner.enabled }
              }))}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 ${
                config.redBanner.enabled 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{config.redBanner.enabled ? 'চালু আছে' : 'বন্ধ'}</span>
            </button>
          </div>

          {/* Quick Paste & Auto Parse Box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 space-y-2">
            <label className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>নতুন স্ক্রিপ্ট কোড পেস্ট করুন (এক ক্লিকে অটো-ফিল):</span>
            </label>
            <textarea
              rows={3}
              value={pasteCodeInput}
              onChange={e => setPasteCodeInput(e.target.value)}
              placeholder="<script> atOptions = { 'key' : '...', 'height' : 60, 'width' : 468 ... }; </script> <script src='...'></script>"
              className="w-full p-2.5 rounded-xl border border-amber-200 font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={() => handleParseScript('red')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs active:scale-95"
            >
              <Code className="w-3.5 h-3.5" />
              <span>কোড অটো-পার্স ও আপডেট করুন</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Ad Key (কী):</label>
              <input
                type="text"
                value={config.redBanner.key}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  redBanner: { ...prev.redBanner, key: e.target.value }
                }))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                placeholder="5febadcb47e71b73b1202fd206a76c5c"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Script URL (স্ক্রিপ্ট লিংক):</label>
              <input
                type="text"
                value={config.redBanner.scriptUrl}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  redBanner: { ...prev.redBanner, scriptUrl: e.target.value }
                }))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                placeholder="https://bauval.org/22/5febadcb47e71b73b1202fd206a76c5c"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Width (প্রস্থ):</label>
                <input
                  type="number"
                  value={config.redBanner.width}
                  onChange={e => setConfig(prev => ({
                    ...prev,
                    redBanner: { ...prev.redBanner, width: parseInt(e.target.value, 10) || 400 }
                  }))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Height (উচ্চতা):</label>
                <input
                  type="number"
                  value={config.redBanner.height}
                  onChange={e => setConfig(prev => ({
                    ...prev,
                    redBanner: { ...prev.redBanner, height: parseInt(e.target.value, 10) || 60 }
                  }))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Format (ফরম্যাট):</label>
              <input
                type="text"
                value={config.redBanner.format}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  redBanner: { ...prev.redBanner, format: e.target.value }
                }))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                placeholder="iframe"
              />
            </div>
          </div>

          {/* Custom HTML/Script Override */}
          <div className="text-xs">
            <label className="font-bold text-slate-700 block mb-1">
              কাস্টম HTML/স্ক্রিপ্ট কোড (ঐচ্ছিক):
            </label>
            <textarea
              rows={3}
              value={config.redBanner.customCode || ''}
              onChange={e => setConfig(prev => ({
                ...prev,
                redBanner: { ...prev.redBanner, customCode: e.target.value }
              }))}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] bg-slate-50"
              placeholder="আপনি চাইলে এখানে সরাসরি সম্পূর্ণ কাস্টম কোড রাখতে পারেন..."
            />
          </div>

          {/* Live Preview */}
          <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>লাইভ প্রিভিউ (৪০০×৬০):</span>
              </span>
              <span className="text-[10px] text-slate-400">রিসপনসিভ স্কেলিং সক্রিয়</span>
            </div>
            <BannerAd type="red" config={config.redBanner} label="লাল দাগ ব্যানার প্রিভিউ" />
          </div>
        </div>
      )}

      {/* GREEN BANNER CONFIGURATION */}
      {activeTab === 'green' && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
                  সবুজ দাগ ব্যানার অ্যাড (বটম লার্জ ব্যানার)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                একক ভিডিও প্লেয়ার পেজের একদম নিচে (নেভিগেশনের ঠিক ওপরে) দেখাবে।
              </p>
            </div>

            {/* Toggle Status */}
            <button
              onClick={() => setConfig(prev => ({
                ...prev,
                greenBanner: { ...prev.greenBanner, enabled: !prev.greenBanner.enabled }
              }))}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 ${
                config.greenBanner.enabled 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{config.greenBanner.enabled ? 'চালু আছে' : 'বন্ধ'}</span>
            </button>
          </div>

          {/* Quick Paste & Auto Parse Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 space-y-2">
            <label className="text-xs font-bold text-emerald-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>নতুন স্ক্রিপ্ট কোড পেস্ট করুন (এক ক্লিকে অটো-ফিল):</span>
            </label>
            <textarea
              rows={3}
              value={pasteCodeInput}
              onChange={e => setPasteCodeInput(e.target.value)}
              placeholder="<script> atOptions = { 'key' : '...', 'height' : 250, 'width' : 300 ... }; </script> <script src='...'></script>"
              className="w-full p-2.5 rounded-xl border border-emerald-200 font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleParseScript('green')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs active:scale-95"
            >
              <Code className="w-3.5 h-3.5" />
              <span>কোড অটো-পার্স ও আপডেট করুন</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Ad Key (কী):</label>
              <input
                type="text"
                value={config.greenBanner.key}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  greenBanner: { ...prev.greenBanner, key: e.target.value }
                }))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                placeholder="911ee250303f0d466e6e2cab58b077e0"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Script URL (স্ক্রিপ্ট লিংক):</label>
              <input
                type="text"
                value={config.greenBanner.scriptUrl}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  greenBanner: { ...prev.greenBanner, scriptUrl: e.target.value }
                }))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                placeholder="https://bauval.org/22/911ee250303f0d466e6e2cab58b077e0"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Width (প্রস্থ):</label>
                <input
                  type="number"
                  value={config.greenBanner.width}
                  onChange={e => setConfig(prev => ({
                    ...prev,
                    greenBanner: { ...prev.greenBanner, width: parseInt(e.target.value, 10) || 300 }
                  }))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Height (উচ্চতা):</label>
                <input
                  type="number"
                  value={config.greenBanner.height}
                  onChange={e => setConfig(prev => ({
                    ...prev,
                    greenBanner: { ...prev.greenBanner, height: parseInt(e.target.value, 10) || 250 }
                  }))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Format (ফরম্যাট):</label>
              <input
                type="text"
                value={config.greenBanner.format}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  greenBanner: { ...prev.greenBanner, format: e.target.value }
                }))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                placeholder="iframe"
              />
            </div>
          </div>

          {/* Custom HTML/Script Override */}
          <div className="text-xs">
            <label className="font-bold text-slate-700 block mb-1">
              কাস্টম HTML/স্ক্রিপ্ট কোড (ঐচ্ছিক):
            </label>
            <textarea
              rows={3}
              value={config.greenBanner.customCode || ''}
              onChange={e => setConfig(prev => ({
                ...prev,
                greenBanner: { ...prev.greenBanner, customCode: e.target.value }
              }))}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] bg-slate-50"
              placeholder="সরাসরি কোড এখানে রাখতে পারেন..."
            />
          </div>

          {/* Live Preview */}
          <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>লাইভ প্রিভিউ (৩০০×২৫০):</span>
              </span>
              <span className="text-[10px] text-slate-400">মিডিয়াম রেকটেঙ্গেল</span>
            </div>
            <BannerAd type="green" config={config.greenBanner} label="সবুজ দাগ ব্যানার প্রিভিউ" />
          </div>
        </div>
      )}

      {/* SOCIAL BAR / POP-UP NOTIFICATION CONFIGURATION */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
                  পপ আপ নোটিফিকেশন অ্যাড (সোশ্যাল বার)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                শুধুমাত্র ক্লাস লেকচার পেজে সক্রিয় হবে এবং অ্যাপ হেডারের নিচে (সবুজ দাগের নিচে) প্রদর্শিত হবে।
              </p>
            </div>

            {/* Toggle Status */}
            <button
              onClick={() => setConfig(prev => ({
                ...prev,
                socialBar: { 
                  ...prev.socialBar, 
                  id: 'social_bar',
                  name: 'পপ আপ নোটিফিকেশন অ্যাড (শুধু ক্লাস লেকচার পেজে)',
                  key: prev.socialBar?.key || 'd5971812e8228bafc23fefa5e2dcedb5',
                  width: 0,
                  height: 0,
                  format: 'social_bar',
                  scriptUrl: prev.socialBar?.scriptUrl || 'https://bauval.org/14/d5971812e8228bafc23fefa5e2dcedb5',
                  enabled: !(prev.socialBar?.enabled ?? true) 
                }
              }))}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 ${
                (config.socialBar?.enabled ?? true)
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{(config.socialBar?.enabled ?? true) ? 'চালু আছে' : 'বন্ধ'}</span>
            </button>
          </div>

          {/* Quick Paste & Auto Parse Box */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3 space-y-2">
            <label className="text-xs font-bold text-blue-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>সোশ্যাল বার স্ক্রিপ্ট কোড পেস্ট করুন:</span>
            </label>
            <textarea
              rows={3}
              value={pasteCodeInput}
              onChange={e => setPasteCodeInput(e.target.value)}
              placeholder='<script data-cfasync="false" src="https://bauval.org/14/d5971812e8228bafc23fefa5e2dcedb5"></script>'
              className="w-full p-2.5 rounded-xl border border-blue-200 font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleParseScript('social')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs active:scale-95"
            >
              <Code className="w-3.5 h-3.5" />
              <span>কোড অটো-পার্স ও আপডেট করুন</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Zone Key (কী):</label>
              <input
                type="text"
                value={config.socialBar?.key || 'd5971812e8228bafc23fefa5e2dcedb5'}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  socialBar: {
                    ...prev.socialBar,
                    id: 'social_bar',
                    name: 'পপ আপ নোটিফিকেশন অ্যাড (শুধু ক্লাস লেকচার পেজে)',
                    width: 0,
                    height: 0,
                    format: 'social_bar',
                    enabled: prev.socialBar?.enabled ?? true,
                    scriptUrl: prev.socialBar?.scriptUrl || 'https://bauval.org/14/d5971812e8228bafc23fefa5e2dcedb5',
                    key: e.target.value
                  }
                }))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                placeholder="d5971812e8228bafc23fefa5e2dcedb5"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Script URL:</label>
              <input
                type="text"
                value={config.socialBar?.scriptUrl || 'https://bauval.org/14/d5971812e8228bafc23fefa5e2dcedb5'}
                onChange={e => setConfig(prev => ({
                  ...prev,
                  socialBar: {
                    ...prev.socialBar,
                    id: 'social_bar',
                    name: 'পপ আপ নোটিফিকেশন অ্যাড (শুধু ক্লাস লেকচার পেজে)',
                    width: 0,
                    height: 0,
                    format: 'social_bar',
                    enabled: prev.socialBar?.enabled ?? true,
                    key: prev.socialBar?.key || 'd5971812e8228bafc23fefa5e2dcedb5',
                    scriptUrl: e.target.value
                  }
                }))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                placeholder="https://bauval.org/14/d5971812e8228bafc23fefa5e2dcedb5"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">📌 বিশেষ নির্দেশনাবলী:</p>
            <p>• এই সোশ্যাল বার নোটিফিকেশনটি ব্যবহারকারী যখন কোনো অধ্যায়ের <strong>ক্লাস লেকচারসমূহ</strong> পেজে থাকবেন কেবল তখনই লোড হবে।</p>
            <p>• ব্যবহারকারী অন্য কোনো পেজে ব্যাক করলে স্ক্রিপ্ট এবং পপ-আপ সাথে সাথে নিজে থেকেই রিমুভ হয়ে যাবে।</p>
            <p>• নোটিফিকেশন কখনই অ্যাপের ব্যাক বাটন বা লোগো ঢেকে ফেলবে না; হেডারের ঠিক নিচে অবস্থান করবে।</p>
          </div>
        </div>
      )}

      {/* Action Buttons: Save & Reset */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={handleResetDefaults}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ডিফল্ট কোডে রিসেট</span>
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>সেভ ও ফায়ারবেসে ক্লাউড সিঙ্ক</span>
        </button>
      </div>
    </div>
  );
};
