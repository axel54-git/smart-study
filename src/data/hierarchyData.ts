export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  views?: string;
  publishedAt?: string;
  thumbnail?: string;
  youtubeUrl: string;
  instructor: string;
  instructorAvatar?: string;
}

export interface ChapterItem {
  id: string;
  subjectId: string;
  chapterNumber: string; // "প্রথম অধ্যায়", "দ্বিতীয় অধ্যায়", "তৃতীয় অধ্যায়", "চতুর্থ অধ্যায়"
  title: string;
  subtitle: string;
  videos: VideoItem[];
  bgColor: string;
  iconColor: string;
}

export interface SubjectItem {
  id: string;
  classId: string;
  name: string;
  subtitle: string;
  code: string;
  bgColor: string;
  iconColor: string;
}

export interface ClassCategory {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  bgColor: string;
  iconColor: string;
}

export const INITIAL_CLASSES: ClassCategory[] = [
  {
    id: 'class_9_10',
    title: '৯ম - ১০ম শ্রেণি',
    subtitle: 'Class 9-10 • SSC & Dakhil Preparation',
    code: '9-10',
    bgColor: 'bg-purple-100/80',
    iconColor: 'text-purple-600'
  },
  {
    id: 'class_11_12',
    title: '১১শ - ১২শ শ্রেণি',
    subtitle: 'Class 11-12 • HSC & Alim Preparation',
    code: '11-12',
    bgColor: 'bg-amber-100/90',
    iconColor: 'text-amber-600'
  }
];

export const INITIAL_SUBJECTS: SubjectItem[] = [
  // Class 9-10 Subjects
  {
    id: 'sub_9_10_bangla',
    classId: 'class_9_10',
    name: 'বাংলা',
    subtitle: 'Bangla 1st & 2nd Paper',
    code: 'BAN',
    bgColor: 'bg-rose-100/80',
    iconColor: 'text-rose-600'
  },
  {
    id: 'sub_9_10_english',
    classId: 'class_9_10',
    name: 'ইংরেজি',
    subtitle: 'English Grammar & 1st Paper',
    code: 'ENG',
    bgColor: 'bg-blue-100/80',
    iconColor: 'text-blue-600'
  },
  {
    id: 'sub_9_10_math',
    classId: 'class_9_10',
    name: 'গণিত',
    subtitle: 'General Mathematics • SSC Special',
    code: 'MATH',
    bgColor: 'bg-emerald-100/80',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'sub_9_10_ict',
    classId: 'class_9_10',
    name: 'আইসিটি (ICT)',
    subtitle: 'Information & Communication Tech',
    code: 'ICT',
    bgColor: 'bg-teal-100/80',
    iconColor: 'text-teal-600'
  },

  // Class 11-12 Subjects
  {
    id: 'sub_11_12_bangla',
    classId: 'class_11_12',
    name: 'বাংলা',
    subtitle: 'HSC Bangla Sahitya & Byakoron',
    code: 'BAN',
    bgColor: 'bg-rose-100/80',
    iconColor: 'text-rose-600'
  },
  {
    id: 'sub_11_12_english',
    classId: 'class_11_12',
    name: 'ইংরেজি',
    subtitle: 'English 1st & 2nd Paper Masterclass',
    code: 'ENG',
    bgColor: 'bg-blue-100/80',
    iconColor: 'text-blue-600'
  },
  {
    id: 'sub_11_12_math',
    classId: 'class_11_12',
    name: 'গণিত (উচ্চতর গণিত)',
    subtitle: 'Higher Mathematics 1st & 2nd Paper',
    code: 'MATH',
    bgColor: 'bg-amber-100/90',
    iconColor: 'text-amber-600'
  },
  {
    id: 'sub_11_12_ict',
    classId: 'class_11_12',
    name: 'আইসিটি (ICT)',
    subtitle: 'Digital Devices, Web & C Programming',
    code: 'ICT',
    bgColor: 'bg-teal-100/80',
    iconColor: 'text-teal-600'
  }
];

// Helper to generate 4-5 sequential classes for any chapter with YouTube/Marketify card look
const sampleThumbnails = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80'
];

// Working YouTube video IDs for testing (including user requested: zF_QuSpQdsI)
const testYouTubeIds = [
  'zF_QuSpQdsI', // User provided YouTube video
  'M7lc1UVf-VE', // YouTube Demo
  'jfKfPfyJRdk', // Lofi Study Stream
  'kJQP7kiw5Fk', // Popular video
  'L_LUpnjgPso'  // Educational video
];

