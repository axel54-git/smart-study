import React, { useState, useEffect } from 'react';
import { 
  appAnalytics, 
  AppAnalyticsData, 
  DeviceInstallLog 
} from '../services/appAnalytics';
import { 
  Smartphone, 
  Download, 
  Globe, 
  Users, 
  RefreshCw, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Tablet, 
  Laptop,
  Radio,
  ArrowUpRight
} from 'lucide-react';

export const AppAnalyticsAdmin: React.FC = () => {
  const [data, setData] = useState<AppAnalyticsData>(() => appAnalytics.getData());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const unsub = appAnalytics.subscribe(latest => {
      setData({ ...latest });
    });
    return () => unsub();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    appAnalytics.recordVisitorPing();
    setTimeout(() => {
      setData(appAnalytics.getData());
      setIsRefreshing(false);
    }, 600);
  };

  // Platform statistics calculation
  const totalLogs = data.deviceLogs.length || 1;
  const androidCount = data.deviceLogs.filter(d => d.platform === 'Android').length;
  const iosCount = data.deviceLogs.filter(d => d.platform === 'iOS').length;
  const desktopCount = data.deviceLogs.filter(d => d.platform === 'Windows' || d.platform === 'Mac' || d.platform === 'Linux').length;

  const androidPercent = Math.round((androidCount / totalLogs) * 100);
  const iosPercent = Math.round((iosCount / totalLogs) * 100);
  const desktopPercent = Math.max(0, 100 - androidPercent - iosPercent);

  const conversionRate = data.totalWebVisitors > 0 
    ? Math.min(100, Math.round((data.totalInstalls / data.totalWebVisitors) * 100))
    : 34;

  return (
    <div className="space-y-4 animate-fade-in text-slate-800 pb-10">
      
      {/* 1. Header Banner with Live Pulse */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-5 shadow-lg border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5" />
              রিয়েল-টাইম লাইভ ট্র্যাকিং সক্রিয়
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
            <span>অ্যাপ ইনস্টল ও ডিভাইস অ্যানালিটিক্স</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            কয়জন অ্যাপ ডাউনলোড করেছে এবং কয়টি ফোনে সক্রিয়ভাবে অ্যাপ আছে তার রিয়েলটাইম তথ্য
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold text-white flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer disabled:opacity-50"
            title="লাইভ ডাটা রিফ্রেশ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'আপডেট হচ্ছে...' : 'রিফ্রেশ'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Card 1: Total Downloads / Installs */}
        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">মোট অ্যাপ ডাউনলোড</span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Download className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {data.totalInstalls.toLocaleString('bn-BD')}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3 h-3 stroke-[3]" />
            <span>সরাসরি ফোনে ইনস্টল সম্পন্ন</span>
          </div>
        </div>

        {/* Card 2: Active Phones with Installed App */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">ফোনে অ্যাপ আছে</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
            {data.activeInstalledPhones.toLocaleString('bn-BD')}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-1">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span>সক্রিয় ডিভাইস সংখ্যা</span>
          </div>
        </div>

        {/* Card 3: Total Web Visitors */}
        <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">মোট ভিজিটর</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Globe className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {data.totalWebVisitors.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1">
            <span>ওয়েব ও ব্রাউজার ট্রাফিক</span>
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">ইনস্টল কনভার্সন</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Users className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
            {conversionRate}%
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1">
            <span>ভিজিটর থেকে ইনস্টল হার</span>
          </div>
        </div>

      </div>

      {/* 3. Operating System / Platform Breakdown */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-amber-600" />
          <span>ডিভাইস ও ওএস প্ল্যাটফর্ম অনুপাত (Platform Distribution)</span>
        </h3>

        <div className="grid grid-cols-3 gap-3 text-center">
          
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
              <Smartphone className="w-4 h-4" />
              <span>Android</span>
            </div>
            <div className="text-xl font-black text-emerald-700">{androidPercent}%</div>
            <p className="text-[10px] text-emerald-600 mt-0.5">{androidCount} টি ডিভাইস</p>
          </div>

          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex items-center justify-center gap-1.5 text-blue-800 font-bold text-xs mb-1">
              <Smartphone className="w-4 h-4" />
              <span>iOS / Apple</span>
            </div>
            <div className="text-xl font-black text-blue-700">{iosPercent}%</div>
            <p className="text-[10px] text-blue-600 mt-0.5">{iosCount} টি ডিভাইস</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-center gap-1.5 text-slate-800 font-bold text-xs mb-1">
              <Laptop className="w-4 h-4" />
              <span>PC / Others</span>
            </div>
            <div className="text-xl font-black text-slate-700">{desktopPercent}%</div>
            <p className="text-[10px] text-slate-500 mt-0.5">{desktopCount} টি ডিভাইস</p>
          </div>

        </div>
      </div>

      {/* 4. Live Device Tracking Log List */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>সরাসরি ডিভাইসের তালিকা (Live Devices with Installed App)</span>
          </h3>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            রিয়েল-টাইম সিঙ্ক
          </span>
        </div>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {data.deviceLogs.map((device, idx) => (
            <div
              key={device.id || idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-all text-xs"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  device.isStandalone 
                    ? 'bg-emerald-100 text-emerald-700 font-black' 
                    : 'bg-amber-100 text-amber-700 font-bold'
                }`}>
                  {device.platform === 'Android' ? (
                    <Smartphone className="w-4 h-4" />
                  ) : device.platform === 'iOS' ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Laptop className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{device.id}</span>
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                      device.isStandalone 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {device.isStandalone ? '📱 ফোনে অ্যাপ ইনস্টল আছে' : '🌐 ব্রাউজার'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{device.platform} • {device.browser}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[11px] font-bold text-slate-700">{device.installedAt}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">{device.lastActiveAt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
