import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Eye, 
  BookOpen, 
  Layers, 
  Video, 
  GraduationCap, 
  Check, 
  Play,
  HelpCircle,
  Sparkles,
  Home,
  CheckSquare,
  Image as ImageIcon,
  Upload,
  Loader2,
  Cloud,
  Settings,
  Zap,
  Copy,
  ListPlus,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Megaphone,
  X
} from 'lucide-react';
import { 
  ClassCategory, 
  SubjectItem, 
  ChapterItem, 
  VideoItem 
} from '../data/hierarchyData';
import { 
  MCQChapterItem, 
  MCQQuestionItem 
} from '../data/mcqData';
import { uploadToImgBB } from '../utils/imageUpload';
import { firebaseSync, AppSyncData } from '../services/firebaseSync';
import { FirebaseAdminSettings } from './FirebaseAdminSettings';
import { AdsAdminManager } from './AdsAdminManager';
import { AdsSystemConfig } from '../data/adsConfig';

export type AdminSection = 'home' | 'courses' | 'mcq' | 'ads' | 'firebase';

interface AdminPanelProps {
  homeClasses: ClassCategory[];
  homeSubjects: SubjectItem[];
  homeChapters: ChapterItem[];
  onSaveHome: (classes: ClassCategory[], subjects: SubjectItem[], chapters: ChapterItem[]) => void;

  coursesClasses: ClassCategory[];
  coursesSubjects: SubjectItem[];
  coursesChapters: ChapterItem[];
  onSaveCourses: (classes: ClassCategory[], subjects: SubjectItem[], chapters: ChapterItem[]) => void;

  mcqClasses: ClassCategory[];
  mcqSubjects: SubjectItem[];
  mcqChapters: MCQChapterItem[];
  onSaveMCQ: (classes: ClassCategory[], subjects: SubjectItem[], chapters: MCQChapterItem[]) => void;

  adsConfig: AdsSystemConfig;
  onSaveAds: (config: AdsSystemConfig) => void;

  onExitAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  homeClasses,
  homeSubjects,
  homeChapters,
  onSaveHome,
  coursesClasses,
  coursesSubjects,
  coursesChapters,
  onSaveCourses,
  mcqClasses,
  mcqSubjects,
  mcqChapters,
  onSaveMCQ,
  adsConfig,
  onSaveAds,
  onExitAdmin
}) => {
  // Current active section being managed
  const [activeSection, setActiveSection] = useState<AdminSection>('home');

  // Ads state
  const [currentAdsConfig, setCurrentAdsConfig] = useState<AdsSystemConfig>(adsConfig);

  // 4 Sequential Pages/Steps: 1 = Class, 2 = Subject, 3 = Chapter, 4 = Content (Videos or MCQ questions)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Local mutable state for each section
  const [homeC, setHomeC] = useState<ClassCategory[]>(homeClasses);
  const [homeS, setHomeS] = useState<SubjectItem[]>(homeSubjects);
  const [homeCh, setHomeCh] = useState<ChapterItem[]>(homeChapters);

  const [coursesC, setCoursesC] = useState<ClassCategory[]>(coursesClasses);
  const [coursesS, setCoursesS] = useState<SubjectItem[]>(coursesSubjects);
  const [coursesCh, setCoursesCh] = useState<ChapterItem[]>(coursesChapters);

  const [mcqC, setMcqC] = useState<ClassCategory[]>(mcqClasses);
  const [mcqS, setMcqS] = useState<SubjectItem[]>(mcqSubjects);
  const [mcqCh, setMcqCh] = useState<MCQChapterItem[]>(mcqChapters);

  // Active selections
  const [selectedClassId, setSelectedClassId] = useState<string>(homeClasses[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(homeSubjects[0]?.id || '');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(homeChapters[0]?.id || '');

  // Upload state
  const [uploadingVidId, setUploadingVidId] = useState<string | null>(null);

  // Quick Add Input States for Instant Effortless Adding
  const [quickClassTitle, setQuickClassTitle] = useState('');
  const [quickClassSub, setQuickClassSub] = useState('');

  const [quickSubName, setQuickSubName] = useState('');
  const [quickSubSub, setQuickSubSub] = useState('');

  const [quickChapNum, setQuickChapNum] = useState('');
  const [quickChapTitle, setQuickChapTitle] = useState('');

  const [quickVidTitle, setQuickVidTitle] = useState('');
  const [quickVidUrl, setQuickVidUrl] = useState('');
  const [quickVidDuration, setQuickVidDuration] = useState('২৫:০০');
  const [bulkVideoOpen, setBulkVideoOpen] = useState(false);
  const [bulkVideoText, setBulkVideoText] = useState('');

  const [quickMCQQ, setQuickMCQQ] = useState('');
  const [quickMCQOpts, setQuickMCQOpts] = useState<[string, string, string, string]>(['', '', '', '']);
  const [quickMCQCorrect, setQuickMCQCorrect] = useState(0);
  const [quickMCQExp, setQuickMCQExp] = useState('');
  const [bulkMCQOpen, setBulkMCQOpen] = useState(false);
  const [bulkMCQText, setBulkMCQText] = useState('');

  // Delete Confirmation Modal State
  interface DeleteConfirmItem {
    type: 'class' | 'subject' | 'chapter' | 'video' | 'question';
    id: string;
    extraId?: string; // chapterId for video or question
    title: string;
    subtitle?: string;
  }
  const [deleteModal, setDeleteModal] = useState<DeleteConfirmItem | null>(null);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Section getters
  const currentClasses = activeSection === 'home' ? homeC : activeSection === 'courses' ? coursesC : activeSection === 'mcq' ? mcqC : homeC;
  const currentSubjects = activeSection === 'home' ? homeS : activeSection === 'courses' ? coursesS : activeSection === 'mcq' ? mcqS : homeS;

  interface SyncOverrides {
    homeC?: ClassCategory[];
    homeS?: SubjectItem[];
    homeCh?: ChapterItem[];
    coursesC?: ClassCategory[];
    coursesS?: SubjectItem[];
    coursesCh?: ChapterItem[];
    mcqC?: ClassCategory[];
    mcqS?: SubjectItem[];
    mcqCh?: MCQChapterItem[];
    adsConfig?: AdsSystemConfig;
  }

  const getAllCurrentData = (overrides: SyncOverrides = {}): AppSyncData => ({
    homeClasses: overrides.homeC ?? homeC,
    homeSubjects: overrides.homeS ?? homeS,
    homeChapters: overrides.homeCh ?? homeCh,
    coursesClasses: overrides.coursesC ?? coursesC,
    coursesSubjects: overrides.coursesS ?? coursesS,
    coursesChapters: overrides.coursesCh ?? coursesCh,
    mcqClasses: overrides.mcqC ?? mcqC,
    mcqSubjects: overrides.mcqS ?? mcqS,
    mcqChapters: overrides.mcqCh ?? mcqCh,
    adsConfig: overrides.adsConfig ?? currentAdsConfig
  });

  const handleSaveAdsFromManager = (newAds: AdsSystemConfig) => {
    setCurrentAdsConfig(newAds);
    onSaveAds(newAds);
    try {
      localStorage.setItem('smartstudy_ads_config_v1', JSON.stringify(newAds));
    } catch (e) {
      console.warn(e);
    }
    const fullData = getAllCurrentData({ adsConfig: newAds });
    firebaseSync.syncToCloud(fullData).catch(console.warn);
  };

  const syncInstantToCloud = (overrides: SyncOverrides = {}) => {
    const finalHomeC = overrides.homeC ?? homeC;
    const finalHomeS = overrides.homeS ?? homeS;
    const finalHomeCh = overrides.homeCh ?? homeCh;

    const finalCoursesC = overrides.coursesC ?? coursesC;
    const finalCoursesS = overrides.coursesS ?? coursesS;
    const finalCoursesCh = overrides.coursesCh ?? coursesCh;

    const finalMcqC = overrides.mcqC ?? mcqC;
    const finalMcqS = overrides.mcqS ?? mcqS;
    const finalMcqCh = overrides.mcqCh ?? mcqCh;

    // Immediately persist directly to LocalStorage synchronously
    try {
      localStorage.setItem('smartstudy_home_classes_v7', JSON.stringify(finalHomeC));
      localStorage.setItem('smartstudy_home_subjects_v7', JSON.stringify(finalHomeS));
      localStorage.setItem('smartstudy_home_chapters_v7', JSON.stringify(finalHomeCh));

      localStorage.setItem('smartstudy_courses_classes_v7', JSON.stringify(finalCoursesC));
      localStorage.setItem('smartstudy_courses_subjects_v7', JSON.stringify(finalCoursesS));
      localStorage.setItem('smartstudy_courses_chapters_v7', JSON.stringify(finalCoursesCh));

      localStorage.setItem('smartstudy_mcq_classes_v7', JSON.stringify(finalMcqC));
      localStorage.setItem('smartstudy_mcq_subjects_v7', JSON.stringify(finalMcqS));
      localStorage.setItem('smartstudy_mcq_chapters_v7', JSON.stringify(finalMcqCh));
    } catch (e) {
      console.warn('LocalStorage immediate save error:', e);
    }

    onSaveHome(finalHomeC, finalHomeS, finalHomeCh);
    onSaveCourses(finalCoursesC, finalCoursesS, finalCoursesCh);
    onSaveMCQ(finalMcqC, finalMcqS, finalMcqCh);

    const fullData = getAllCurrentData(overrides);
    firebaseSync.syncToCloud(fullData).catch(err => {
      console.warn('Realtime cloud sync notice:', err);
    });
  };
  
  // Section switch
  const handleSwitchSection = (sec: AdminSection) => {
    handleSaveCurrent();
    setActiveSection(sec);
    setCurrentStep(1);

    if (sec === 'home') {
      setSelectedClassId(homeC[0]?.id || '');
      setSelectedSubjectId(homeS[0]?.id || '');
      setSelectedChapterId(homeCh[0]?.id || '');
    } else if (sec === 'courses') {
      setSelectedClassId(coursesC[0]?.id || '');
      setSelectedSubjectId(coursesS[0]?.id || '');
      setSelectedChapterId(coursesCh[0]?.id || '');
    } else if (sec === 'mcq') {
      setSelectedClassId(mcqC[0]?.id || '');
      setSelectedSubjectId(mcqS[0]?.id || '');
      setSelectedChapterId(mcqCh[0]?.id || '');
    }
  };

  // Save handler
  const handleSaveCurrent = () => {
    syncInstantToCloud();
    triggerToast('✓ ক্লাউড ও অ্যাপে তাৎক্ষণিকভাবে সেভ হয়েছে!');
  };

  // Derived current items with cascading hierarchy
  const currentClass = currentClasses.find(c => c.id === selectedClassId) || currentClasses[0];
  const currentClassSubjects = currentSubjects.filter(s => s.classId === (currentClass?.id || selectedClassId));
  const currentSubject = currentClassSubjects.find(s => s.id === selectedSubjectId) 
    || currentClassSubjects[0] 
    || currentSubjects.find(s => s.id === selectedSubjectId) 
    || currentSubjects[0];
  
  const currentVideoChapters = activeSection === 'home' ? homeCh : coursesCh;
  const currentSubjectVideoChapters = currentVideoChapters.filter(ch => ch.subjectId === (currentSubject?.id || selectedSubjectId));
  const currentSubjectMCQChapters = mcqCh.filter(ch => ch.subjectId === (currentSubject?.id || selectedSubjectId));

  const currentVideoChapter = currentSubjectVideoChapters.find(ch => ch.id === selectedChapterId) 
    || currentSubjectVideoChapters[0] 
    || currentVideoChapters.find(ch => ch.id === selectedChapterId) 
    || currentVideoChapters[0];

  const currentMCQChapter = currentSubjectMCQChapters.find(ch => ch.id === selectedChapterId) 
    || currentSubjectMCQChapters[0] 
    || mcqCh.find(ch => ch.id === selectedChapterId) 
    || mcqCh[0];

  // Cascading Selection Handlers
  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    const subs = currentSubjects.filter(s => s.classId === classId);
    if (subs.length > 0) {
      setSelectedSubjectId(subs[0].id);
      const chaps = activeSection === 'mcq'
        ? mcqCh.filter(ch => ch.subjectId === subs[0].id)
        : (activeSection === 'home' ? homeCh : coursesCh).filter(ch => ch.subjectId === subs[0].id);
      if (chaps.length > 0) {
        setSelectedChapterId(chaps[0].id);
      }
    }
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const sub = currentSubjects.find(s => s.id === subjectId);
    if (sub && sub.classId !== selectedClassId) {
      setSelectedClassId(sub.classId);
    }
    const chaps = activeSection === 'mcq'
      ? mcqCh.filter(ch => ch.subjectId === subjectId)
      : (activeSection === 'home' ? homeCh : coursesCh).filter(ch => ch.subjectId === subjectId);
    if (chaps.length > 0) {
      setSelectedChapterId(chaps[0].id);
    }
  };

  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    const allChaps = activeSection === 'mcq' ? mcqCh : (activeSection === 'home' ? homeCh : coursesCh);
    const foundChap = allChaps.find(ch => ch.id === chapterId);
    if (foundChap && foundChap.subjectId && foundChap.subjectId !== selectedSubjectId) {
      setSelectedSubjectId(foundChap.subjectId);
      const foundSub = currentSubjects.find(s => s.id === foundChap.subjectId);
      if (foundSub && foundSub.classId !== selectedClassId) {
        setSelectedClassId(foundSub.classId);
      }
    }
  };

  // --- CLASS ACTIONS ---
  const handleUpdateClass = (id: string, field: keyof ClassCategory, val: string) => {
    if (activeSection === 'home') {
      setHomeC(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
    } else if (activeSection === 'courses') {
      setCoursesC(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
    } else {
      setMcqC(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
    }
  };

  const handleAddClass = () => {
    handleAddClassQuick('নতুন শ্রেণি', 'বিবরণ লিখুন');
  };

  const handleAddClassQuick = (titleText: string, subText = 'প্রস্তুতি ও গাইড') => {
    const trimmedTitle = titleText.trim();
    if (!trimmedTitle) return;
    const newClass: ClassCategory = {
      id: `${activeSection}_class_${Date.now()}`,
      title: trimmedTitle,
      subtitle: subText.trim() || 'প্রস্তুতি ও গাইড',
      code: 'CLS',
      bgColor: 'bg-emerald-100/80',
      iconColor: 'text-emerald-700'
    };
    if (activeSection === 'home') setHomeC(prev => [...prev, newClass]);
    else if (activeSection === 'courses') setCoursesC(prev => [...prev, newClass]);
    else setMcqC(prev => [...prev, newClass]);

    setSelectedClassId(newClass.id);
    setQuickClassTitle('');
    setQuickClassSub('');
    triggerToast(`✓ "${trimmedTitle}" শ্রেণি যোগ হয়েছে!`);
  };

  // Prompt / Execute Delete Class
  const promptDeleteClass = (c: ClassCategory) => {
    setDeleteModal({
      type: 'class',
      id: c.id,
      title: c.title,
      subtitle: 'এই শ্রেণিটি মুছে ফেললে এর ভেতরের সকল বিষয়, অধ্যায় ও কন্টেন্টও মুছে যাবে।'
    });
  };

  const executeDeleteClass = (id: string) => {
    if (activeSection === 'home') {
      const nextC = homeC.filter(c => c.id !== id);
      const childSubIds = new Set(homeS.filter(s => s.classId === id).map(s => s.id));
      const nextS = homeS.filter(s => s.classId !== id);
      const nextCh = homeCh.filter(ch => !childSubIds.has(ch.subjectId));

      setHomeC(nextC);
      setHomeS(nextS);
      setHomeCh(nextCh);

      if (selectedClassId === id) {
        const nextClassId = nextC[0]?.id || '';
        setSelectedClassId(nextClassId);
        const nextSub = nextS.find(s => s.classId === nextClassId);
        const nextSubId = nextSub?.id || '';
        setSelectedSubjectId(nextSubId);
        const nextChap = nextCh.find(ch => ch.subjectId === nextSubId);
        setSelectedChapterId(nextChap?.id || '');
      }

      syncInstantToCloud({ homeC: nextC, homeS: nextS, homeCh: nextCh });
    } else if (activeSection === 'courses') {
      const nextC = coursesC.filter(c => c.id !== id);
      const childSubIds = new Set(coursesS.filter(s => s.classId === id).map(s => s.id));
      const nextS = coursesS.filter(s => s.classId !== id);
      const nextCh = coursesCh.filter(ch => !childSubIds.has(ch.subjectId));

      setCoursesC(nextC);
      setCoursesS(nextS);
      setCoursesCh(nextCh);

      if (selectedClassId === id) {
        const nextClassId = nextC[0]?.id || '';
        setSelectedClassId(nextClassId);
        const nextSub = nextS.find(s => s.classId === nextClassId);
        const nextSubId = nextSub?.id || '';
        setSelectedSubjectId(nextSubId);
        const nextChap = nextCh.find(ch => ch.subjectId === nextSubId);
        setSelectedChapterId(nextChap?.id || '');
      }

      syncInstantToCloud({ coursesC: nextC, coursesS: nextS, coursesCh: nextCh });
    } else {
      const nextC = mcqC.filter(c => c.id !== id);
      const childSubIds = new Set(mcqS.filter(s => s.classId === id).map(s => s.id));
      const nextS = mcqS.filter(s => s.classId !== id);
      const nextCh = mcqCh.filter(ch => !childSubIds.has(ch.subjectId));

      setMcqC(nextC);
      setMcqS(nextS);
      setMcqCh(nextCh);

      if (selectedClassId === id) {
        const nextClassId = nextC[0]?.id || '';
        setSelectedClassId(nextClassId);
        const nextSub = nextS.find(s => s.classId === nextClassId);
        const nextSubId = nextSub?.id || '';
        setSelectedSubjectId(nextSubId);
        const nextChap = nextCh.find(ch => ch.subjectId === nextSubId);
        setSelectedChapterId(nextChap?.id || '');
      }

      syncInstantToCloud({ mcqC: nextC, mcqS: nextS, mcqCh: nextCh });
    }
    triggerToast('✓ শ্রেণি সফলভাবে মুছে ফেলা হয়েছে');
  };

  const handleDeleteClass = (id: string) => {
    const target = currentClasses.find(c => c.id === id);
    if (target) {
      promptDeleteClass(target);
    } else {
      executeDeleteClass(id);
    }
  };

  // --- SUBJECT ACTIONS ---
  const handleUpdateSubject = (id: string, field: keyof SubjectItem, val: string) => {
    if (activeSection === 'home') {
      setHomeS(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
    } else if (activeSection === 'courses') {
      setCoursesS(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
    } else {
      setMcqS(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
    }
  };

  const handleAddSubject = () => {
    handleAddSubjectQuick('নতুন বিষয়', 'বিবরণ ও গাইড');
  };

  const handleAddSubjectQuick = (nameText: string, subText = 'পূর্ণাঙ্গ প্রস্তুতি ও গাইড') => {
    const trimmedName = nameText.trim();
    if (!trimmedName) return;
    const targetClassId = currentClass?.id || selectedClassId;
    const newSub: SubjectItem = {
      id: `${activeSection}_sub_${Date.now()}`,
      classId: targetClassId,
      name: trimmedName,
      subtitle: subText.trim() || 'পূর্ণাঙ্গ লেকচার ও প্র্যাকটিস',
      code: 'SUB',
      bgColor: 'bg-blue-100/80',
      iconColor: 'text-blue-700'
    };
    if (activeSection === 'home') setHomeS(prev => [...prev, newSub]);
    else if (activeSection === 'courses') setCoursesS(prev => [...prev, newSub]);
    else setMcqS(prev => [...prev, newSub]);

    setSelectedSubjectId(newSub.id);
    setQuickSubName('');
    setQuickSubSub('');
    triggerToast(`✓ "${trimmedName}" বিষয় সফলভাবে যোগ হয়েছে!`);
  };

  // Prompt / Execute Delete Subject
  const promptDeleteSubject = (s: SubjectItem) => {
    setDeleteModal({
      type: 'subject',
      id: s.id,
      title: s.name,
      subtitle: 'এই বিষয়টি মুছে ফেললে এর সকল অধ্যায় ও কন্টেন্টও মুছে যাবে।'
    });
  };

  const executeDeleteSubject = (id: string) => {
    if (activeSection === 'home') {
      const nextS = homeS.filter(s => s.id !== id);
      const nextCh = homeCh.filter(ch => ch.subjectId !== id);

      setHomeS(nextS);
      setHomeCh(nextCh);

      if (selectedSubjectId === id) {
        const remainingInClass = nextS.filter(s => s.classId === selectedClassId);
        const nextSubId = remainingInClass[0]?.id || nextS[0]?.id || '';
        setSelectedSubjectId(nextSubId);
        const nextChap = nextCh.find(ch => ch.subjectId === nextSubId);
        setSelectedChapterId(nextChap?.id || '');
      }

      syncInstantToCloud({ homeS: nextS, homeCh: nextCh });
    } else if (activeSection === 'courses') {
      const nextS = coursesS.filter(s => s.id !== id);
      const nextCh = coursesCh.filter(ch => ch.subjectId !== id);

      setCoursesS(nextS);
      setCoursesCh(nextCh);

      if (selectedSubjectId === id) {
        const remainingInClass = nextS.filter(s => s.classId === selectedClassId);
        const nextSubId = remainingInClass[0]?.id || nextS[0]?.id || '';
        setSelectedSubjectId(nextSubId);
        const nextChap = nextCh.find(ch => ch.subjectId === nextSubId);
        setSelectedChapterId(nextChap?.id || '');
      }

      syncInstantToCloud({ coursesS: nextS, coursesCh: nextCh });
    } else {
      const nextS = mcqS.filter(s => s.id !== id);
      const nextCh = mcqCh.filter(ch => ch.subjectId !== id);

      setMcqS(nextS);
      setMcqCh(nextCh);

      if (selectedSubjectId === id) {
        const remainingInClass = nextS.filter(s => s.classId === selectedClassId);
        const nextSubId = remainingInClass[0]?.id || nextS[0]?.id || '';
        setSelectedSubjectId(nextSubId);
        const nextChap = nextCh.find(ch => ch.subjectId === nextSubId);
        setSelectedChapterId(nextChap?.id || '');
      }

      syncInstantToCloud({ mcqS: nextS, mcqCh: nextCh });
    }
    triggerToast('✓ বিষয় সফলভাবে মুছে ফেলা হয়েছে');
  };

  const handleDeleteSubject = (id: string) => {
    const target = currentSubjects.find(s => s.id === id);
    if (target) {
      promptDeleteSubject(target);
    } else {
      executeDeleteSubject(id);
    }
  };

  // --- CHAPTER ACTIONS ---
  const handleUpdateChapter = (id: string, field: string, val: any) => {
    if (activeSection === 'home') {
      setHomeCh(prev => prev.map(ch => ch.id === id ? { ...ch, [field]: val } : ch));
    } else if (activeSection === 'courses') {
      setCoursesCh(prev => prev.map(ch => ch.id === id ? { ...ch, [field]: val } : ch));
    } else {
      setMcqCh(prev => prev.map(ch => ch.id === id ? { ...ch, [field]: val } : ch));
    }
  };

  const handleAddChapter = () => {
    handleAddChapterQuick();
  };

  const handleAddChapterQuick = (numText?: string, titleText?: string) => {
    const count = activeSection === 'mcq' ? currentSubjectMCQChapters.length : currentSubjectVideoChapters.length;
    const ordinals = ['১ম অধ্যায়', '২য় অধ্যায়', '৩য় অধ্যায়', '৪র্থ অধ্যায়', '৫ম অধ্যায়', '৬ষ্ঠ অধ্যায়', '৭ম অধ্যায়', '৮ম অধ্যায়', '৯ম অধ্যায়', '১০ম অধ্যায়'];
    const autoOrd = ordinals[count] || `${count + 1}তম অধ্যায়`;

    const finalNum = (numText && numText.trim()) || autoOrd;
    const finalTitle = (titleText && titleText.trim()) || 'নতুন অধ্যায়';
    const targetSubId = currentSubject?.id || selectedSubjectId;

    if (activeSection === 'mcq') {
      const newMCQChap: MCQChapterItem = {
        id: `mcq_ch_${Date.now()}`,
        subjectId: targetSubId,
        chapterNumber: finalNum,
        title: finalTitle,
        subtitle: 'বোর্ড স্ট্যান্ডার্ড এমসিকিউ ও মডেল টেস্ট',
        bgColor: 'bg-purple-100/80',
        iconColor: 'text-purple-700',
        questions: [
          {
            id: `q_${Date.now()}`,
            question: `${finalTitle}-এর নমুনা প্রশ্ন লিখুন...`,
            options: ['অপশন ক', 'অপশন খ', 'অপশন গ', 'অপশন ঘ'],
            correctIndex: 0,
            explanation: 'সঠিক উত্তর যাচাই করুন।'
          }
        ]
      };
      setMcqCh(prev => [...prev, newMCQChap]);
      setSelectedChapterId(newMCQChap.id);
    } else {
      const newChap: ChapterItem = {
        id: `${activeSection}_ch_${Date.now()}`,
        subjectId: targetSubId,
        chapterNumber: finalNum,
        title: finalTitle,
        subtitle: 'ভিডিও ক্লাস লেকচার',
        bgColor: 'bg-amber-100/80',
        iconColor: 'text-amber-700',
        videos: [
          {
            id: `vid_${Date.now()}`,
            title: 'লেকচার ১: প্রাথমিক ধারণা ও মূল বিষয়',
            duration: '২৫:০০',
            youtubeUrl: 'https://youtu.be/zF_QuSpQdsI',
            instructor: 'প্রশিক্ষক'
          }
        ]
      };
      if (activeSection === 'home') setHomeCh(prev => [...prev, newChap]);
      else setCoursesCh(prev => [...prev, newChap]);
      setSelectedChapterId(newChap.id);
    }

    setQuickChapNum('');
    setQuickChapTitle('');
    triggerToast(`✓ "${finalNum}: ${finalTitle}" যোগ হয়েছে!`);
  };

  const handleDuplicateChapter = (chapId: string) => {
    if (activeSection === 'mcq') {
      const orig = mcqCh.find(ch => ch.id === chapId);
      if (!orig) return;
      const cloned: MCQChapterItem = {
        ...orig,
        id: `mcq_ch_${Date.now()}`,
        title: `${orig.title} (কপি)`,
        questions: orig.questions.map((q, idx) => ({
          ...q,
          id: `q_${Date.now()}_${idx}`
        }))
      };
      setMcqCh(prev => [...prev, cloned]);
      setSelectedChapterId(cloned.id);
    } else {
      const all = activeSection === 'home' ? homeCh : coursesCh;
      const orig = all.find(ch => ch.id === chapId);
      if (!orig) return;
      const cloned: ChapterItem = {
        ...orig,
        id: `${activeSection}_ch_${Date.now()}`,
        title: `${orig.title} (কপি)`,
        videos: orig.videos.map((v, idx) => ({
          ...v,
          id: `vid_${Date.now()}_${idx}`
        }))
      };
      if (activeSection === 'home') setHomeCh(prev => [...prev, cloned]);
      else setCoursesCh(prev => [...prev, cloned]);
      setSelectedChapterId(cloned.id);
    }
    triggerToast('✓ অধ্যায় সফলভাবে ক্লোন করা হয়েছে!');
  };

  // Prompt / Execute Delete Chapter
  const promptDeleteChapter = (ch: ChapterItem | MCQChapterItem) => {
    setDeleteModal({
      type: 'chapter',
      id: ch.id,
      title: `${ch.chapterNumber}: ${ch.title}`,
      subtitle: 'এই অধ্যায়টি মুছে ফেললে এর সকল ভিডিও ক্লাস বা এমসিকিউ প্রশ্নও মুছে যাবে।'
    });
  };

  const executeDeleteChapter = (id: string) => {
    if (activeSection === 'home') {
      const nextCh = homeCh.filter(ch => ch.id !== id);
      setHomeCh(nextCh);

      if (selectedChapterId === id) {
        const remainingInSub = nextCh.filter(ch => ch.subjectId === selectedSubjectId);
        const nextChapId = remainingInSub[0]?.id || nextCh[0]?.id || '';
        setSelectedChapterId(nextChapId);
      }

      syncInstantToCloud({ homeCh: nextCh });
    } else if (activeSection === 'courses') {
      const nextCh = coursesCh.filter(ch => ch.id !== id);
      setCoursesCh(nextCh);

      if (selectedChapterId === id) {
        const remainingInSub = nextCh.filter(ch => ch.subjectId === selectedSubjectId);
        const nextChapId = remainingInSub[0]?.id || nextCh[0]?.id || '';
        setSelectedChapterId(nextChapId);
      }

      syncInstantToCloud({ coursesCh: nextCh });
    } else {
      const nextCh = mcqCh.filter(ch => ch.id !== id);
      setMcqCh(nextCh);

      if (selectedChapterId === id) {
        const remainingInSub = nextCh.filter(ch => ch.subjectId === selectedSubjectId);
        const nextChapId = remainingInSub[0]?.id || nextCh[0]?.id || '';
        setSelectedChapterId(nextChapId);
      }

      syncInstantToCloud({ mcqCh: nextCh });
    }
    triggerToast('✓ অধ্যায় সফলভাবে মুছে ফেলা হয়েছে');
  };

  const handleDeleteChapter = (id: string) => {
    const all = activeSection === 'mcq' ? mcqCh : (activeSection === 'home' ? homeCh : coursesCh);
    const target = all.find(ch => ch.id === id);
    if (target) {
      promptDeleteChapter(target);
    } else {
      executeDeleteChapter(id);
    }
  };

  // --- VIDEO ACTIONS (Home & Courses) ---
  const handleUpdateVideo = (chapId: string, vidId: string, field: keyof VideoItem, val: string) => {
    const updater = (prev: ChapterItem[]) => prev.map(ch => {
      if (ch.id !== chapId) return ch;
      return {
        ...ch,
        videos: ch.videos.map(v => v.id === vidId ? { ...v, [field]: val } : v)
      };
    });
    if (activeSection === 'home') setHomeCh(updater);
    else setCoursesCh(updater);
  };

  // YouTube thumbnail helper
  const getYouTubeThumb = (url?: string) => {
    if (!url) return null;
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
  };

  // Thumbnail Upload via ImgBB
  const handleUploadThumbnail = async (chapId: string, vidId: string, file: File) => {
    try {
      setUploadingVidId(vidId);
      triggerToast('গ্যালারি থেকে ফটো আপলোড হচ্ছে...');
      const uploadedUrl = await uploadToImgBB(file);
      handleUpdateVideo(chapId, vidId, 'thumbnail', uploadedUrl);
      triggerToast('✓ থাম্বনেইল সফলভাবে আপলোড হয়েছে!');
    } catch (err) {
      console.error(err);
      triggerToast('❌ ফটো আপলোড ব্যর্থ হয়েছে, আবার চেষ্টা করুন');
    } finally {
      setUploadingVidId(null);
    }
  };

  const handleAddVideo = (chapId: string) => {
    handleAddVideoQuick(chapId);
  };

  const handleAddVideoQuick = (chapId: string, title?: string, url?: string, dur = '২৫:০০') => {
    const targetChap = activeSection === 'home' ? homeCh.find(c => c.id === chapId) : coursesCh.find(c => c.id === chapId);
    const existingCount = targetChap?.videos.length || 0;
    const finalTitle = (title && title.trim()) || `লেকচার ${existingCount + 1}: নতুন ক্লাস`;
    const finalUrl = (url && url.trim()) || 'https://youtu.be/zF_QuSpQdsI';
    const finalThumb = getYouTubeThumb(finalUrl) || '';

    const newVid: VideoItem = {
      id: `vid_${Date.now()}`,
      title: finalTitle,
      duration: dur || '২৫:০০',
      youtubeUrl: finalUrl,
      instructor: 'প্রশিক্ষক',
      thumbnail: finalThumb
    };

    const updater = (prev: ChapterItem[]) => prev.map(ch => {
      if (ch.id !== chapId) return ch;
      return { ...ch, videos: [...ch.videos, newVid] };
    });

    if (activeSection === 'home') setHomeCh(updater);
    else setCoursesCh(updater);

    setQuickVidTitle('');
    setQuickVidUrl('');
    triggerToast(`✓ "${finalTitle}" সফলভাবে যোগ হয়েছে!`);
  };

  const handleBulkAddVideos = (chapId: string, rawText: string) => {
    if (!rawText.trim()) return;
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const targetChap = activeSection === 'home' ? homeCh.find(c => c.id === chapId) : coursesCh.find(c => c.id === chapId);
    const baseCount = targetChap?.videos.length || 0;

    const newVideos: VideoItem[] = [];
    lines.forEach((line, idx) => {
      const urlMatch = line.match(/(https?:\/\/[^\s]+)/i);
      const url = urlMatch ? urlMatch[0] : (line.startsWith('http') ? line : `https://youtu.be/${line.replace(/\s+/g, '')}`);
      let title = line.replace(url, '').replace(/^[-:–•\s]+|[-:–•\s]+$/g, '').trim();
      if (!title) {
        title = `লেকচার ${baseCount + idx + 1}: ক্লাস`;
      }
      const thumb = getYouTubeThumb(url) || '';
      newVideos.push({
        id: `vid_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        title,
        duration: '২৫:০০',
        youtubeUrl: url,
        instructor: 'প্রশিক্ষক',
        thumbnail: thumb
      });
    });

    if (newVideos.length > 0) {
      const updater = (prev: ChapterItem[]) => prev.map(ch => {
        if (ch.id !== chapId) return ch;
        return { ...ch, videos: [...ch.videos, ...newVideos] };
      });
      if (activeSection === 'home') setHomeCh(updater);
      else setCoursesCh(updater);
      setBulkVideoText('');
      setBulkVideoOpen(false);
      triggerToast(`✓ ${newVideos.length}টি ভিডিও এক ক্লিকে যোগ হয়েছে!`);
    }
  };

  const handleDuplicateVideo = (chapId: string, vidId: string) => {
    const updater = (prev: ChapterItem[]) => prev.map(ch => {
      if (ch.id !== chapId) return ch;
      const orig = ch.videos.find(v => v.id === vidId);
      if (!orig) return ch;
      const cloned: VideoItem = {
        ...orig,
        id: `vid_${Date.now()}`,
        title: `${orig.title} (কপি)`
      };
      return { ...ch, videos: [...ch.videos, cloned] };
    });
    if (activeSection === 'home') setHomeCh(updater);
    else setCoursesCh(updater);
    triggerToast('✓ ভিডিও ক্লোন করা হয়েছে!');
  };

  // Prompt / Execute Delete Video
  const promptDeleteVideo = (chapId: string, v: VideoItem) => {
    setDeleteModal({
      type: 'video',
      id: v.id,
      extraId: chapId,
      title: v.title,
      subtitle: 'এই ভিডিও ক্লাস লেকচারটি মুছে ফেলা হবে।'
    });
  };

  const executeDeleteVideo = (chapId: string, vidId: string) => {
    if (activeSection === 'home') {
      const next = homeCh.map(ch => ch.id !== chapId ? ch : { ...ch, videos: ch.videos.filter(v => v.id !== vidId) });
      setHomeCh(next);
      syncInstantToCloud({ homeCh: next });
    } else {
      const next = coursesCh.map(ch => ch.id !== chapId ? ch : { ...ch, videos: ch.videos.filter(v => v.id !== vidId) });
      setCoursesCh(next);
      syncInstantToCloud({ coursesCh: next });
    }
    triggerToast('✓ ভিডিও সফলভাবে মুছে ফেলা হয়েছে');
  };

  const handleDeleteVideo = (chapId: string, vidId: string) => {
    const chaps = activeSection === 'home' ? homeCh : coursesCh;
    const chap = chaps.find(c => c.id === chapId);
    const vid = chap?.videos.find(v => v.id === vidId);
    if (vid) {
      promptDeleteVideo(chapId, vid);
    } else {
      executeDeleteVideo(chapId, vidId);
    }
  };

  // --- MCQ ACTIONS ---
  const handleUpdateQuestion = (chapId: string, qId: string, field: string, val: any) => {
    setMcqCh(prev => prev.map(ch => {
      if (ch.id !== chapId) return ch;
      return {
        ...ch,
        questions: ch.questions.map(q => q.id === qId ? { ...q, [field]: val } : q)
      };
    }));
  };

  const handleUpdateOption = (chapId: string, qId: string, optIdx: number, val: string) => {
    setMcqCh(prev => prev.map(ch => {
      if (ch.id !== chapId) return ch;
      return {
        ...ch,
        questions: ch.questions.map(q => {
          if (q.id !== qId) return q;
          const nextOpts = [...q.options];
          nextOpts[optIdx] = val;
          return { ...q, options: nextOpts };
        })
      };
    }));
  };

  const handleAddQuestion = (chapId: string) => {
    const newQ: MCQQuestionItem = {
      id: `q_${Date.now()}`,
      question: 'নতুন এমসিকিউ প্রশ্ন লিখুন...',
      options: ['অপশন ক', 'অপশন খ', 'অপশন গ', 'অপশন ঘ'],
      correctIndex: 0,
      explanation: 'ব্যাখ্যা লিখুন।'
    };
    setMcqCh(prev => prev.map(ch => {
      if (ch.id !== chapId) return ch;
      return { ...ch, questions: [...ch.questions, newQ] };
    }));
    triggerToast('নতুন এমসিকিউ প্রশ্ন যোগ হয়েছে!');
  };

  const handleAddMCQQuick = (chapId: string) => {
    const trimmedQ = quickMCQQ.trim();
    if (!trimmedQ) {
      triggerToast('অনুগ্রহ করে প্রশ্ন লিখুন');
      return;
    }
    const finalOpts = quickMCQOpts.map((opt, i) => opt.trim() || `অপশন ${['ক', 'খ', 'গ', 'ঘ'][i]}`);

    const newQ: MCQQuestionItem = {
      id: `q_${Date.now()}`,
      question: trimmedQ,
      options: finalOpts,
      correctIndex: quickMCQCorrect,
      explanation: quickMCQExp.trim() || 'সঠিক উত্তর যাচাই করুন।'
    };

    setMcqCh(prev => prev.map(ch => {
      if (ch.id !== chapId) return ch;
      return { ...ch, questions: [...ch.questions, newQ] };
    }));

    setQuickMCQQ('');
    setQuickMCQOpts(['', '', '', '']);
    setQuickMCQExp('');
    triggerToast('✓ প্রশ্ন সফলভাবে যোগ হয়েছে!');
  };

  const handlePreload30MCQs = (chapId: string) => {
    const board30: MCQQuestionItem[] = [
      {
        id: `q_b30_${Date.now()}_1`,
        question: '১. কোনটি টপোলজিতে প্রথম ও শেষ কম্পিউটার পরস্পর সরাসরি যুক্ত থাকে?\ni. বাস   ii. রিং   iii. মেশ\nনিচের কোনটি সঠিক?',
        options: ['i ও ii', 'i ও iii', 'ii ও iii', 'i, ii ও iii'],
        correctIndex: 2,
        explanation: 'রিং টপোলজিতে বৃত্তাকারে প্রথম ও শেষ নোড সংযুক্ত থাকে এবং মেশ টপোলজিতে প্রতিটি নোড অন্য সব নোডের সাথে সরাসরি যুক্ত থাকে।'
      },
      {
        id: `q_b30_${Date.now()}_2`,
        question: '২. কম্পিউটারকে নেটওয়ার্কে যুক্ত করার জন্য যে কার্ড ব্যবহৃত হয় তাকে বলে—',
        options: ['Modem', 'NIC', 'Router', 'Hub'],
        correctIndex: 1,
        explanation: 'NIC বা Network Interface Card মাদারবোর্ডে যুক্ত থাকে যা নেটওয়ার্কের সাথে সংযোগ দেয়।'
      },
      {
        id: `q_b30_${Date.now()}_3`,
        question: '৩. মূল ডেটাকে অন্য ফরম্যাট পরিবর্তনের পদ্ধতি কোনটি?',
        options: ['ম্যানিপুলেশন', 'ভ্যালিডেশন', 'এনক্রিপশন', 'ডিক্রিপশন'],
        correctIndex: 2,
        explanation: 'এনক্রিপশনের মাধ্যমে প্লেইনটেক্সটকে সাইফারটেক্সটে রূপান্তর করা হয়।'
      },
      {
        id: `q_b30_${Date.now()}_4`,
        question: '৪. সি ভাষায় সমজাতীয় ডেটা সংরক্ষণের জন্য কোনটি ব্যবহার করা হয়?',
        options: ['ফাংশন', 'পয়েন্টার', 'স্ট্রাকচার', 'অ্যারে'],
        correctIndex: 3,
        explanation: 'অ্যারে (Array) হলো একই ধরনের বা সমজাতীয় ডাটা সংরক্ষণের চলক।'
      },
      {
        id: `q_b30_${Date.now()}_5`,
        question: '৫. ডেটাবেজে SQL টেবিলে নতুন রেকর্ড সংযোজনে কোন স্টেটমেন্ট ব্যবহার করা যায়?',
        options: ['SELECT', 'UPDATE', 'CREATE', 'INSERT'],
        correctIndex: 3,
        explanation: 'নতুন ডাটা বা রো ইনসার্ট করার জন্য INSERT INTO ব্যবহার করা হয়।'
      },
      {
        id: `q_b30_${Date.now()}_6`,
        question: '৬. নির্দিষ্ট ডাটা খুঁজতে কোনটি ব্যবহৃত হয়?',
        options: ['সর্টিং', 'সার্চিং', 'কুয়েরি', 'ইন্ডেক্সিং'],
        correctIndex: 2,
        explanation: 'শর্তানুসারে নির্দিষ্ট তথ্য বা রেকর্ড খুঁজে বের করার প্রক্রিয়াকে কুয়েরি (Query) বলে।'
      },
      {
        id: `q_b30_${Date.now()}_7`,
        question: '৭. DML (Data Manipulation Language) কমান্ড কোনটি?',
        options: ['Create', 'Alter', 'Select', 'Drop'],
        correctIndex: 2,
        explanation: 'Select, Insert, Update, Delete হলো DML কমান্ড।'
      },
      {
        id: `q_b30_${Date.now()}_8`,
        question: '■ নিচের উদ্দীপকটি পড়ে ৮ ও ৯নং প্রশ্নের উত্তর দাও :\n<html>\n<title> webpage </title>\n<body>\n<u> My personal information </u>\n</body>\n</html>\n\n৮. উপরের উদ্দীপকের ফলাফলের ধরন কীরূপ হবে?',
        options: ['বোল্ড', 'ইটালিক', 'আন্ডারলাইন', 'বোল্ড আন্ডারলাইন'],
        correctIndex: 2,
        explanation: 'HTML এ <u> ট্যাগ কোনো টেক্সটের নিচে আন্ডারলাইন তৈরি করে।'
      },
      {
        id: `q_b30_${Date.now()}_9`,
        question: '৯. উপরের My personal information এর উপর ক্লিক করলে জীবনবৃত্তান্তের পেইজটি ওপেন করার জন্য কোন ধরনের ট্যাগ ব্যবহার করতে হবে?',
        options: ['<a>...........</a>', '<p>.............</p>', '<i>..............</i>', '<c>..............</c>'],
        correctIndex: 0,
        explanation: 'হাইপারলিঙ্ক বা ক্লিকেবল লিঙ্ক তৈরির জন্য অ্যাঙ্কর ট্যাগ <a> ব্যবহার করা হয়।'
      },
      {
        id: `q_b30_${Date.now()}_10`,
        question: '১০. অপটিক্যাল ফাইবার ক্যাবলে আলোর কোন ঘটনাটির মাধ্যমে ডেটা ট্রান্সমিট হয়?',
        options: ['পূর্ণ অভ্যন্তরীণ প্রতিফলন', 'আলোর প্রতিসরণ', 'আলোর প্রতিফলন', 'আলোর অপবর্তন'],
        correctIndex: 0,
        explanation: 'কোরের মধ্যে আলোর পূর্ণ অভ্যন্তরীণ প্রতিফলন ঘটে।'
      },
      {
        id: `q_b30_${Date.now()}_11`,
        question: '১১. ব্লুটুথ (Bluetooth) কোন ধরনের নেটওয়ার্কের প্রকৃষ্ট উদাহরণ?',
        options: ['PAN', 'LAN', 'MAN', 'WAN'],
        correctIndex: 0,
        explanation: 'ব্লুটুথ স্বল্প দূরত্বের ব্যক্তিগত নেটওয়ার্ক বা PAN।'
      },
      {
        id: `q_b30_${Date.now()}_12`,
        question: '১২. ক্লাউড কম্পিউটিং এর প্রধানতম সুবিধা কোনটি?',
        options: ['যেকোনো স্থান থেকে ইন্টারনেট দিয়ে ডেটা অ্যাক্সেস', 'অতিরিক্ত হার্ডওয়্যার ক্রয়ের ঝামেলা', 'সীমিত ডাটা ব্যাকআপ', 'ধীরগতির ইন্টারনেট প্রয়োজন'],
        correctIndex: 0,
        explanation: 'বিশ্বের যেকোনো প্রান্ত থেকে ফাইল ও সফটওয়্যার ব্যবহার করা যায়।'
      },
      {
        id: `q_b30_${Date.now()}_13`,
        question: '১৩. ডেটাবেজের লজিক্যাল হায়ারার্কিতে সবচেয়ে ক্ষুদ্রতম অংশ কোনটি?',
        options: ['ক্যারেক্টার (Character)', 'ফিল্ড (Field)', 'রেকর্ড (Record)', 'ফাইল (File)'],
        correctIndex: 0,
        explanation: 'ক্যারেক্টার বা বাইট নিয়ে গঠিত হয় ফিল্ড।'
      },
      {
        id: `q_b30_${Date.now()}_14`,
        question: '১৪. সি (C) প্রোগ্রামিং ভাষায় প্রতিটি স্টেটমেন্টের শেষে কোন চিহ্নটি ব্যবহার আবশ্যক?',
        options: ['সেমিকোলন (;)', 'কোলন (:)', 'কমা (,)', 'ফুলস্টপ (.)'],
        correctIndex: 0,
        explanation: 'সি ভাষায় স্টেটমেন্ট সমাপ্তির নির্দেশক হলো সেমিকোলন (;)।'
      },
      {
        id: `q_b30_${Date.now()}_15`,
        question: '১৫. হটস্পট (Hotspot) তৈরিতে নিম্নের কোন প্রযুক্তিটি ব্যবহৃত হতে পারে?',
        options: ['Wi-Fi', 'WiMAX', 'Bluetooth', 'উপরের সবগুলোই'],
        correctIndex: 3,
        explanation: 'Wi-Fi, Bluetooth এবং WiMAX তিনটির মাধ্যমেই ইন্টারনেট শেয়ার বা হটস্পট তৈরি সম্ভব।'
      },
      {
        id: `q_b30_${Date.now()}_16`,
        question: '১৬. ওয়েব পেজে ইমেজ বা ছবি যুক্ত করার জন্য ব্যবহৃত সঠিক ট্যাগ কোনটি?',
        options: ['<img>', '<pic>', '<image>', '<src>'],
        correctIndex: 0,
        explanation: 'HTML-এ ছবি প্রদর্শনের জন্য এম্পটি ট্যাগ <img src="..." /> ব্যবহার করা হয়।'
      },
      {
        id: `q_b30_${Date.now()}_17`,
        question: '১৭. আইপি অ্যাড্রেস IPv4 কত বিটের হয়ে থাকে?',
        options: ['৩২ বিট', '৬৪ বিট', '১২৮ বিট', '১৬ বিট'],
        correctIndex: 0,
        explanation: 'IPv4 অ্যাড্রেস ৩২ বিটের (৪ বাইট) এবং IPv6 অ্যাড্রেস ১২৮ বিটের হয়।'
      },
      {
        id: `q_b30_${Date.now()}_18`,
        question: '১৮. সি প্রোগ্রামিং ভাষায় পুনরাবৃত্তিমূলক কাজের জন্য কোন লুপ স্টেটমেন্ট ব্যবহৃত হয়?',
        options: ['for লুপ', 'while লুপ', 'do-while লুপ', 'উপরের সবগুলোই'],
        correctIndex: 3,
        explanation: 'for, while এবং do-while তিনটি লুপ কন্ট্রোল স্টেটমেন্ট রয়েছে।'
      },
      {
        id: `q_b30_${Date.now()}_19`,
        question: '১৯. তারযুক্ত মাধ্যমের মধ্যে সবচেয়ে দ্রুততম ডেটা ট্রান্সফার স্পিড প্রদান করে কোনটি?',
        options: ['ফাইবার অপটিক ক্যাবল', 'কো-অ্যাক্সিয়াল ক্যাবল', 'টুইস্টেড পেয়ার ক্যাবল', 'টেলিফোন লাইন'],
        correctIndex: 0,
        explanation: 'ফাইবার অপটিক আলোর গতিতে ডাটা পাঠায়।'
      },
      {
        id: `q_b30_${Date.now()}_20`,
        question: '২০. বাইনারি যোগ 1 + 1 এর ফলাফল এবং ক্যারি যথাক্রমে কত?',
        options: ['যোগফল 0, ক্যারি 1', 'যোগফল 1, ক্যারি 0', 'যোগফল 10, ক্যারি 0', 'যোগফল 2, ক্যারি 1'],
        correctIndex: 0,
        explanation: 'বাইনারিতে 1 + 1 = 10; যেখানে 0 হলো সাম এবং 1 হলো ক্যারি।'
      },
      {
        id: `q_b30_${Date.now()}_21`,
        question: '২১. কোন লজিক গেটের সকল ইনপুট ১ (High) হলে আউটপুট ০ (Low) হয়?',
        options: ['NAND গেট', 'AND গেট', 'OR গেট', 'XOR গেট'],
        correctIndex: 0,
        explanation: 'NAND গেট হলো AND গেটের বিপরীত।'
      },
      {
        id: `q_b30_${Date.now()}_22`,
        question: '২২. HTML এ সবচেয়ে বড় আকারের শিরোনাম প্রদর্শনের ট্যাগ কোনটি?',
        options: ['<h1>', '<h6>', '<head>', '<header>'],
        correctIndex: 0,
        explanation: 'HTML এ h1 সবচেয়ে বড় এবং h6 সবচেয়ে ছোট শিরোনাম।'
      },
      {
        id: `q_b30_${Date.now()}_23`,
        question: '২৩. ন্যানোপ্রযুক্তির (Nanotechnology) পরিমাপক স্কেল কোনটি?',
        options: ['১ থেকে ১০০ ন্যানোমিটার', '১ থেকে ১০০০ ন্যানোমিটার', '০.১ থেকে ১০ ন্যানোমিটার', '১০ থেকে ১০০ মাইক্রন'],
        correctIndex: 0,
        explanation: '১ থেকে ১০০ ন্যানোমিটার স্কেলকে ন্যানো স্কেল বলা হয়।'
      },
      {
        id: `q_b30_${Date.now()}_24`,
        question: '২৪. নিচের কোনটি ক্লাউড ডেটাবেজ স্টোরেজের উদাহরণ?',
        options: ['Google Drive / Firebase', 'RAM', 'ROM', 'ক্যাশ মেমোরি'],
        correctIndex: 0,
        explanation: 'Google Drive ও Firebase রিয়েলটাইম ক্লাউড স্টোরেজ সেবা প্রদান করে।'
      },
      {
        id: `q_b30_${Date.now()}_25`,
        question: '২৫. এইচটিটিপিএস (HTTPS) এ ব্যবহৃত "S" অক্ষরটি কী নির্দেশ করে?',
        options: ['Secure', 'Standard', 'Server', 'System'],
        correctIndex: 0,
        explanation: 'HTTPS পূর্ণরূপ HyperText Transfer Protocol Secure।'
      },
      {
        id: `q_b30_${Date.now()}_26`,
        question: '২৬. সি প্রোগ্রামে আউটপুট প্রদর্শনের জন্য প্রধান ফাংশন কোনটি?',
        options: ['printf()', 'scanf()', 'getch()', 'main()'],
        correctIndex: 0,
        explanation: 'printf() ফাংশন মনিটরে টেক্সট প্রদর্শন করতে ব্যবহৃত হয়।'
      },
      {
        id: `q_b30_${Date.now()}_27`,
        question: '২৭. এইচটিএমএল-এ একটি টেবিলের রো (Row) তৈরি করার ট্যাগ কোনটি?',
        options: ['<tr>', '<td>', '<th>', '<table>'],
        correctIndex: 0,
        explanation: '<tr> নির্দেশ করে Table Row।'
      },
      {
        id: `q_b30_${Date.now()}_28`,
        question: '২৮. ওয়াইফাই (Wi-Fi) এর স্ট্যান্ডার্ড কোনটি?',
        options: ['IEEE 802.11', 'IEEE 802.15', 'IEEE 802.16', 'IEEE 802.3'],
        correctIndex: 0,
        explanation: 'Wi-Fi এর স্ট্যান্ডার্ড IEEE 802.11।'
      },
      {
        id: `q_b30_${Date.now()}_29`,
        question: '২৯. নিচের কোনটি ডেটাবেজ রিলেশনশিপের ধরন নয়?',
        options: ['One to One', 'One to Many', 'Many to Many', 'Single to All'],
        correctIndex: 3,
        explanation: 'ডেটাবেজ রিলেশন: One to One, One to Many এবং Many to Many।'
      },
      {
        id: `q_b30_${Date.now()}_30`,
        question: '৩০. বিশ্বব্যাপী ওয়েবসাইট ব্রাউজ করার জন্য যে সফটওয়্যার ব্যবহৃত হয় তাকে বলে—',
        options: ['ওয়েব ব্রাউজার', 'সার্চ ইঞ্জিন', 'সার্ভার', 'আইএসপি'],
        correctIndex: 0,
        explanation: 'Google Chrome, Firefox ইত্যাদির মাধ্যমে ওয়েব পেজ প্রদর্শন করা হয়।'
      }
    ];

    setMcqCh(prev => prev.map(ch => {
      if (ch.id !== chapId) return ch;
      return { ...ch, questions: board30 };
    }));
    syncInstantToCloud({
      mcqCh: mcqCh.map(ch => ch.id !== chapId ? ch : { ...ch, questions: board30 })
    });
    triggerToast('✓ ৩০টি আদর্শ বোর্ড নৈর্ব্যক্তিক সফলভাবে লোড ও সেভ হয়েছে!');
  };

  const handleBulkAddMCQs = (chapId: string, rawText: string) => {
    if (!rawText.trim()) return;
    const blocks = rawText.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    const newQuestions: MCQQuestionItem[] = [];

    blocks.forEach((block, bIdx) => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      let question = '';
      const options: string[] = [];
      let correctIndex = 0;
      let explanation = '';

      lines.forEach(line => {
        const ansMatch = line.match(/^(?:উত্তর|ans|answer|সঠিক(?:\s*উত্তর)?)\s*[:：\-]?\s*([কখগঘabcdABCD১-৪1-4])/i);
        if (ansMatch) {
          const rawAns = ansMatch[1].toLowerCase();
          if (rawAns === 'ক' || rawAns === 'a' || rawAns === '১' || rawAns === '1') correctIndex = 0;
          else if (rawAns === 'খ' || rawAns === 'b' || rawAns === '২' || rawAns === '2') correctIndex = 1;
          else if (rawAns === 'গ' || rawAns === 'c' || rawAns === '৩' || rawAns === '3') correctIndex = 2;
          else if (rawAns === 'ঘ' || rawAns === 'd' || rawAns === '৪' || rawAns === '4') correctIndex = 3;
          return;
        }

        const expMatch = line.match(/^(?:ব্যাখ্যা|explanation|note|নোট)\s*[:：\-]?\s*(.*)/i);
        if (expMatch) {
          explanation = expMatch[1].trim();
          return;
        }

        const optMatch = line.match(/^(?:[কখগঘabcdABCD১-৪]|\([কখগঘabcdABCD১-৪]\))\s*[\.\)ঃ:\-]\s*(.*)/);
        if (optMatch) {
          options.push(optMatch[1].trim());
          return;
        }

        if (options.length === 0) {
          const cleanQ = line.replace(/^[০-৯\d]+[\.\)\-:\s]*/, '').trim();
          question = question ? `${question} ${cleanQ}` : cleanQ;
        } else {
          if (options.length < 4) {
            options.push(line);
          } else {
            explanation = explanation ? `${explanation} ${line}` : line;
          }
        }
      });

      if (!question && lines.length > 0) {
        question = lines[0].replace(/^[০-৯\d]+[\.\)\-:\s]*/, '').trim();
      }

      while (options.length < 4) {
        const idx = options.length;
        options.push(['অপশন ক', 'অপশন খ', 'অপশন গ', 'অপশন ঘ'][idx]);
      }

      newQuestions.push({
        id: `q_${Date.now()}_${bIdx}_${Math.random().toString(36).substring(2, 6)}`,
        question: question || `প্রশ্ন ${bIdx + 1}`,
        options: options.slice(0, 4),
        correctIndex,
        explanation: explanation || 'সঠিক উত্তর যাচাই করুন।'
      });
    });

    if (newQuestions.length > 0) {
      setMcqCh(prev => prev.map(ch => {
        if (ch.id !== chapId) return ch;
        return { ...ch, questions: [...ch.questions, ...newQuestions] };
      }));
      setBulkMCQText('');
      setBulkMCQOpen(false);
      triggerToast(`✓ ${newQuestions.length}টি প্রশ্ন একসাথে যোগ হয়েছে!`);
    }
  };

  const handleDuplicateQuestion = (chapId: string, qId: string) => {
    setMcqCh(prev => prev.map(ch => {
      if (ch.id !== chapId) return ch;
      const orig = ch.questions.find(q => q.id === qId);
      if (!orig) return ch;
      const cloned: MCQQuestionItem = {
        ...orig,
        id: `q_${Date.now()}`,
        question: `${orig.question} (কপি)`
      };
      return { ...ch, questions: [...ch.questions, cloned] };
    }));
    triggerToast('✓ প্রশ্ন ক্লোন করা হয়েছে!');
  };

  // Prompt / Execute Delete MCQ Question
  const promptDeleteQuestion = (chapId: string, q: MCQQuestionItem) => {
    setDeleteModal({
      type: 'question',
      id: q.id,
      extraId: chapId,
      title: q.question,
      subtitle: 'এই এমসিকিউ প্রশ্নটি মুছে ফেলা হবে।'
    });
  };

  const executeDeleteQuestion = (chapId: string, qId: string) => {
    const next = mcqCh.map(ch => ch.id !== chapId ? ch : { ...ch, questions: ch.questions.filter(q => q.id !== qId) });
    setMcqCh(next);
    syncInstantToCloud({ mcqCh: next });
    triggerToast('✓ প্রশ্ন সফলভাবে মুছে ফেলা হয়েছে');
  };

  const handleDeleteQuestion = (chapId: string, qId: string) => {
    const chap = mcqCh.find(c => c.id === chapId);
    const q = chap?.questions.find(item => item.id === qId);
    if (q) {
      promptDeleteQuestion(chapId, q);
    } else {
      executeDeleteQuestion(chapId, qId);
    }
  };

  // Global Confirm Delete Execution
  const confirmExecuteDelete = () => {
    if (!deleteModal) return;
    const { type, id, extraId } = deleteModal;
    if (type === 'class') {
      executeDeleteClass(id);
    } else if (type === 'subject') {
      executeDeleteSubject(id);
    } else if (type === 'chapter') {
      executeDeleteChapter(id);
    } else if (type === 'video' && extraId) {
      executeDeleteVideo(extraId, id);
    } else if (type === 'question' && extraId) {
      executeDeleteQuestion(extraId, id);
    }
    setDeleteModal(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 antialiased flex flex-col justify-between">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* IN-APP CONFIRMATION MODAL (Avoids native window.confirm blocked in iframes) */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-4 sm:p-5 shadow-2xl border border-rose-100 space-y-3.5 transform transition-all"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {deleteModal.type === 'class' && 'শ্রেণি মুছে ফেলবেন?'}
                  {deleteModal.type === 'subject' && 'বিষয় মুছে ফেলবেন?'}
                  {deleteModal.type === 'chapter' && 'অধ্যায় মুছে ফেলবেন?'}
                  {deleteModal.type === 'video' && 'ভিডিও লেকচার মুছে ফেলবেন?'}
                  {deleteModal.type === 'question' && 'এমসিকিউ প্রশ্ন মুছে ফেলবেন?'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  মুছে ফেলার পর এটি সাথে সাথে ইউজার প্যানেল থেকেও চলে যাবে।
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-800 line-clamp-2">
                {deleteModal.title}
              </p>
              {deleteModal.subtitle && (
                <p className="text-[10px] text-rose-600 font-semibold mt-1">
                  ⚠️ {deleteModal.subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={confirmExecuteDelete}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>হ্যাঁ, মুছে ফেলুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header - Compact & Shortcut Oriented */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 py-1.5 shadow-xs">
        <div className="max-w-4xl mx-auto space-y-1.5">
          {/* Top Row: Quick actions & Brand */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onExitAdmin}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors shrink-0"
              title="ইউজার ভিউতে ফিরে যান"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ইউজার ভিউ</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">
                এডমিন: <span className="text-amber-600">
                  {activeSection === 'home' ? 'হোম কন্টেন্ট' : activeSection === 'courses' ? 'কোর্স কন্টেন্ট' : activeSection === 'mcq' ? 'এমসিকিউ কন্টেন্ট' : activeSection === 'ads' ? 'বিজ্ঞাপন ব্যবস্থাপনা' : 'ফায়ারবেস ক্লাউড'}
                </span>
              </span>
            </div>

            <button
              onClick={handleSaveCurrent}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
              title="পরিবর্তন সেভ করুন"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সেভ</span>
            </button>
          </div>

          {/* SECTION SWITCHER: 5 SEPARATE TABS INCLUDING ADS MANAGEMENT */}
          <div className="grid grid-cols-5 gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => handleSwitchSection('home')}
              className={`py-1 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                activeSection === 'home'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Home className="w-3 h-3" />
              <span className="truncate">১. হোম</span>
            </button>

            <button
              onClick={() => handleSwitchSection('courses')}
              className={`py-1 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                activeSection === 'courses'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span className="truncate">২. কোর্স</span>
            </button>

            <button
              onClick={() => handleSwitchSection('mcq')}
              className={`py-1 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                activeSection === 'mcq'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <CheckSquare className="w-3 h-3" />
              <span className="truncate">৩. এমসিকিউ</span>
            </button>

            <button
              onClick={() => handleSwitchSection('ads')}
              className={`py-1 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                activeSection === 'ads'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Megaphone className="w-3 h-3" />
              <span className="truncate">৪. অ্যাডস</span>
            </button>

            <button
              onClick={() => handleSwitchSection('firebase')}
              className={`py-1 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                activeSection === 'firebase'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Cloud className="w-3 h-3" />
              <span className="truncate">৫. ক্লাউড</span>
            </button>
          </div>

          {/* 4-Step Wizard Stepper - Visible only for Home, Courses, MCQ */}
          {activeSection !== 'firebase' && activeSection !== 'ads' && (
            <div className="grid grid-cols-4 gap-1 text-[11px] font-bold">
              {[
                { step: 1, label: '১. শ্রেণি' },
                { step: 2, label: '২. বিষয়' },
                { step: 3, label: '৩. অধ্যায়' },
                { step: 4, label: activeSection === 'mcq' ? '৪. প্রশ্ন' : '৪. ভিডিও' }
              ].map(s => (
                <button
                  key={s.step}
                  onClick={() => {
                    handleSaveCurrent();
                    setCurrentStep(s.step as 1 | 2 | 3 | 4);
                  }}
                  className={`py-1 px-1 rounded-lg text-center border transition-all ${
                    currentStep === s.step
                      ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Form - Compact Padding */}
      <main className="max-w-4xl w-full mx-auto p-2 sm:p-3 flex-1">
        
        {/* FIREBASE CLOUD SETTINGS TAB */}
        {activeSection === 'firebase' && (
          <FirebaseAdminSettings
            currentAllData={getAllCurrentData()}
            onDataSyncSuccess={triggerToast}
          />
        )}

        {/* ADS MANAGEMENT TAB */}
        {activeSection === 'ads' && (
          <AdsAdminManager
            adsConfig={currentAdsConfig}
            onSaveAds={handleSaveAdsFromManager}
            onTriggerToast={triggerToast}
          />
        )}

        {/* STEP 1: CLASSES */}
        {activeSection !== 'firebase' && activeSection !== 'ads' && currentStep === 1 && (
          <div className="space-y-2.5 animate-fade-in">
            {/* Quick Add Bar & Presets for Class */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-2.5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>দ্রুত নতুন শ্রেণি যোগ করুন:</span>
                </div>
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-100/80 px-2 py-0.5 rounded-full">
                  মোট: {currentClasses.length}টি শ্রেণি
                </span>
              </div>

              {/* Inline Input Form */}
              <form 
                onSubmit={e => {
                  e.preventDefault();
                  handleAddClassQuick(quickClassTitle, quickClassSub);
                }}
                className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap"
              >
                <input
                  type="text"
                  value={quickClassTitle}
                  onChange={e => setQuickClassTitle(e.target.value)}
                  placeholder="শ্রেণির নাম (যেমন: ৯ম শ্রেণি)..."
                  className="flex-1 min-w-[140px] text-xs font-bold py-1.5 px-2.5 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                />
                <input
                  type="text"
                  value={quickClassSub}
                  onChange={e => setQuickClassSub(e.target.value)}
                  placeholder="সাবটাইটেল (ঐচ্ছিক)..."
                  className="flex-1 min-w-[130px] text-xs py-1.5 px-2.5 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={!quickClassTitle.trim()}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-2xs active:scale-95 shrink-0 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ যোগ করুন</span>
                </button>
              </form>
            </div>

            {/* List of Classes */}
            <div className="space-y-2">
              {currentClasses.map((cls, idx) => {
                const subCount = currentSubjects.filter(s => s.classId === cls.id).length;

                return (
                  <div key={cls.id} className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={cls.title}
                          onChange={e => handleUpdateClass(cls.id, 'title', e.target.value)}
                          className="text-xs font-bold py-1 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                          placeholder="শ্রেণির নাম"
                        />
                        <input
                          type="text"
                          value={cls.subtitle}
                          onChange={e => handleUpdateClass(cls.id, 'subtitle', e.target.value)}
                          className="text-xs py-1 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                          placeholder="সাবটাইটেল"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Direct jump to Step 2 for this class */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 pl-8 pr-1">
                      <span className="text-[11px] text-slate-500 font-medium">
                        বিষয় সংখ্যা: <strong className="text-slate-700">{subCount}টি</strong>
                      </span>
                      <button
                        onClick={() => {
                          handleSelectClass(cls.id);
                          setCurrentStep(2);
                        }}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                      >
                        <span>২. বিষয়সমূহ যোগ/এডিট করুন ({subCount})</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: SUBJECTS */}
        {activeSection !== 'firebase' && activeSection !== 'ads' && currentStep === 2 && (
          <div className="space-y-2.5 animate-fade-in">
            {/* Header with Class Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700">নির্বাচিত শ্রেণি:</span>
                <select
                  value={currentClass?.id || selectedClassId}
                  onChange={e => handleSelectClass(e.target.value)}
                  className="text-xs py-1 px-2 rounded-lg border border-slate-300 bg-white font-bold max-w-[170px] truncate"
                >
                  {currentClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <span className="text-[11px] text-slate-500 font-semibold">
                মোট বিষয়: <strong className="text-blue-700">{currentClassSubjects.length}টি</strong>
              </span>
            </div>

            {/* Quick Add Bar & Subject Presets */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl p-2.5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>"{currentClass?.title}"-এ দ্রুত বিষয় যোগ করুন:</span>
                </div>
              </div>

              {/* Inline Input Form */}
              <form 
                onSubmit={e => {
                  e.preventDefault();
                  handleAddSubjectQuick(quickSubName, quickSubSub);
                }}
                className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap"
              >
                <input
                  type="text"
                  value={quickSubName}
                  onChange={e => setQuickSubName(e.target.value)}
                  placeholder="বিষয়ের নাম (যেমন: পদার্থবিজ্ঞান ১ম পত্র)..."
                  className="flex-1 min-w-[150px] text-xs font-bold py-1.5 px-2.5 rounded-lg bg-white border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
                <input
                  type="text"
                  value={quickSubSub}
                  onChange={e => setQuickSubSub(e.target.value)}
                  placeholder="সাবটাইটেল (ঐচ্ছিক)..."
                  className="flex-1 min-w-[130px] text-xs py-1.5 px-2.5 rounded-lg bg-white border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={!quickSubName.trim()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-2xs active:scale-95 shrink-0 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ বিষয় যোগ</span>
                </button>
              </form>
            </div>

            {/* List of Subjects */}
            <div className="space-y-2">
              {currentClassSubjects.map((sub, idx) => {
                const subChaptersCount = (activeSection === 'mcq' ? mcqCh : currentVideoChapters).filter(ch => ch.subjectId === sub.id).length;

                return (
                  <div key={sub.id} className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={e => handleUpdateSubject(sub.id, 'name', e.target.value)}
                          className="text-xs font-bold py-1 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                          placeholder="বিষয়ের নাম"
                        />
                        <input
                          type="text"
                          value={sub.subtitle}
                          onChange={e => handleUpdateSubject(sub.id, 'subtitle', e.target.value)}
                          className="text-xs py-1 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                          placeholder="সাবটাইটেল"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteSubject(sub.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Direct jump to this subject's chapters */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 pl-8 pr-1">
                      <span className="text-[11px] text-slate-500 font-medium">
                        অধ্যায় সংখ্যা: <strong className="text-slate-700">{subChaptersCount}টি</strong>
                      </span>
                      <button
                        onClick={() => {
                          handleSelectSubject(sub.id);
                          setCurrentStep(3);
                        }}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                      >
                        <span>৩. অধ্যায়সমূহ যোগ/এডিট করুন ({subChaptersCount})</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {currentClassSubjects.length === 0 && (
                <div className="p-4 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                  এই শ্রেণিতে এখনও কোনো বিষয় নেই। উপরের ফরম থেকে সহজে বিষয় যোগ করুন।
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: CHAPTERS */}
        {activeSection !== 'firebase' && activeSection !== 'ads' && currentStep === 3 && (
          <div className="space-y-2.5 animate-fade-in">
            {/* Header controls with Class & Subject selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-700">শ্রেণি:</span>
                  <select
                    value={currentClass?.id || selectedClassId}
                    onChange={e => handleSelectClass(e.target.value)}
                    className="text-xs py-1 px-2 rounded-lg border border-slate-300 bg-white font-bold max-w-[130px] truncate"
                  >
                    {currentClasses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-700">বিষয়:</span>
                  <select
                    value={currentSubject?.id || selectedSubjectId}
                    onChange={e => handleSelectSubject(e.target.value)}
                    className="text-xs py-1 px-2 rounded-lg border border-slate-300 bg-white font-bold max-w-[140px] truncate"
                  >
                    {currentClassSubjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <span className="text-[11px] text-slate-500 font-semibold">
                মোট অধ্যায়: <strong className="text-purple-700">
                  {(activeSection === 'mcq' ? currentSubjectMCQChapters : currentSubjectVideoChapters).length}টি
                </strong>
              </span>
            </div>

            {/* Quick Add Bar & Chapter Presets */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/80 rounded-xl p-2.5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>"{currentSubject?.name}"-এ দ্রুত অধ্যায় যোগ করুন:</span>
                </div>
              </div>

              {/* Inline Input Form */}
              <form 
                onSubmit={e => {
                  e.preventDefault();
                  handleAddChapterQuick(quickChapNum, quickChapTitle);
                }}
                className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap"
              >
                <input
                  type="text"
                  value={quickChapNum}
                  onChange={e => setQuickChapNum(e.target.value)}
                  placeholder={`অধ্যায় নং (${(activeSection === 'mcq' ? currentSubjectMCQChapters : currentSubjectVideoChapters).length + 1}ম অধ্যায়)...`}
                  className="w-28 sm:w-32 text-xs font-bold py-1.5 px-2.5 rounded-lg bg-white border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-2xs"
                />
                <input
                  type="text"
                  value={quickChapTitle}
                  onChange={e => setQuickChapTitle(e.target.value)}
                  placeholder="অধ্যায়ের নাম (যেমন: ভেক্টর)..."
                  className="flex-1 min-w-[140px] text-xs font-bold py-1.5 px-2.5 rounded-lg bg-white border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={!quickChapTitle.trim() && !quickChapNum.trim()}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-2xs active:scale-95 shrink-0 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ অধ্যায় যোগ</span>
                </button>
              </form>
            </div>

            {/* Chapters list for current subject */}
            <div className="space-y-2">
              {(activeSection === 'mcq' ? currentSubjectMCQChapters : currentSubjectVideoChapters).map((chap, idx) => {
                const count = activeSection === 'mcq' 
                  ? (chap as MCQChapterItem).questions?.length || 0 
                  : (chap as ChapterItem).videos?.length || 0;
                const label = activeSection === 'mcq' ? 'প্রশ্ন' : 'ভিডিও';

                return (
                  <div key={chap.id} className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                        <input
                          type="text"
                          value={chap.chapterNumber}
                          onChange={e => handleUpdateChapter(chap.id, 'chapterNumber', e.target.value)}
                          className="text-xs font-bold py-1 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                          placeholder="অধ্যায় নম্বর (১ম অধ্যায়)"
                        />
                        <input
                          type="text"
                          value={chap.title}
                          onChange={e => handleUpdateChapter(chap.id, 'title', e.target.value)}
                          className="text-xs font-bold py-1 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                          placeholder="অধ্যায়ের নাম"
                        />
                        <input
                          type="text"
                          value={chap.subtitle}
                          onChange={e => handleUpdateChapter(chap.id, 'subtitle', e.target.value)}
                          className="text-xs py-1 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                          placeholder="সাবটাইটেল"
                        />
                      </div>

                      {/* Clone & Delete buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleDuplicateChapter(chap.id)}
                          className="text-slate-400 hover:text-purple-600 p-1 transition-colors"
                          title="এই অধ্যায়টি ক্লোন / ডুপ্লিকেট করুন"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(chap.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Direct button to open and edit content for this specific chapter */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 pl-8 pr-1">
                      <span className="text-[11px] text-slate-500 font-medium">
                        কন্টেন্ট সংখ্যা: <strong className="text-slate-800">{count}টি {label}</strong>
                      </span>
                      <button
                        onClick={() => {
                          handleSelectChapter(chap.id);
                          setCurrentStep(4);
                        }}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all ${
                          activeSection === 'mcq'
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                        title={`এই অধ্যায়ের ${label} এডিট করতে ক্লিক করুন`}
                      >
                        {activeSection === 'mcq' ? <CheckSquare className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                        <span>৪. এই অধ্যায়ের {label} যোগ/এডিট করুন ({count})</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {(activeSection === 'mcq' ? currentSubjectMCQChapters : currentSubjectVideoChapters).length === 0 && (
                <div className="p-4 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs space-y-1">
                  <p className="font-semibold text-slate-700">"{currentSubject?.name}" বিষয়ে কোনো অধ্যায় নেই।</p>
                  <p className="text-[11px] text-slate-400">উপরে 'দ্রুত অধ্যায় যোগ করুন' ফরম থেকে বাটন চাপুন।</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: VIDEOS OR MCQ QUESTIONS */}
        {activeSection !== 'firebase' && activeSection !== 'ads' && currentStep === 4 && (
          <div className="space-y-2.5 animate-fade-in">
            {/* Top Breadcrumb Context Banner - Clarifies Class > Subject > Chapter hierarchy */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200 rounded-xl p-2 sm:p-2.5 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs flex-wrap font-bold">
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-extrabold">
                    শ্রেণি: {currentClass?.title || 'নির্ধারিত নয়'}
                  </span>
                  <span className="text-slate-400">❯</span>
                  <span className="text-[10px] text-blue-800 bg-blue-100 px-2 py-0.5 rounded font-extrabold">
                    বিষয়: {currentSubject?.name || 'নির্ধারিত নয়'}
                  </span>
                  <span className="text-slate-400">❯</span>
                  <span className="text-[10px] text-purple-900 bg-purple-100 px-2 py-0.5 rounded font-extrabold">
                    অধ্যায়: {activeSection === 'mcq'
                      ? (currentMCQChapter?.chapterNumber ? `${currentMCQChapter.chapterNumber} - ${currentMCQChapter.title}` : 'কোনো অধ্যায় নেই')
                      : (currentVideoChapter?.chapterNumber ? `${currentVideoChapter.chapterNumber} - ${currentVideoChapter.title}` : 'কোনো অধ্যায় নেই')}
                  </span>
                </div>

                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-[11px] font-bold text-amber-800 bg-white hover:bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-lg shadow-2xs flex items-center gap-1 transition-all active:scale-95"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>↶ অধ্যায় তালিকা</span>
                </button>
              </div>
            </div>

            {/* Cascading Filter Bar for Step 4 */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-700">শ্রেণি:</span>
                  <select
                    value={currentClass?.id || selectedClassId}
                    onChange={e => handleSelectClass(e.target.value)}
                    className="text-xs py-1 px-1.5 rounded-lg border border-slate-300 bg-white font-bold max-w-[110px] truncate"
                  >
                    {currentClasses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-700">বিষয়:</span>
                  <select
                    value={currentSubject?.id || selectedSubjectId}
                    onChange={e => handleSelectSubject(e.target.value)}
                    className="text-xs py-1 px-1.5 rounded-lg border border-slate-300 bg-white font-bold max-w-[120px] truncate"
                  >
                    {currentClassSubjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-700">অধ্যায়:</span>
                  <select
                    value={activeSection === 'mcq' ? currentMCQChapter?.id || '' : currentVideoChapter?.id || ''}
                    onChange={e => handleSelectChapter(e.target.value)}
                    className="text-xs py-1 px-1.5 rounded-lg border border-slate-300 bg-white font-bold max-w-[150px] truncate"
                  >
                    {(activeSection === 'mcq' ? currentSubjectMCQChapters : currentSubjectVideoChapters).map(ch => {
                      const count = activeSection === 'mcq' ? (ch as MCQChapterItem).questions?.length || 0 : (ch as ChapterItem).videos?.length || 0;
                      const label = activeSection === 'mcq' ? 'টি প্রশ্ন' : 'টি ভিডিও';
                      return (
                        <option key={ch.id} value={ch.id}>
                          {ch.chapterNumber}: {ch.title} ({count}{label})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Header Action Button */}
              {activeSection !== 'mcq' ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setBulkVideoOpen(prev => !prev)}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>{bulkVideoOpen ? 'বাল্ক বন্ধ' : '📋 একসাথে অনেক যোগ'}</span>
                  </button>
                  <button
                    onClick={() => currentVideoChapter && handleAddVideo(currentVideoChapter.id)}
                    disabled={!currentVideoChapter}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-2xs active:scale-95 shrink-0 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ ভিডিও যোগ</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setBulkMCQOpen(prev => !prev)}
                    className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>{bulkMCQOpen ? 'বাল্ক বন্ধ' : '📋 একসাথে অনেক প্রশ্ন'}</span>
                  </button>
                  <button
                    onClick={() => currentMCQChapter && handleAddQuestion(currentMCQChapter.id)}
                    disabled={!currentMCQChapter}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 shadow-2xs active:scale-95 shrink-0 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ প্রশ্ন যোগ</span>
                  </button>
                </div>
              )}
            </div>

            {activeSection !== 'mcq' ? (
              // Video playlist editor for Home & Courses
              currentSubjectVideoChapters.length === 0 ? (
                <div className="p-6 text-center bg-white rounded-xl border border-dashed border-amber-300 space-y-2">
                  <p className="text-xs font-bold text-slate-800">
                    "{currentSubject?.name}" বিষয়ে কোনো অধ্যায় নেই।
                  </p>
                  <p className="text-[11px] text-slate-500">
                    ভিডিও যোগ করার জন্য প্রথমে ৩য় ধাপে গিয়ে একটি অধ্যায় তৈরি করুন।
                  </p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-2xs inline-flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>৩য় ধাপে অধ্যায় যোগ করতে যান</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {/* QUICK ADD VIDEO BAR */}
                  {currentVideoChapter && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-xl p-2.5 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                          <Zap className="w-4 h-4 text-emerald-600" />
                          <span>ইউটিউব লিঙ্ক থেকে দ্রুত ভিডিও যোগ করুন:</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-full">
                          {currentVideoChapter.videos.length}টি ক্লাস বিদ্যমান
                        </span>
                      </div>

                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          if (currentVideoChapter) {
                            handleAddVideoQuick(currentVideoChapter.id, quickVidTitle, quickVidUrl, quickVidDuration);
                          }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-1.5"
                      >
                        <input
                          type="text"
                          value={quickVidTitle}
                          onChange={e => setQuickVidTitle(e.target.value)}
                          placeholder={`ভিডিও নাম (যেমন: লেকচার ${currentVideoChapter.videos.length + 1})...`}
                          className="sm:col-span-5 text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-white border border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                        />
                        <input
                          type="text"
                          value={quickVidUrl}
                          onChange={e => setQuickVidUrl(e.target.value)}
                          placeholder="ইউটিউব লিঙ্ক পেস্ট করুন (youtu.be/... বা watch?v=)..."
                          className="sm:col-span-5 text-xs py-1.5 px-2.5 rounded-lg bg-white border border-emerald-300 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                        />
                        <button
                          type="submit"
                          disabled={!quickVidUrl.trim() && !quickVidTitle.trim()}
                          className="sm:col-span-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ যোগ</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* BULK ADD VIDEOS DRAWER */}
                  {bulkVideoOpen && currentVideoChapter && (
                    <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3 shadow-sm space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                          <ListPlus className="w-4 h-4 text-amber-600" />
                          <span>একসাথে একাধিক ভিডিও যোগ করুন (Bulk YouTube Links):</span>
                        </div>
                        <button
                          onClick={() => setBulkVideoOpen(false)}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-600">
                        প্রতি লাইনে একটি করে ইউটিউব লিঙ্ক পেস্ট করুন। প্রয়োজনে লিঙ্কের আগে ভিডিওর নামও দিতে পারেন (যেমন: <code className="bg-white px-1 py-0.5 rounded border border-amber-200">লেকচার ১ - https://youtu.be/...</code>)
                      </p>

                      <textarea
                        rows={4}
                        value={bulkVideoText}
                        onChange={e => setBulkVideoText(e.target.value)}
                        placeholder={`https://youtu.be/zF_QuSpQdsI\nhttps://youtu.be/dQw4w9WgXcQ\nলেকচার ৩ - https://www.youtube.com/watch?v=...`}
                        className="w-full text-xs font-mono p-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                      />

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setBulkVideoText(`লেকচার ১: ভূমিকা ও প্রাথমিক ধারণা - https://youtu.be/zF_QuSpQdsI\nলেকচার ২: সূত্রাবলী ও উদাহরণ - https://youtu.be/dQw4w9WgXcQ\nলেকচার ৩: গাণিতিক সমাধান - https://youtu.be/jNQXAC9IVRw`)}
                          className="text-[10px] text-amber-800 underline hover:text-amber-900 font-semibold"
                        >
                          নমুনা লিঙ্ক পেস্ট করুন
                        </button>

                        <button
                          onClick={() => handleBulkAddVideos(currentVideoChapter.id, bulkVideoText)}
                          disabled={!bulkVideoText.trim()}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>সবগুলো একসাথে যোগ করুন</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Video List */}
                  {currentVideoChapter?.videos.map((vid, vIdx) => {
                    const isUploading = uploadingVidId === vid.id;
                    const autoYtThumb = getYouTubeThumb(vid.youtubeUrl);
                    const effectiveThumb = vid.thumbnail || autoYtThumb;

                    return (
                      <div key={vid.id} className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                        {/* Title, Duration, Clone, Delete */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-slate-700 shrink-0">ভিডিও {vIdx + 1}</span>
                          <input
                            type="text"
                            value={vid.title}
                            onChange={e => handleUpdateVideo(currentVideoChapter.id, vid.id, 'title', e.target.value)}
                            className="flex-1 text-xs font-semibold py-1 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white"
                            placeholder="ভিডিও শিরোনাম"
                          />
                          <input
                            type="text"
                            value={vid.duration}
                            onChange={e => handleUpdateVideo(currentVideoChapter.id, vid.id, 'duration', e.target.value)}
                            className="w-20 text-xs py-1 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white text-center"
                            placeholder="সময় (২৫:০০)"
                          />
                          
                          {/* Clone & Delete */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleDuplicateVideo(currentVideoChapter.id, vid.id)}
                              className="text-slate-400 hover:text-emerald-600 p-1 transition-colors"
                              title="এই ভিডিওটি ক্লোন / ডুপ্লিকেট করুন"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(currentVideoChapter.id, vid.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 shrink-0 transition-colors"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Instructor & YouTube URL */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            value={vid.instructor}
                            onChange={e => handleUpdateVideo(currentVideoChapter.id, vid.id, 'instructor', e.target.value)}
                            className="text-xs py-1 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white"
                            placeholder="শিক্ষকের নাম"
                          />
                          <input
                            type="text"
                            value={vid.youtubeUrl}
                            onChange={e => handleUpdateVideo(currentVideoChapter.id, vid.id, 'youtubeUrl', e.target.value)}
                            className="text-xs py-1 px-2 rounded-md bg-slate-50 border border-slate-200 font-mono focus:bg-white"
                            placeholder="ইউটিউব লিঙ্ক / ID"
                          />
                        </div>

                        {/* Video Thumbnail & Gallery Photo Upload */}
                        <div className="bg-slate-50/90 rounded-lg p-2 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                          {/* Thumbnail preview */}
                          <div className="flex items-center gap-2.5 w-full sm:w-auto">
                            <div className="relative w-16 h-10 sm:w-20 sm:h-12 rounded-md overflow-hidden bg-slate-800 shrink-0 border border-slate-300 shadow-2xs">
                              {effectiveThumb ? (
                                <img
                                  src={effectiveThumb}
                                  alt="Thumbnail"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                  <ImageIcon className="w-5 h-5 text-slate-400" />
                                </div>
                              )}
                              {isUploading && (
                                <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-white">
                                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[11px] font-bold text-slate-700">থাম্বনেইল:</span>
                                {vid.thumbnail ? (
                                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                    ✓ কাস্টম গ্যালারি ফটো
                                  </span>
                                ) : autoYtThumb ? (
                                  <span className="text-[10px] font-medium bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                                    ইউটিউব থাম্বনেইল
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">কোনো ফটো নেই</span>
                                )}
                              </div>
                              <input
                                type="text"
                                value={vid.thumbnail || ''}
                                onChange={e => handleUpdateVideo(currentVideoChapter.id, vid.id, 'thumbnail', e.target.value)}
                                className="w-full mt-1 text-[11px] py-0.5 px-1.5 rounded bg-white border border-slate-200 font-mono text-slate-600 focus:outline-none"
                                placeholder="ফটো লিঙ্ক (স্বয়ংক্রিয়ভাবে বসবে বা পেস্ট করুন)"
                              />
                            </div>
                          </div>

                          {/* Upload Actions */}
                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            <label className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all ${
                              isUploading 
                                ? 'bg-amber-100 text-amber-600 cursor-not-allowed'
                                : 'bg-amber-500 hover:bg-amber-600 text-white'
                            }`}>
                              {isUploading ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>আপলোড হচ্ছে...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>গ্যালারি ফটো আপলোড</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploading}
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleUploadThumbnail(currentVideoChapter.id, vid.id, file);
                                  }
                                  e.target.value = '';
                                }}
                              />
                            </label>

                            {vid.thumbnail && (
                              <button
                                onClick={() => handleUpdateVideo(currentVideoChapter.id, vid.id, 'thumbnail', '')}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded bg-white border border-slate-200"
                                title="কাস্টম ফটো মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {currentVideoChapter && currentVideoChapter.videos.length === 0 && (
                    <div className="p-4 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                      এই অধ্যায়ে এখনও কোনো ভিডিও যোগ করা হয়নি। উপরে সহজে ইউটিউব লিঙ্ক দিন।
                    </div>
                  )}
                </div>
              )
            ) : (
              // MCQ Questions Editor
              currentSubjectMCQChapters.length === 0 ? (
                <div className="p-6 text-center bg-white rounded-xl border border-dashed border-purple-300 space-y-2">
                  <p className="text-xs font-bold text-slate-800">
                    "{currentSubject?.name}" বিষয়ে কোনো অধ্যায় নেই।
                  </p>
                  <p className="text-[11px] text-slate-500">
                    প্রশ্ন যোগ করার জন্য প্রথমে ৩য় ধাপে গিয়ে একটি অধ্যায় তৈরি করুন।
                  </p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-2xs inline-flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>৩য় ধাপে অধ্যায় যোগ করতে যান</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {/* QUICK ADD SINGLE MCQ CARD */}
                  {currentMCQChapter && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/80 rounded-xl p-2.5 sm:p-3 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <span>নৈর্ব্যক্তিক প্রশ্ন আপলোড (প্রশ্ন, ৪টি উত্তর ও সঠিক উত্তরে টিক):</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handlePreload30MCQs(currentMCQChapter.id)}
                            className="text-[10px] font-black bg-purple-700 hover:bg-purple-800 text-white px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            title="বোর্ড স্ট্যান্ডার্ড ৩০টি এমসিকিউ এক ক্লিকে লোড করুন"
                          >
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>+ ৩০টি বোর্ড প্রশ্ন লোড করুন</span>
                          </button>
                          <span className="text-[10px] text-purple-700 font-semibold bg-purple-100/80 px-2 py-0.5 rounded-full">
                            মোট: {currentMCQChapter.questions.length}টি প্রশ্ন
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {/* 1. Question input */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-0.5">১. নৈর্ব্যক্তিকের প্রশ্ন লিখুন:</label>
                          <textarea
                            rows={2}
                            value={quickMCQQ}
                            onChange={e => setQuickMCQQ(e.target.value)}
                            placeholder="যেমন: কোনটি টপোলজিতে প্রথম ও শেষ কম্পিউটার পরস্পর সরাসরি যুক্ত থাকে?..."
                            className="w-full text-xs font-bold py-1.5 px-2.5 rounded-lg bg-white border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-2xs font-sans"
                          />
                        </div>

                        {/* 2. 4 Options Grid (ক, খ, গ, ঘ) */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-0.5">২. চারটি সম্ভাব্য উত্তর (অপশন ক, খ, গ, ঘ):</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {['ক', 'খ', 'গ', 'ঘ'].map((optLabel, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 bg-white px-2 py-1.5 rounded-lg border border-purple-200">
                                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-black text-[11px] flex items-center justify-center shrink-0">
                                  {optLabel}
                                </span>
                                <input
                                  type="text"
                                  value={quickMCQOpts[idx]}
                                  onChange={e => {
                                    const updated = [...quickMCQOpts] as [string, string, string, string];
                                    updated[idx] = e.target.value;
                                    setQuickMCQOpts(updated);
                                  }}
                                  placeholder={`উত্তর ${optLabel} লিখুন...`}
                                  className="w-full text-xs font-semibold focus:outline-none text-slate-800"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 3. 4 Buttons to Mark Correct Answer (যে বাটন সঠিক ঠিক মার দিবে) */}
                        <div className="bg-white p-2 rounded-xl border border-purple-200/90 space-y-1">
                          <label className="text-[11px] font-black text-purple-950 flex items-center justify-between">
                            <span>৩. কোনটি সঠিক উত্তর? নিচে চারটি বাটনের মধ্যে সঠিকটিতে টিক মারুন:</span>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              নির্বাচিত: {['ক', 'খ', 'গ', 'ঘ'][quickMCQCorrect]} অপশন
                            </span>
                          </label>

                          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                            {['ক', 'খ', 'গ', 'ঘ'].map((lbl, idx) => {
                              const isSelected = quickMCQCorrect === idx;
                              return (
                                <button
                                  type="button"
                                  key={idx}
                                  onClick={() => setQuickMCQCorrect(idx)}
                                  className={`py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-400 scale-[1.02]'
                                      : 'bg-slate-100 hover:bg-purple-100 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  {isSelected ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      <span>{lbl} (সঠিক ✓)</span>
                                    </>
                                  ) : (
                                    <span>{lbl} অপশন</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 4. Explanation & Submit Button */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 pt-0.5">
                          <div className="sm:col-span-8">
                            <input
                              type="text"
                              value={quickMCQExp}
                              onChange={e => setQuickMCQExp(e.target.value)}
                              placeholder="শিক্ষক ব্যাখ্যা ও সূত্র (ঐচ্ছিক)..."
                              className="w-full text-xs py-2 px-2.5 rounded-lg bg-white border border-purple-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <button
                              onClick={() => handleAddMCQQuick(currentMCQChapter.id)}
                              disabled={!quickMCQQ.trim()}
                              className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                            >
                              <Plus className="w-4 h-4 stroke-[2.5]" />
                              <span>+ প্রশ্নটি আপলোড ও সেভ করুন</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BULK MCQ PASTE DRAWER */}
                  {bulkMCQOpen && currentMCQChapter && (
                    <div className="bg-purple-50/90 border border-purple-300 rounded-xl p-3 shadow-sm space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                          <ListPlus className="w-4 h-4 text-purple-600" />
                          <span>একসাথে সম্পূর্ণ প্রশ্নব্যাংক পেস্ট করুন (Bulk MCQ Paste):</span>
                        </div>
                        <button
                          onClick={() => setBulkMCQOpen(false)}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-600">
                        যেকোনো সাধারণ ফরমেটে প্রশ্ন ও ৪টি অপশন পেস্ট করুন। সিস্টেম স্বয়ংক্রিয়ভাবে প্রশ্ন, ক/খ/গ/ঘ অপশন ও উত্তর বের করে নেবে।
                      </p>

                      <textarea
                        rows={6}
                        value={bulkMCQText}
                        onChange={e => setBulkMCQText(e.target.value)}
                        placeholder={`১. আলোর বেগ কত?\nক) ৩ × ১০^৮ মি./সে.\nখ) ২ × ১০^৮ মি./সে.\nগ) ৪ × ১০^৮ মি./সে.\nঘ) ১ × ১০^৮ মি./সে.\nউত্তর: ক\nব্যাখ্যা: শূন্য মাধ্যমে আলোর বেগ প্রায় ৩ লক্ষ কিমি/সেকেন্ড।\n\n২. মানবদেহে ক্রোমোজোম সংখ্যা কত?\nক) ৪৪টি\nখ) ৪৬টি\nগ) ৪৮টি\nঘ) ৫০টি\nউত্তর: খ`}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-purple-300 font-sans focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-2xs"
                      />

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setBulkMCQText(`১. আলোর বেগ কত?\nক) ৩ × ১০^৮ মি./সে.\nখ) ২ × ১০^৮ মি./সে.\nগ) ৪ × ১০^৮ মি./সে.\nঘ) ১ × ১০^৮ মি./সে.\nউত্তর: ক\nব্যাখ্যা: শূন্য মাধ্যমে আলোর বেগ প্রায় ৩ লক্ষ কিমি/সেকেন্ড।\n\n২. পর্যায় সারণির প্রথম মৌল কোনটি?\nক) হিলিয়াম\nখ) হাইড্রোজেন\nগ) লিথিয়াম\nঘ) অক্সিজেন\nউত্তর: খ\nব্যাখ্যা: হাইড্রোজেনের পারমাণবিক সংখ্যা ১।`)}
                          className="text-[10px] text-purple-800 underline hover:text-purple-900 font-semibold"
                        >
                          নমুনা প্রশ্ন পেস্ট করুন
                        </button>

                        <button
                          onClick={() => handleBulkAddMCQs(currentMCQChapter.id, bulkMCQText)}
                          disabled={!bulkMCQText.trim()}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>সবগুলো প্রশ্ন একসাথে যোগ করুন</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* MCQ List */}
                  {currentMCQChapter?.questions.map((q, qIdx) => (
                    <div key={q.id} className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 shrink-0">
                          Q{qIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={q.question}
                          onChange={e => handleUpdateQuestion(currentMCQChapter.id, q.id, 'question', e.target.value)}
                          className="flex-1 text-xs font-bold py-1 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white"
                          placeholder="প্রশ্নটি লিখুন"
                        />
                        
                        {/* Clone & Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleDuplicateQuestion(currentMCQChapter.id, q.id)}
                            className="text-slate-400 hover:text-purple-600 p-1 transition-colors"
                            title="এই প্রশ্নটি ক্লোন / ডুপ্লিকেট করুন"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(currentMCQChapter.id, q.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 shrink-0 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-slate-500 w-3 text-center">
                              {['ক', 'খ', 'গ', 'ঘ'][oIdx]}
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={e => handleUpdateOption(currentMCQChapter.id, q.id, oIdx, e.target.value)}
                              className="w-full text-xs py-1 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white"
                              placeholder={`অপশন ${['ক', 'খ', 'গ', 'ঘ'][oIdx]}`}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 pt-1.5 border-t border-slate-100 text-[11px] items-center">
                        <div className="sm:col-span-6 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-700 shrink-0">সঠিক উত্তর:</span>
                          <div className="flex items-center gap-1">
                            {['ক', 'খ', 'গ', 'ঘ'].map((lbl, oIdx) => {
                              const isSelectedCorrect = q.correctIndex === oIdx;
                              return (
                                <button
                                  type="button"
                                  key={oIdx}
                                  onClick={() => handleUpdateQuestion(currentMCQChapter.id, q.id, 'correctIndex', oIdx)}
                                  className={`px-2 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                                    isSelectedCorrect
                                      ? 'bg-emerald-600 text-white shadow-2xs ring-1 ring-emerald-400'
                                      : 'bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-900 border border-slate-200'
                                  }`}
                                  title={`অপশন ${lbl} কে সঠিক উত্তর হিসেবে চিহ্নিত করুন`}
                                >
                                  {isSelectedCorrect && <Check className="w-3 h-3 stroke-[3]" />}
                                  <span>{lbl}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <label className="text-[10px] font-bold text-slate-600 shrink-0">ব্যাখ্যা:</label>
                          <input
                            type="text"
                            value={q.explanation}
                            onChange={e => handleUpdateQuestion(currentMCQChapter.id, q.id, 'explanation', e.target.value)}
                            className="w-full text-xs py-0.5 px-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white"
                            placeholder="ব্যাখ্যা"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {currentMCQChapter && currentMCQChapter.questions.length === 0 && (
                    <div className="p-4 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                      এই অধ্যায়ে এখনও কোনো প্রশ্ন যোগ করা হয়নি। উপরে সহজে প্রশ্ন বা সম্পূর্ণ প্রশ্নব্যাংক পেস্ট করুন।
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
};