const createSamplePlaylist = (chapterName: string, subjectName: string, instructorName: string): VideoItem[] => [
  {
    id: 'vid_' + Math.random().toString(36).substr(2, 9),
    title: `লেকচার ১: ${chapterName} - প্রাথমিক পরিচিতি ও মূল কনসেপ্ট`,
    duration: '৩১:২৯',
    views: '২২K views',
    publishedAt: '৩ দিন আগে',
    thumbnail: sampleThumbnails[0],
    youtubeUrl: `https://www.youtube.com/embed/${testYouTubeIds[0]}`,
    instructor: instructorName
  },
  {
    id: 'vid_' + Math.random().toString(36).substr(2, 9),
    title: `লেকচার ২: ${chapterName} - গুরুত্বপূর্ণ সূত্র ও বেসিক নিয়মাবলী`,
    duration: '২০:৩০',
    views: '২.৭M views',
    publishedAt: '৫ দিন আগে',
    thumbnail: sampleThumbnails[1],
    youtubeUrl: `https://www.youtube.com/embed/${testYouTubeIds[1]}`,
    instructor: instructorName
  },
  {
    id: 'vid_' + Math.random().toString(36).substr(2, 9),
    title: `লেকচার ৩: ${chapterName} - গাণিতিক ও সৃজনশীল সমস্যা সমাধান`,
    duration: '২৬:১৫',
    views: '১৮K views',
    publishedAt: '১ সপ্তাহ আগে',
    thumbnail: sampleThumbnails[2],
    youtubeUrl: `https://www.youtube.com/embed/${testYouTubeIds[2]}`,
    instructor: instructorName
  },
  {
    id: 'vid_' + Math.random().toString(36).substr(2, 9),
    title: `লেকচার ৪: ${chapterName} - বিগত ৫ বছরের বোর্ড প্রশ্ন সমাধান`,
    duration: '৩৪:৪০',
    views: '৩৫K views',
    publishedAt: '২ সপ্তাহ আগে',
    thumbnail: sampleThumbnails[3],
    youtubeUrl: `https://www.youtube.com/embed/${testYouTubeIds[3]}`,
    instructor: instructorName
  },
  {
    id: 'vid_' + Math.random().toString(36).substr(2, 9),
    title: `লেকচার ৫: ${chapterName} - বহুনির্বাচনী (MCQ) শর্টকাট টেস্ট স্পেশাল`,
    duration: '১৯:৫০',
    views: '১২K views',
    publishedAt: '৩ সপ্তাহ আগে',
    thumbnail: sampleThumbnails[4],
    youtubeUrl: `https://www.youtube.com/embed/${testYouTubeIds[4]}`,
    instructor: instructorName
  }
];

