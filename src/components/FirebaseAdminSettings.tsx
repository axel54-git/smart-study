import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Save, 
  RotateCcw, 
  Code, 
  Key, 
  Database, 
  Globe, 
  ShieldCheck, 
  Info,
  ExternalLink,
  UploadCloud
} from 'lucide-react';
import { 
  firebaseSync, 
  FirebaseConfigType, 
  DEFAULT_FIREBASE_CONFIG, 
  AppSyncData 
} from '../services/firebaseSync';

interface FirebaseAdminSettingsProps {
  currentAllData: AppSyncData;
  onDataSyncSuccess?: (msg: string) => void;
}

export const FirebaseAdminSettings: React.FC<FirebaseAdminSettingsProps> = ({
  currentAllData,
  onDataSyncSuccess
}) => {
  const [config, setConfig] = useState<FirebaseConfigType>(() => firebaseSync.getConfig());
  const [status, setStatus] = useState<{ connected: boolean; lastSync: Date | null; error?: string }>(() => firebaseSync.getStatus());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // JSON Quick Paste modal/toggle
  const [showJsonPaste, setShowJsonPaste] = useState(false);
  const [rawJsonText, setRawJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    const unsub = firebaseSync.onStatusChange(newStatus => {
      setStatus(newStatus);
    });
    return () => unsub();
  }, []);

  const handleInputChange = (field: keyof FirebaseConfigType, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value.trim() }));
  };

  const handleSaveAndReconnect = () => {
    try {
      firebaseSync.reconfigure(config);
      setSyncStatusMsg({
        type: 'success',
        text: '✓ ফায়ারবেস কনফিগারেশন সেভ হয়েছে এবং রিয়েলটাইম সংযোগ স্থাপন করা হয়েছে!'
      });
      if (onDataSyncSuccess) {
        onDataSyncSuccess('ফায়ারবেস কনফিগারেশন আপডেট হয়েছে!');
      }
    } catch (e: any) {
      setSyncStatusMsg({
        type: 'error',
        text: `ত্রুটি: ${e.message || 'সেভ করা সম্ভব হয়নি'}`
      });
    }
  };

  const handleResetToDefault = () => {
    setConfig(DEFAULT_FIREBASE_CONFIG);
    firebaseSync.reconfigure(DEFAULT_FIREBASE_CONFIG);
    setSyncStatusMsg({
      type: 'info',
      text: '✓ ডিফল্ট ফায়ারবেস কনফিগারেশন পুনঃস্থাপন করা হয়েছে।'
    });
  };

  const handleForceUploadAll = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const res = await firebaseSync.syncToCloud(currentAllData);
      if (res.success) {
        setSyncStatusMsg({
          type: 'success',
          text: '✓ সফল হয়েছে! সকল হোম, কোর্স এবং এমসিকিউ কন্টেন্ট ফায়ারবেস ক্লাউডে আপলোড হয়েছে।'
        });
        if (onDataSyncSuccess) {
          onDataSyncSuccess('সব ডাটা ফায়ারবেসে আপলোড সম্পন্ন!');
        }
      } else {
        setSyncStatusMsg({
          type: 'error',
          text: res.message
        });
      }
    } catch (err: any) {
      setSyncStatusMsg({
        type: 'error',
        text: `ত্রুটি: ${err.message || 'ক্লাউড সিঙ্ক ব্যর্থ হয়েছে'}`
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleParseRawJson = () => {
    setJsonError('');
    try {
      let cleaned = rawJsonText.trim();
      // If user pasted "const firebaseConfig = { ... };"
      if (cleaned.includes('{') && cleaned.includes('}')) {
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        cleaned = cleaned.substring(start, end + 1);
      }

      // Convert JS object format to JSON if keys are unquoted
      cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
      // Remove trailing commas
      cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

      const parsed = JSON.parse(cleaned);

      const newConfig: FirebaseConfigType = {
        apiKey: parsed.apiKey || config.apiKey,
        authDomain: parsed.authDomain || config.authDomain,
        databaseURL: parsed.databaseURL || config.databaseURL,
        projectId: parsed.projectId || config.projectId,
        storageBucket: parsed.storageBucket || config.storageBucket,
        messagingSenderId: parsed.messagingSenderId || config.messagingSenderId,
        appId: parsed.appId || config.appId,
        measurementId: parsed.measurementId || config.measurementId
      };

      setConfig(newConfig);
      firebaseSync.reconfigure(newConfig);
      setShowJsonPaste(false);
      setRawJsonText('');
      setSyncStatusMsg({
        type: 'success',
        text: '✓ জেসন কনফিগারেশন সফলভাবে রিকানেক্ট হয়েছে!'
      });
    } catch (err: any) {
      setJsonError('সঠিক ফরম্যাটে JSON বা JS অবজেক্ট পেস্ট করুন। উদাহরণ: { apiKey: "...", ... }');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in text-slate-800">
      
      {/* 1. Header Banner & Live Connection Status */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-4 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base">ফায়ারবেস ক্লাউড সেটিংস</h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                  Realtime Sync
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                ক্লাউডে সরাসরি তথ্য আপলোড ও লাইভ পরিবর্তনের রিয়েলটাইম নিয়ন্ত্রণ
              </p>
            </div>
          </div>

          <button
            onClick={handleForceUploadAll}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-amber-50 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>ক্লাউডে আপলোড হচ্ছে...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
                <span>এখনই সব ক্লাউডে আপলোড</span>
              </>
            )}
          </button>
        </div>

        {/* Live Status Pill */}
        <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${status.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span className="font-bold">
              {status.connected ? 'রিয়েলটাইম ক্লাউড একটিভ' : 'সংযোগ ত্রুটি'}
            </span>
            <span className="text-amber-100 font-mono text-[11px]">
              (প্রজেক্ট: {config.projectId || 'himrw-fae65'})
            </span>
          </div>

          <div className="text-[11px] text-amber-100">
            {status.lastSync 
              ? `সর্বশেষ সিঙ্ক: ${new Date(status.lastSync).toLocaleTimeString('bn-BD')}`
              : 'সিঙ্ক করার জন্য প্রস্তুত'}
          </div>
        </div>
      </div>

      {/* Sync Status Alert Message */}
      {syncStatusMsg && (
        <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs ${
          syncStatusMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : syncStatusMsg.type === 'error'
            ? 'bg-rose-50 text-rose-800 border border-rose-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {syncStatusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{syncStatusMsg.text}</span>
        </div>
      )}

      {/* 2. Realtime Behavior Overview Card */}
      <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>রিয়েলটাইম সিঙ্ক কীভাবে কাজ করে?</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-800">
          • এডমিন প্যানেলে যেকোনো ক্লাস, বিষয়, অধ্যায়, ভিডিও কিংবা এমসিকিউ <strong>যোগ, এডিট বা ডিলিট</strong> করলে তা সাথে সাথে এই ফায়ারবেস ক্লাউডে পুশ হয়ে যায়।<br />
          • ইউজার প্যানেলের সকল শিক্ষার্থী অবিলম্বে নতুন কন্টেন্ট দেখতে পাবে এবং ডিলিট করা কন্টেন্ট ইউজারদের স্ক্রিন থেকে <strong>সাথে সাথে মুছে যাবে</strong>।
        </p>
      </div>

      {/* 3. Editable Firebase Configuration Form */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">ফায়ারবেস কনফিগারেশন পরিবর্তন</h3>
            <p className="text-[11px] text-slate-500">ভবিষ্যতে প্রোজেক্ট বা ডেটাবেস পরিবর্তন করতে চাইলে এখানে এডিট করুন</p>
          </div>

          <button
            onClick={() => setShowJsonPaste(!showJsonPaste)}
            className="px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 flex items-center gap-1 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showJsonPaste ? 'ফরম ভিউ' : 'জেসন পেস্ট করুন'}</span>
          </button>
        </div>

        {/* JSON Direct Paste Mode */}
        {showJsonPaste ? (
          <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700">
              ফায়ারবেস কোড অবজেক্ট সরাসরি পেস্ট করুন:
            </label>
            <textarea
              rows={7}
              value={rawJsonText}
              onChange={e => setRawJsonText(e.target.value)}
              placeholder={`const firebaseConfig = {\n  apiKey: "...",\n  authDomain: "...",\n  databaseURL: "...",\n  projectId: "..."\n};`}
              className="w-full text-xs font-mono p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {jsonError && (
              <p className="text-xs font-bold text-rose-600">{jsonError}</p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowJsonPaste(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                বাতিল
              </button>
              <button
                onClick={handleParseRawJson}
                className="px-4 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-xs flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>কনফিগ প্রয়োগ করুন</span>
              </button>
            </div>
          </div>
        ) : (
          /* Form Input Fields */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Key className="w-3 h-3 text-amber-600" />
                <span>API Key</span>
              </label>
              <input
                type="text"
                value={config.apiKey}
                onChange={e => handleInputChange('apiKey', e.target.value)}
                className="w-full font-mono text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Globe className="w-3 h-3 text-amber-600" />
                <span>Auth Domain</span>
              </label>
              <input
                type="text"
                value={config.authDomain}
                onChange={e => handleInputChange('authDomain', e.target.value)}
                className="w-full font-mono text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Database className="w-3 h-3 text-amber-600" />
                <span>Realtime Database URL (rtdb)</span>
              </label>
              <input
                type="text"
                value={config.databaseURL}
                onChange={e => handleInputChange('databaseURL', e.target.value)}
                placeholder="https://your-app-default-rtdb.firebaseio.com"
                className="w-full font-mono text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <span>Project ID</span>
              </label>
              <input
                type="text"
                value={config.projectId}
                onChange={e => handleInputChange('projectId', e.target.value)}
                className="w-full font-mono text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <span>Storage Bucket</span>
              </label>
              <input
                type="text"
                value={config.storageBucket}
                onChange={e => handleInputChange('storageBucket', e.target.value)}
                className="w-full font-mono text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <span>Messaging Sender ID</span>
              </label>
              <input
                type="text"
                value={config.messagingSenderId}
                onChange={e => handleInputChange('messagingSenderId', e.target.value)}
                className="w-full font-mono text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <span>App ID</span>
              </label>
              <input
                type="text"
                value={config.appId}
                onChange={e => handleInputChange('appId', e.target.value)}
                className="w-full font-mono text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <span>Measurement ID</span>
              </label>
              <input
                type="text"
                value={config.measurementId}
                onChange={e => handleInputChange('measurementId', e.target.value)}
                className="w-full font-mono text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleResetToDefault}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 transition-all"
            title="ডিফল্ট প্রদত্ত তথ্যে ফিরিয়ে নিন"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>ডিফল্ট কনফিগ রিস্টোর</span>
          </button>

          <button
            onClick={handleSaveAndReconnect}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>সেভ ও রিকানেক্ট করুন</span>
          </button>
        </div>
      </div>

      {/* 4. Firebase Database Rules Quick Help */}
      <div className="bg-slate-100 rounded-2xl p-3.5 text-xs text-slate-600 space-y-1.5 border border-slate-200">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>ফায়ারবেস কনসোল রুলস পরামর্শ (Firebase Security Rules):</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600">
          রিয়েলটাইম ডেটাবেসে এডমিন ও ইউজারদের তাৎক্ষণিক এক্সেস নিশ্চিত করতে আপনার Firebase Console &gt; Realtime Database &gt; Rules-এ <code>{`{ "rules": { ".read": true, ".write": true } }`}</code> সেট করা থাকতে পারে। যদি কোনো কারণে ক্লাউড অফলাইন থাকে, তবে আমাদের অ্যাপ নিরবচ্ছিন্নভাবে লোকাল মেমোরি থেকে সম্পূর্ণ ডাটা ইউজারদের দেখাবে।
        </p>
      </div>

    </div>
  );
};