export const INITIAL_CHAPTERS: ChapterItem[] = [
  // ---------------- CLASS 11-12 BANGLA (Shown in user screenshot) ----------------
  {
    id: 'ch_11_b_1',
    subjectId: 'sub_11_12_bangla',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'গদ্যাংশ: অপরিচিতা (রবীন্দ্রনাথ ঠাকুর)',
    subtitle: 'কল্যাণীর বলিষ্ঠ নারী চরিত্র ও যৌতুক প্রথার বিরুদ্ধে প্রতিবাদ',
    bgColor: 'bg-rose-100/80',
    iconColor: 'text-rose-600',
    videos: createSamplePlaylist('অপরিচিতা গল্প', 'বাংলা', 'হাসান মাহমুদ স্যার')
  },
  {
    id: 'ch_11_b_2',
    subjectId: 'sub_11_12_bangla',
    chapterNumber: 'দ্বিতীয় অধ্যায়',
    title: 'গদ্যাংশ: বিলাসী (শরৎচন্দ্র চট্টোপাধ্যায়)',
    subtitle: 'বিলাসীর আত্মত্যাগ ও তৎকালীন কুসংস্কারাচ্ছন্ন সমাজচিত্র',
    bgColor: 'bg-amber-100/80',
    iconColor: 'text-amber-600',
    videos: createSamplePlaylist('বিলাসী গল্প', 'বাংলা', 'হাসান মাহমুদ স্যার')
  },
  {
    id: 'ch_11_b_3',
    subjectId: 'sub_11_12_bangla',
    chapterNumber: 'তৃতীয় অধ্যায়',
    title: 'পদ্যাংশ: সোনার তরী (রবীন্দ্রনাথ ঠাকুর)',
    subtitle: 'জীবন ও কর্মের অনন্ত স্রোত এবং রূপক কবিতার গভীর অর্থ',
    bgColor: 'bg-purple-100/80',
    iconColor: 'text-purple-600',
    videos: createSamplePlaylist('সোনার তরী', 'বাংলা', 'হাসান মাহমুদ স্যার')
  },
  {
    id: 'ch_11_b_4',
    subjectId: 'sub_11_12_bangla',
    chapterNumber: 'চতুর্থ অধ্যায়',
    title: 'পদ্যাংশ: বিদ্রোহী (কাজী নজরুল ইসলাম)',
    subtitle: 'অন্যায়ের বিরুদ্ধে বজ্রকণ্ঠ ও আত্মজাগরণের মহাকাব্যিক আহ্বান',
    bgColor: 'bg-emerald-100/80',
    iconColor: 'text-emerald-600',
    videos: createSamplePlaylist('বিদ্রোহী কবিতা', 'বাংলা', 'হাসান মাহমুদ স্যার')
  },

  // ---------------- CLASS 11-12 MATH ----------------
  {
    id: 'ch_11_m_1',
    subjectId: 'sub_11_12_math',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'ম্যাট্রিক্স ও নির্ণায়ক (Matrix & Determinants)',
    subtitle: 'ম্যাট্রিক্সের গুণন, বিপরীত ম্যাট্রিক্স ও ক্রেমার রুল',
    bgColor: 'bg-purple-100/80',
    iconColor: 'text-purple-600',
    videos: createSamplePlaylist('ম্যাট্রিক্স ও নির্ণায়ক', 'উচ্চতর গণিত', 'ড. তানভীর (বুয়েট)')
  },
  {
    id: 'ch_11_m_2',
    subjectId: 'sub_11_12_math',
    chapterNumber: 'দ্বিতীয় অধ্যায়',
    title: 'ভেক্টর (Vectors)',
    subtitle: 'ডট গুণন, ক্রস গুণন ও অভিক্ষেপ',
    bgColor: 'bg-amber-100/80',
    iconColor: 'text-amber-600',
    videos: createSamplePlaylist('ভেক্টর', 'উচ্চতর গণিত', 'রাকিব স্যার')
  },
  {
    id: 'ch_11_m_3',
    subjectId: 'sub_11_12_math',
    chapterNumber: 'তৃতীয় অধ্যায়',
    title: 'সরলরেখা (Straight Lines)',
    subtitle: 'ঢাল, দুই বিন্দুর মধ্যবর্তী দূরত্ব ও সমীকরণ',
    bgColor: 'bg-rose-100/80',
    iconColor: 'text-rose-600',
    videos: createSamplePlaylist('সরলরেখা', 'উচ্চতর গণিত', 'রাকিব স্যার')
  },
  {
    id: 'ch_11_m_4',
    subjectId: 'sub_11_12_math',
    chapterNumber: 'চতুর্থ অধ্যায়',
    title: 'ক্যালকুলাস: অন্তরীকরণ (Differentiation)',
    subtitle: 'লিমিট, চেইন রুল ও স্পর্শকের সমীকরণ',
    bgColor: 'bg-teal-100/80',
    iconColor: 'text-teal-600',
    videos: createSamplePlaylist('অন্তরীকরণ', 'উচ্চতর গণিত', 'ড. তানভীর')
  },

  // ---------------- CLASS 11-12 ENGLISH ----------------
  {
    id: 'ch_11_e_1',
    subjectId: 'sub_11_12_english',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'Unit 1: People Making History',
    subtitle: 'The Historic 7th March Speech & Nelson Mandela',
    bgColor: 'bg-blue-100/80',
    iconColor: 'text-blue-600',
    videos: createSamplePlaylist('Unit 1 Making History', 'English', 'আহমেদ স্যার')
  },
  {
    id: 'ch_11_e_2',
    subjectId: 'sub_11_12_english',
    chapterNumber: 'দ্বিতীয় অধ্যায়',
    title: 'Unit 2: Dreams & Poetry',
    subtitle: 'What is a Dream? & Poems by Langston Hughes',
    bgColor: 'bg-purple-100/80',
    iconColor: 'text-purple-600',
    videos: createSamplePlaylist('Unit 2 Dreams', 'English', 'আহমেদ স্যার')
  },
  {
    id: 'ch_11_e_3',
    subjectId: 'sub_11_12_english',
    chapterNumber: 'তৃতীয় অধ্যায়',
    title: 'HSC Grammar: Modifiers & Sentence Connectors',
    subtitle: 'Pre-modifier, Post-modifier এবং লিঙ্কার্স এর নিয়ম',
    bgColor: 'bg-amber-100/80',
    iconColor: 'text-amber-600',
    videos: createSamplePlaylist('Modifiers & Connectors', 'English', 'আহমেদ স্যার')
  },
  {
    id: 'ch_11_e_4',
    subjectId: 'sub_11_12_english',
    chapterNumber: 'চতুর্থ অধ্যায়',
    title: 'HSC Grammar: Narration & Punctuation',
    subtitle: 'Direct to Indirect Speech & Passage Narration Tricks',
    bgColor: 'bg-teal-100/80',
    iconColor: 'text-teal-600',
    videos: createSamplePlaylist('Narration Masterclass', 'English', 'আহমেদ স্যার')
  },

  // ---------------- CLASS 11-12 ICT ----------------
  {
    id: 'ch_11_i_1',
    subjectId: 'sub_11_12_ict',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত',
    subtitle: 'বায়োমেট্রিক্স, ভার্চুয়াল রিয়েলিটি ও ন্যানোটেকনোলজি',
    bgColor: 'bg-teal-100/80',
    iconColor: 'text-teal-600',
    videos: createSamplePlaylist('বিশ্ব ও বাংলাদেশ প্রেক্ষিত', 'ICT', 'ইঞ্জিনিয়ার সুমন')
  },
  {
    id: 'ch_11_i_2',
    subjectId: 'sub_11_12_ict',
    chapterNumber: 'দ্বিতীয় অধ্যায়',
    title: 'কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং',
    subtitle: 'ব্যান্ডউইথ, অপটিক্যাল ফাইবার, ওয়াইফাই ও টপোলজি',
    bgColor: 'bg-blue-100/80',
    iconColor: 'text-blue-600',
    videos: createSamplePlaylist('কমিউনিকেশন ও নেটওয়ার্কিং', 'ICT', 'ইঞ্জিনিয়ার সুমন')
  },
  {
    id: 'ch_11_i_3',
    subjectId: 'sub_11_12_ict',
    chapterNumber: 'তৃতীয় অধ্যায়',
    title: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস',
    subtitle: 'বাইনারি, অকটাল, হেক্সাডেসিমেল রূপান্তর ও লজিক গেট',
    bgColor: 'bg-purple-100/80',
    iconColor: 'text-purple-600',
    videos: createSamplePlaylist('সংখ্যা পদ্ধতি ও লজিক গেট', 'ICT', 'ইঞ্জিনিয়ার সুমন')
  },
  {
    id: 'ch_11_i_4',
    subjectId: 'sub_11_12_ict',
    chapterNumber: 'চতুর্থ অধ্যায়',
    title: 'ওয়েব ডিজাইন পরিচিতি এবং এইচটিএমএল (HTML)',
    subtitle: 'HTML ট্যাগ, টেবিল, ইমেজ লিংক ও ওয়েব পেজ স্ট্রাকচার',
    bgColor: 'bg-amber-100/80',
    iconColor: 'text-amber-600',
    videos: createSamplePlaylist('HTML ও ওয়েব ডিজাইন', 'ICT', 'ইঞ্জিনিয়ার সুমন')
  },

  // ---------------- CLASS 9-10 MATH ----------------
  {
    id: 'ch_9_m_1',
    subjectId: 'sub_9_10_math',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'বাস্তব সংখ্যা (Real Numbers)',
    subtitle: 'মূলদ ও অমূলদ সংখ্যা, আবৃত্ত দশমিক',
    bgColor: 'bg-purple-100/80',
    iconColor: 'text-purple-600',
    videos: createSamplePlaylist('বাস্তব সংখ্যা', 'গণিত', 'সোহাগ স্যার')
  },
  {
    id: 'ch_9_m_2',
    subjectId: 'sub_9_10_math',
    chapterNumber: 'দ্বিতীয় অধ্যায়',
    title: 'সেট ও ফাংশন (Sets & Functions)',
    subtitle: 'ভেনচিত্র, ডোমেন, রেঞ্জ ও অন্বয়',
    bgColor: 'bg-amber-100/80',
    iconColor: 'text-amber-600',
    videos: createSamplePlaylist('সেট ও ফাংশন', 'গণিত', 'আরিফুল ইসলাম')
  },
  {
    id: 'ch_9_m_3',
    subjectId: 'sub_9_10_math',
    chapterNumber: 'তৃতীয় অধ্যায়',
    title: 'বীজগাণিতিক রাশি (Algebraic Expressions)',
    subtitle: 'বর্গ ও ঘনের সূত্রাবলী এবং উৎপাদকে বিশ্লেষণ',
    bgColor: 'bg-emerald-100/80',
    iconColor: 'text-emerald-600',
    videos: createSamplePlaylist('বীজগাণিতিক রাশি', 'গণিত', 'সোহাগ স্যার')
  },
  {
    id: 'ch_9_m_4',
    subjectId: 'sub_9_10_math',
    chapterNumber: 'চতুর্থ অধ্যায়',
    title: 'সূচক ও লগারিদম (Exponents & Logarithms)',
    subtitle: 'সূচকের নিয়মাবলী এবং লগারিদমের রূপান্তর',
    bgColor: 'bg-blue-100/80',
    iconColor: 'text-blue-600',
    videos: createSamplePlaylist('সূচক ও লগারিদম', 'গণিত', 'তানভীর আহমেদ')
  },

  // ---------------- CLASS 9-10 BANGLA ----------------
  {
    id: 'ch_9_b_1',
    subjectId: 'sub_9_10_bangla',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'গদ্যাংশ: শুভা (রবীন্দ্রনাথ ঠাকুর)',
    subtitle: 'বোবা মেয়ে শুভার মর্মস্পর্শী গল্প ও চরিত্র বিশ্লেষণ',
    bgColor: 'bg-rose-100/80',
    iconColor: 'text-rose-600',
    videos: createSamplePlaylist('শুভা গল্প', 'বাংলা', 'মাহমুদুল হাসান স্যার')
  },
  {
    id: 'ch_9_b_2',
    subjectId: 'sub_9_10_bangla',
    chapterNumber: 'দ্বিতীয় অধ্যায়',
    title: 'গদ্যাংশ: বই পড়া (প্রমথ চৌধুরী)',
    subtitle: 'সাহিত্য চর্চা ও শিক্ষার আসল উদ্দেশ্য বিশ্লেষণ',
    bgColor: 'bg-amber-100/80',
    iconColor: 'text-amber-600',
    videos: createSamplePlaylist('বই পড়া', 'বাংলা', 'মাহমুদুল হাসান স্যার')
  },
  {
    id: 'ch_9_b_3',
    subjectId: 'sub_9_10_bangla',
    chapterNumber: 'তৃতীয় অধ্যায়',
    title: 'গদ্যাংশ: আম আঁটির ভেঁপু (বিভূতিভূষণ বন্দ্যোপাধ্যায়)',
    subtitle: 'অপু ও দুর্গার গ্রামীণ শৈশব এবং প্রকৃতি প্রেম',
    bgColor: 'bg-emerald-100/80',
    iconColor: 'text-emerald-600',
    videos: createSamplePlaylist('আম আঁটির ভেঁপু', 'বাংলা', 'মাহমুদুল হাসান স্যার')
  },
  {
    id: 'ch_9_b_4',
    subjectId: 'sub_9_10_bangla',
    chapterNumber: 'চতুর্থ অধ্যায়',
    title: 'পদ্যাংশ: বঙ্গবাণী (আবদুল হাকিম)',
    subtitle: 'মাতৃভাষার প্রতি গভীর ভালোবাসা ও কবিতা বিশ্লেষণ',
    bgColor: 'bg-purple-100/80',
    iconColor: 'text-purple-600',
    videos: createSamplePlaylist('বঙ্গবাণী', 'বাংলা', 'মাহমুদুল হাসান স্যার')
  },

  // ---------------- CLASS 9-10 ENGLISH ----------------
  {
    id: 'ch_9_e_1',
    subjectId: 'sub_9_10_english',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'Tense & Right Form of Verbs',
    subtitle: 'বোর্ড পরীক্ষায় আসা গুরুত্বপূর্ণ গোল্ডেন রুলস',
    bgColor: 'bg-blue-100/80',
    iconColor: 'text-blue-600',
    videos: createSamplePlaylist('Right Form of Verbs', 'English', 'জাকারিয়া স্যার')
  },
  {
    id: 'ch_9_e_2',
    subjectId: 'sub_9_10_english',
    chapterNumber: 'দ্বিতীয় অধ্যায়',
    title: 'Prepositions & Appropriate Usage',
    subtitle: 'সহজ কৌশলে প্রিপজিশন মনে রাখার মাস্টারক্লাস',
    bgColor: 'bg-purple-100/80',
    iconColor: 'text-purple-600',
    videos: createSamplePlaylist('Prepositions', 'English', 'জাকারিয়া স্যার')
  },
  {
    id: 'ch_9_e_3',
    subjectId: 'sub_9_10_english',
    chapterNumber: 'তৃতীয় অধ্যায়',
    title: 'Transformation of Sentences',
    subtitle: 'Simple, Complex, Compound & Voice Change',
    bgColor: 'bg-amber-100/80',
    iconColor: 'text-amber-600',
    videos: createSamplePlaylist('Transformation', 'English', 'জাকারিয়া স্যার')
  },
  {
    id: 'ch_9_e_4',
    subjectId: 'sub_9_10_english',
    chapterNumber: 'চতুর্থ অধ্যায়',
    title: 'Tag Questions & Connectors',
    subtitle: 'শতভাগ নির্ভুল উত্তর করার সহজ ৫টি টেকনিক',
    bgColor: 'bg-teal-100/80',
    iconColor: 'text-teal-600',
    videos: createSamplePlaylist('Tag Questions', 'English', 'জাকারিয়া স্যার')
  },

  // ---------------- CLASS 9-10 ICT ----------------
  {
    id: 'ch_9_i_1',
    subjectId: 'sub_9_10_ict',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'তথ্য ও যোগাযোগ প্রযুক্তি এবং আমাদের বাংলাদেশ',
    subtitle: 'ই-লার্নিং, ই-গভর্ন্যান্স ও ডিজিটাল বাংলাদেশ',
    bgColor: 'bg-teal-100/80',
    iconColor: 'text-teal-600',
    videos: createSamplePlaylist('আমাদের বাংলাদেশ', 'ICT', 'সুমাইয়া ম্যাম')
  },
  {
    id: 'ch_9_i_2',
    subjectId: 'sub_9_10_ict',
    chapterNumber: 'দ্বিতীয় অধ্যায়',
    title: 'কম্পিউটার ও কম্পিউটার ব্যবহারকারীর নিরাপত্তা',
    subtitle: 'ম্যালওয়্যার, ভাইরাস, পাসওয়ার্ড ও সাইবার নিরাপত্তা',
    bgColor: 'bg-blue-100/80',
    iconColor: 'text-blue-600',
    videos: createSamplePlaylist('কম্পিউটার নিরাপত্তা', 'ICT', 'সুমাইয়া ম্যাম')
  },
  {
    id: 'ch_9_i_3',
    subjectId: 'sub_9_10_ict',
    chapterNumber: 'তৃতীয় অধ্যায়',
    title: 'আমার শিক্ষায় ইন্টারনেট (Internet in My Education)',
    subtitle: 'ডিজিタル কনটেন্ট, ই-বুক ও শিক্ষায় ইন্টারনেট',
    bgColor: 'bg-purple-100/80',
    iconColor: 'text-purple-600',
    videos: createSamplePlaylist('শিক্ষায় ইন্টারনেট', 'ICT', 'সুমাইয়া ম্যাম')
  },
  {
    id: 'ch_9_i_4',
    subjectId: 'sub_9_10_ict',
    chapterNumber: 'চতুর্থ অধ্যায়',
    title: 'আমার লেখালেখি ও হিসাব (Word & Excel)',
    subtitle: 'ওয়ার্ড প্রসেসিং ও স্প্রেডশিটের প্রাথমিক ব্যবহার',
    bgColor: 'bg-amber-100/80',
    iconColor: 'text-amber-600',
    videos: createSamplePlaylist('লেখালেখি ও হিসাব', 'ICT', 'সুমাইয়া ম্যাম')
  }
];
