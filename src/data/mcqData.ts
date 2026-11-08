import { ClassCategory, SubjectItem } from './hierarchyData';

export interface MCQQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  needsCalc?: boolean;
}

export interface MCQChapterItem {
  id: string;
  subjectId: string;
  chapterNumber: string; // "প্রথম অধ্যায়", "দ্বিতীয় অধ্যায়"
  title: string;
  subtitle: string;
  bgColor: string;
  iconColor: string;
  questions: MCQQuestionItem[];
}

export const INITIAL_MCQ_CLASSES: ClassCategory[] = [
  {
    id: 'mcq_class_9_10',
    title: '৯ম - ১০ম শ্রেণি এমসিকিউ ব্যাংক',
    subtitle: 'SSC বোর্ড প্রশ্ন ও অধ্যায়ভিত্তিক মডেল টেস্ট',
    code: '9-10',
    bgColor: 'bg-emerald-100/90',
    iconColor: 'text-emerald-700'
  },
  {
    id: 'mcq_class_11_12',
    title: '১১শ - ১২শ শ্রেণি এমসিকিউ ব্যাংক',
    subtitle: 'HSC ও এডমিশন স্ট্যান্ডার্ড অধ্যায়ভিত্তিক এমসিকিউ',
    code: '11-12',
    bgColor: 'bg-amber-100/90',
    iconColor: 'text-amber-700'
  }
];

export const INITIAL_MCQ_SUBJECTS: SubjectItem[] = [
  // Class 11-12 MCQ Subjects
  {
    id: 'mcq_sub_11_12_physics',
    classId: 'mcq_class_11_12',
    name: 'পদার্থবিজ্ঞান এমসিকিউ',
    subtitle: 'ভেক্টর, গতিবিদ্যা, কাজ-শক্তি ও মহাকর্ষ',
    code: 'PHY',
    bgColor: 'bg-amber-100/80',
    iconColor: 'text-amber-700'
  },
  {
    id: 'mcq_sub_11_12_math',
    classId: 'mcq_class_11_12',
    name: 'উচ্চতর গণিত এমসিকিউ',
    subtitle: 'ম্যাট্রিক্স, ত্রিকোণমিতি ও ক্যালকুলাস',
    code: 'HMATH',
    bgColor: 'bg-purple-100/80',
    iconColor: 'text-purple-700'
  },
  {
    id: 'mcq_sub_11_12_ict',
    classId: 'mcq_class_11_12',
    name: 'আইসিটি (ICT) এমসিকিউ',
    subtitle: 'সংখ্যা পদ্ধতি, ডিজিটাল ডিভাইস ও সি প্রোগ্রামিং',
    code: 'ICT',
    bgColor: 'bg-teal-100/80',
    iconColor: 'text-teal-700'
  },
  {
    id: 'mcq_sub_11_12_bangla',
    classId: 'mcq_class_11_12',
    name: 'বাংলা ১ম ও ২য় পত্র এমসিকিউ',
    subtitle: 'অপরিচিতা, সোনার তরী ও ব্যাকরণ',
    code: 'BAN',
    bgColor: 'bg-rose-100/80',
    iconColor: 'text-rose-700'
  },

  // Class 9-10 MCQ Subjects
  {
    id: 'mcq_sub_9_10_math',
    classId: 'mcq_class_9_10',
    name: 'সাধারণ গণিত এমসিকিউ',
    subtitle: 'বাস্তব সংখ্যা, বীজগণিতিক রাশি ও পরিমিতি',
    code: 'MATH',
    bgColor: 'bg-emerald-100/80',
    iconColor: 'text-emerald-700'
  },
  {
    id: 'mcq_sub_9_10_science',
    classId: 'mcq_class_9_10',
    name: 'সাধারণ বিজ্ঞান এমসিকিউ',
    subtitle: 'উন্নততর জীবনধারা, বল এবং জীবপ্রযুক্তি',
    code: 'SCI',
    bgColor: 'bg-cyan-100/80',
    iconColor: 'text-cyan-700'
  }
];

export const INITIAL_MCQ_CHAPTERS: MCQChapterItem[] = [
  // Class 11-12 Physics Chapters
  {
    id: 'mcq_ch_phy_1',
    subjectId: 'mcq_sub_11_12_physics',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'ভেক্টর (Vectors)',
    subtitle: 'ডট গুণন, ক্রস গুণন ও লব্ধি সংক্রান্ত প্রশ্নাবলী',
    bgColor: 'bg-amber-100/90',
    iconColor: 'text-amber-700',
    questions: [
      {
        id: 'q_p1_1',
        question: 'দুটি সমান ভেক্টরের লব্ধি এদের যেকোনো একটির সমান হলে মধ্যবর্তী কোণ কত?',
        options: ['120°', '60°', '90°', '180°'],
        correctIndex: 0,
        explanation: 'লব্ধি R² = P² + Q² + 2PQ cosθ। এখানে P = Q = R বসালে cosθ = -1/2, সুতরাং θ = 120°।',
        needsCalc: true
      },
      {
        id: 'q_p1_2',
        question: 'A ও B দুটি ভেক্টর পরস্পর লম্ব হলে নিচের কোনটি সত্য?',
        options: ['A · B = 0', 'A × B = 0', 'A + B = 0', '|A| = |B|'],
        correctIndex: 0,
        explanation: 'লম্ব ভেক্টরের ডট গুণন শূন্য হয়, কারণ cos 90° = 0।'
      },
      {
        id: 'q_p1_3',
        question: 'একক ভেক্টর i, j, k এর ক্ষেত্রে i × j = ?',
        options: ['k', '-k', '0', '1'],
        correctIndex: 0,
        explanation: 'ডানহাতি কর্ক-স্ক্রু নিয়ম অনুসারে i × j = k হয়।'
      }
    ]
  },
  {
    id: 'mcq_ch_phy_2',
    subjectId: 'mcq_sub_11_12_physics',
    chapterNumber: 'দ্বিতীয় অধ্যায়',
    title: 'গতিবিদ্যা ও নিউটনিয়ান বলবিদ্যা',
    subtitle: 'ভরবেগ, গতিশক্তি ও ত্বরণ সংক্রান্ত প্রশ্ন',
    bgColor: 'bg-rose-100/90',
    iconColor: 'text-rose-700',
    questions: [
      {
        id: 'q_p2_1',
        question: 'একটি বস্তুর উপর 10 N বল প্রয়োগ করায় বস্তুটি বলের দিকে 5 m সরে গেল। কৃতকাজ কত?',
        options: ['50 J', '2 J', '15 J', '0.5 J'],
        correctIndex: 0,
        explanation: 'কৃতকাজ W = F × s = 10 N × 5 m = 50 Joule।',
        needsCalc: true
      },
      {
        id: 'q_p2_2',
        question: 'অভিকর্ষজ ত্বরণ g = 9.8 m/s² হলে 2.5 kg ভরের বস্তুর ওজন কত?',
        options: ['24.5 N', '19.6 N', '4.9 N', '12.25 N'],
        correctIndex: 0,
        explanation: 'ওজন W = m × g = 2.5 × 9.8 = 24.5 N।',
        needsCalc: true
      }
    ]
  },

  // Class 11-12 Higher Math Chapters
  {
    id: 'mcq_ch_math_1',
    subjectId: 'mcq_sub_11_12_math',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'ম্যাট্রিক্স ও নির্ণায়ক',
    subtitle: 'ম্যাট্রিক্সের মাত্রা ও মান সংক্রান্ত প্রশ্নাবলী',
    bgColor: 'bg-purple-100/90',
    iconColor: 'text-purple-700',
    questions: [
      {
        id: 'q_m1_1',
        question: 'একটি ম্যাট্রিক্সের সারি 2 এবং কলাম 3 হলে এর ক্রম (Order) কোনটি?',
        options: ['2 × 3', '3 × 2', '6', '2 + 3'],
        correctIndex: 0,
        explanation: 'ম্যাট্রিক্সের ক্রম = সারি সংখ্যা × কলাম সংখ্যা = 2 × 3।'
      },
      {
        id: 'q_m1_2',
        question: 'sin(30°) + cos(60°) এর মান কত?',
        options: ['1', '0.5', '0', '√3/2'],
        correctIndex: 0,
        explanation: 'sin 30° = 1/2 এবং cos 60° = 1/2। যোগফল = 1/2 + 1/2 = 1।',
        needsCalc: true
      },
      {
        id: 'q_m1_3',
        question: 'log₁₀(1000) এর মান কত?',
        options: ['3', '2', '10', '100'],
        correctIndex: 0,
        explanation: '1000 = 10³। সুতরাং log₁₀(1000) = 3।',
        needsCalc: true
      }
    ]
  },

  // Class 11-12 ICT Chapters
  {
    id: 'mcq_ch_ict_1',
    subjectId: 'mcq_sub_11_12_ict',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত',
    subtitle: 'ভার্চুয়াল রিয়েলিটি, কৃত্রিম বুদ্ধিমত্তা ও ক্রায়োসার্জারি',
    bgColor: 'bg-teal-100/90',
    iconColor: 'text-teal-700',
    questions: [
      {
        id: 'q_i1_1',
        question: 'কৃত্রিম বুদ্ধিমত্তার জনক বলা হয় কাকে?',
        options: ['জন ম্যাকার্থি', 'চার্লস ব্যাবেজ', 'অ্যালান টুরিং', 'টিম বার্নার্স লি'],
        correctIndex: 0,
        explanation: 'জন ম্যাকার্থিকে (John McCarthy) কৃত্রিম বুদ্ধিমত্তা বা AI-এর জনক বলা হয়।'
      },
      {
        id: 'q_i1_2',
        question: 'ক্রায়োসার্জারি চিকিৎসায় কোন তরল গ্যাস ব্যবহৃত হয়?',
        options: ['তরল নাইট্রোজেন', 'তরল হিলিয়াম', 'তরল হাইড্রোজেন', 'তরল অক্সিজেন'],
        correctIndex: 0,
        explanation: 'ক্রায়োসার্জারিতে অত্যধিক ঠাণ্ডা তরল নাইট্রোজেন বা আর্গন গ্যাস স্প্রে করে রোগাক্রান্ত টিস্যু ধ্বংস করা হয়।'
      },
      {
        id: 'q_i1_3',
        question: 'বায়োমেট্রিক্সে ব্যক্তি শনাক্তকরণে সবচেয়ে নির্ভরযোগ্য মাধ্যম কোনটি?',
        options: ['আইরিশ ও রেটিনা স্ক্যান', 'ফিঙ্গারপ্রিন্ট', 'ফেসিয়াল রিকগনিশন', 'ভয়েস রিকগনিশন'],
        correctIndex: 0,
        explanation: 'মানুষের চোখের আইরিশ ও রেটিনার প্যাটার্ন অত্যন্ত অনন্য ও আজীবন অপরিবর্তনশীল।'
      }
    ]
  },
  {
    id: 'mcq_ch_ict_2',
    subjectId: 'mcq_sub_11_12_ict',
    chapterNumber: 'দ্বিতীয় অধ্যায় (মডেল টেস্ট)',
    title: 'কমিউনিকেশন সিস্টেমস, ওয়েব ডিজাইন ও সি প্রোগ্রামিং',
    subtitle: 'বোর্ড স্ট্যান্ডার্ড পূর্ণাঙ্গ ৩০টি নৈর্ব্যক্তিক পরীক্ষা',
    bgColor: 'bg-indigo-100/90',
    iconColor: 'text-indigo-700',
    questions: [
      {
        id: 'q_i2_1',
        question: '১. কোনটি টপোলজিতে প্রথম ও শেষ কম্পিউটার পরস্পর সরাসরি যুক্ত থাকে?\ni. বাস   ii. রিং   iii. মেশ\nনিচের কোনটি সঠিক?',
        options: ['i ও ii', 'i ও iii', 'ii ও iii', 'i, ii ও iii'],
        correctIndex: 2,
        explanation: 'রিং টপোলজিতে বৃত্তাকারে প্রথম ও শেষ নোড সংযুক্ত থাকে এবং মেশ টপোলজিতে প্রতিটি নোড অন্য সব নোডের সাথে সরাসরি যুক্ত থাকে।'
      },
      {
        id: 'q_i2_2',
        question: '২. কম্পিউটারকে নেটওয়ার্কে যুক্ত করার জন্য যে কার্ড ব্যবহৃত হয় তাকে বলে—',
        options: ['Modem', 'NIC', 'Router', 'Hub'],
        correctIndex: 1,
        explanation: 'NIC বা Network Interface Card মাদারবোর্ডে যুক্ত থাকে যা নেটওয়ার্ক কেবলের সাথে সংযোগ প্রদান করে।'
      },
      {
        id: 'q_i2_3',
        question: '৩. মূল ডেটাকে অন্য ফরম্যাট পরিবর্তনের পদ্ধতি কোনটি?',
        options: ['ম্যানিপুলেশন', 'ভ্যালিডেশন', 'এনক্রিপশন', 'ডিক্রিপশন'],
        correctIndex: 2,
        explanation: 'এনক্রিপশনের মাধ্যমে সাধারণ প্লেইনটেক্সটকে দুর্বোধ্য সাইফারটেক্সটে রূপান্তর করা হয়।'
      },
      {
        id: 'q_i2_4',
        question: '৪. সি ভাষায় সমজাতীয় ডেটা সংরক্ষণের জন্য কোনটি ব্যবহার করা হয়?',
        options: ['ফাংশন', 'পয়েন্টার', 'স্ট্রাকচার', 'অ্যারে'],
        correctIndex: 3,
        explanation: 'অ্যারে (Array) হলো একই ধরনের বা সমজাতীয় ডাটা এলিমেন্টের সংকলন।'
      },
      {
        id: 'q_i2_5',
        question: '৫. ডেটাবেজে SQL টেবিলে নতুন রেকর্ড সংযোজনে কোন স্টেটমেন্ট ব্যবহার করা যায়?',
        options: ['SELECT', 'UPDATE', 'CREATE', 'INSERT'],
        correctIndex: 3,
        explanation: 'নতুন ডাটা বা রো ইনসার্ট করার জন্য INSERT INTO টেবিল স্টেটমেন্ট ব্যবহার করা হয়।'
      },
      {
        id: 'q_i2_6',
        question: '৬. নির্দিষ্ট ডাটা খুঁজতে কোনটি ব্যবহৃত হয়?',
        options: ['সর্টিং', 'সার্চিং', 'কুয়েরি', 'ইন্ডেক্সিং'],
        correctIndex: 2,
        explanation: 'ডেটাবেজ থেকে শর্তানুসারে নির্দিষ্ট তথ্য বা রেকর্ড খুঁজে বের করার প্রক্রিয়াকে কুয়েরি (Query) বলে।'
      },
      {
        id: 'q_i2_7',
        question: '৭. DML (Data Manipulation Language) কমান্ড কোনটি?',
        options: ['Create', 'Alter', 'Select', 'Drop'],
        correctIndex: 2,
        explanation: 'Select, Insert, Update, Delete হলো DML কমান্ড; অপরপক্ষে Create, Alter, Drop হলো DDL কমান্ড।'
      },
      {
        id: 'q_i2_8',
        question: '■ নিচের উদ্দীপকটি পড়ে ৮ ও ৯নং প্রশ্নের উত্তর দাও :\n<html>\n<title> webpage </title>\n<body>\n<u> My personal information </u>\n</body>\n</html>\n\n৮. উপরের উদ্দীপকের ফলাফলের ধরন কীরূপ হবে?',
        options: ['বোল্ড', 'ইটালিক', 'আন্ডারলাইন', 'বোল্ড আন্ডারলাইন'],
        correctIndex: 2,
        explanation: 'HTML এ <u> ট্যাগ কোনো টেক্সটের নিচে আন্ডারলাইন (Underline) তৈরি করে।'
      },
      {
        id: 'q_i2_9',
        question: '৯. উপরের My personal information এর উপর ক্লিক করলে জীবনবৃত্তান্তের পেইজটি ওপেন করার জন্য কোন ধরনের ট্যাগ ব্যবহার করতে হবে?',
        options: ['<a>...........</a>', '<p>.............</p>', '<i>..............</i>', '<c>..............</c>'],
        correctIndex: 0,
        explanation: 'হাইপারলিঙ্ক বা ক্লিকেবল লিঙ্ক তৈরির জন্য অ্যাঙ্কর ট্যাগ <a> ব্যবহার করা হয় (যেমন: <a href="cv.html">...</a>)।'
      },
      {
        id: 'q_i2_10',
        question: '১০. অপটিক্যাল ফাইবার ক্যাবলে আলোর কোন ঘটনাটির মাধ্যমে ডেটা ট্রান্সমিট হয়?',
        options: ['পূর্ণ অভ্যন্তরীণ প্রতিফলন', 'আলোর প্রতিসরণ', 'আলোর প্রতিফলন', 'আলোর অপবর্তন'],
        correctIndex: 0,
        explanation: 'অপটিক্যাল ফাইবারের কোরের মধ্যে আলোর পূর্ণ অভ্যন্তরীণ প্রতিফলন (Total Internal Reflection) ঘটে।'
      },
      {
        id: 'q_i2_11',
        question: '১১. ব্লুটুথ (Bluetooth) কোন ধরনের নেটওয়ার্কের প্রকৃষ্ট উদাহরণ?',
        options: ['PAN', 'LAN', 'MAN', 'WAN'],
        correctIndex: 0,
        explanation: 'ব্লুটুথ স্বল্প দূরত্বের ব্যক্তিগত নেটওয়ার্ক বা PAN (Personal Area Network) প্রযুক্তিতে কাজ করে।'
      },
      {
        id: 'q_i2_12',
        question: '১২. ক্লাউড কম্পিউটিং এর প্রধানতম সুবিধা কোনটি?',
        options: ['যেকোনো স্থান থেকে ইন্টারনেট দিয়ে ডেটা অ্যাক্সেস', 'অতিরিক্ত হার্ডওয়্যার ক্রয়ের ঝামেলা', 'সীমিত ডাটা ব্যাকআপ', 'ধীরগতির ইন্টারনেট প্রয়োজন'],
        correctIndex: 0,
        explanation: 'ক্লাউড কম্পিউটিং-এ ইন্টারনেটের সাহায্যে বিশ্বের যেকোনো প্রান্ত থেকে ফাইল ও সফটওয়্যার ব্যবহার করা যায়।'
      },
      {
        id: 'q_i2_13',
        question: '১৩. ডেটাবেজের লজিক্যাল হায়ারার্কিতে সবচেয়ে ক্ষুদ্রতম অংশ কোনটি?',
        options: ['ক্যারেক্টার (Character)', 'ফিল্ড (Field)', 'রেকর্ড (Record)', 'ফাইল (File)'],
        correctIndex: 0,
        explanation: 'ক্যারেক্টার বা বাইট নিয়ে গঠিত হয় ফিল্ড, ফিল্ড নিয়ে রেকর্ড এবং রেকর্ড নিয়ে ফাইল তৈরি হয়।'
      },
      {
        id: 'q_i2_14',
        question: '১৪. সি (C) প্রোগ্রামিং ভাষায় প্রতিটি স্টেটমেন্টের শেষে কোন চিহ্নটি ব্যবহার আবশ্যক?',
        options: ['সেমিকোলন (;)', 'কোলন (:)', 'কমা (,)', 'ফুলস্টপ (.)'],
        correctIndex: 0,
        explanation: 'সি ভাষায় স্টেটমেন্ট সমাপ্তির নির্দেশক হলো সেমিকোলন (;)।'
      },
      {
        id: 'q_i2_15',
        question: '১৫. হটস্পট (Hotspot) তৈরিতে নিম্নের কোন প্রযুক্তিটি ব্যবহৃত হতে পারে?',
        options: ['Wi-Fi', 'WiMAX', 'Bluetooth', 'উপরের সবগুলোই'],
        correctIndex: 3,
        explanation: 'Wi-Fi, Bluetooth এবং WiMAX তিনটির মাধ্যমেই ইন্টারনেট শেয়ার বা হটস্পট তৈরি করা সম্ভব।'
      },
      {
        id: 'q_i2_16',
        question: '১৬. ওয়েব পেজে ইমেজ বা ছবি যুক্ত করার জন্য ব্যবহৃত সঠিক ট্যাগ কোনটি?',
        options: ['<img>', '<pic>', '<image>', '<src>'],
        correctIndex: 0,
        explanation: 'HTML-এ ছবি প্রদর্শনের জন্য এম্পটি ট্যাগ <img src="..." /> ব্যবহার করা হয়।'
      },
      {
        id: 'q_i2_17',
        question: '১৭. আইপি অ্যাড্রেস IPv4 কত বিটের হয়ে থাকে?',
        options: ['৩২ বিট', '৬৪ বিট', '১২৮ বিট', '১৬ বিট'],
        correctIndex: 0,
        explanation: 'IPv4 অ্যাড্রেস ৩২ বিটের (৪ বাইট) এবং IPv6 অ্যাড্রেস ১২৮ বিটের হয়।'
      },
      {
        id: 'q_i2_18',
        question: '১৮. সি প্রোগ্রামিং ভাষায় পুনরাবৃত্তিমূলক কাজের জন্য কোন লুপ স্টেটমেন্ট ব্যবহৃত হয়?',
        options: ['for লুপ', 'while লুপ', 'do-while লুপ', 'উপরের সবগুলোই'],
        correctIndex: 3,
        explanation: 'সি ভাষায় লুপ চালানোর জন্য for, while এবং do-while তিনটি লুপ কন্ট্রোল স্টেটমেন্ট রয়েছে।'
      },
      {
        id: 'q_i2_19',
        question: '১৯. তারযুক্ত মাধ্যমের মধ্যে সবচেয়ে দ্রুততম ডেটা ট্রান্সফার স্পিড প্রদান করে কোনটি?',
        options: ['ফাইবার অপটিক ক্যাবল', 'কো-অ্যাক্সিয়াল ক্যাবল', 'টুইস্টেড পেয়ার ক্যাবল', 'টেলিফোন লাইন'],
        correctIndex: 0,
        explanation: 'ফাইবার অপটিক আলোর গতিতে ডাটা পাঠায় এবং এর ব্যান্ডউইথ গিগাবিট থেকে টেরাবিট পর্যন্ত হতে পারে।'
      },
      {
        id: 'q_i2_20',
        question: '২০. বাইনারি যোগ 1 + 1 এর ফলাফল এবং ক্যারি যথাক্রমে কত?',
        options: ['যোগফল 0, ক্যারি 1', 'যোগফল 1, ক্যারি 0', 'যোগফল 10, ক্যারি 0', 'যোগফল 2, ক্যারি 1'],
        correctIndex: 0,
        explanation: 'বাইনারিতে 1 + 1 = 10; যেখানে 0 হলো সাম (যোগফল) এবং 1 হলো ক্যারি।'
      },
      {
        id: 'q_i2_21',
        question: '২১. কোন লজিক গেটের সকল ইনপুট ১ (High) হলে আউটপুট ০ (Low) হয়?',
        options: ['NAND গেট', 'AND গেট', 'OR গেট', 'XOR গেট'],
        correctIndex: 0,
        explanation: 'NAND গেট হলো AND গেটের বিপরীত। এর সবগুলো ইনপুট ১ হলে আউটপুট ০ হয়।'
      },
      {
        id: 'q_i2_22',
        question: '২২. HTML এ সবচেয়ে বড় আকারের শিরোনাম প্রদর্শনের ট্যাগ কোনটি?',
        options: ['<h1>', '<h6>', '<head>', '<header>'],
        correctIndex: 0,
        explanation: 'HTML এ h1 সবচেয়ে বড় এবং h6 সবচেয়ে ছোট আকারের শিরোনাম নির্দেশ করে।'
      },
      {
        id: 'q_i2_23',
        question: '২৩. ন্যানোপ্রযুক্তির (Nanotechnology) পরিমাপক স্কেল কোনটি?',
        options: ['১ থেকে ১০০ ন্যানোমিটার', '১ থেকে ১০০০ ন্যানোমিটার', '০.১ থেকে ১০ ন্যানোমিটার', '১০ থেকে ১০০ মাইক্রন'],
        correctIndex: 0,
        explanation: '১ ন্যানোমিটার = ১০⁻⁹ মিটার। ১ থেকে ১০০ ন্যানোমিটার স্কেলকে ন্যানো স্কেল বলা হয়।'
      },
      {
        id: 'q_i2_24',
        question: '২৪. নিচের কোনটি ক্লাউড ডেটাবেজ স্টোরেজের উদাহরণ?',
        options: ['Google Drive / Firebase', 'RAM', 'ROM', 'ক্যাশ মেমোরি'],
        correctIndex: 0,
        explanation: 'Google Drive ও Firebase রিয়েলটাইম ক্লাউড স্টোরেজ ও ডেটাবেজ সেবা প্রদান করে।'
      },
      {
        id: 'q_i2_25',
        question: '২৫. এইচটিটিপিএস (HTTPS) এ ব্যবহৃত "S" অক্ষরটি কী নির্দেশ করে?',
        options: ['Secure', 'Standard', 'Server', 'System'],
        correctIndex: 0,
        explanation: 'HTTPS পূর্ণরূপ হলো HyperText Transfer Protocol Secure, যা SSL/TLS এনক্রিপশন ব্যবহার করে।'
      },
      {
        id: 'q_i2_26',
        question: '২৬. সি প্রোগ্রামে আউটপুট প্রদর্শনের জন্য প্রধান ফাংশন কোনটি?',
        options: ['printf()', 'scanf()', 'getch()', 'main()'],
        correctIndex: 0,
        explanation: 'printf() ফাংশন মনিটরে কোনো টেক্সট বা ভেরিয়েবলের মান প্রদর্শন করতে ব্যবহৃত হয়।'
      },
      {
        id: 'q_i2_27',
        question: '২৭. এইচটিএমএল-এ একটি টেবিলের রো (Row) তৈরি করার ট্যাগ কোনটি?',
        options: ['<tr>', '<td>', '<th>', '<table>'],
        correctIndex: 0,
        explanation: '<tr> নির্দেশ করে Table Row, <td> নির্দেশ করে Table Data এবং <th> নির্দেশ করে Table Header।'
      },
      {
        id: 'q_i2_28',
        question: '২৮. ওয়াইফাই (Wi-Fi) এর স্ট্যান্ডার্ড কোনটি?',
        options: ['IEEE 802.11', 'IEEE 802.15', 'IEEE 802.16', 'IEEE 802.3'],
        correctIndex: 0,
        explanation: 'Wi-Fi এর স্ট্যান্ডার্ড IEEE 802.11; ব্লুটুথ হলো 802.15 এবং ওয়াইম্যাক্স হলো 802.16।'
      },
      {
        id: 'q_i2_29',
        question: '২৯. নিচের কোনটি ডেটাবেজ রিলেশনশিপের ধরন নয়?',
        options: ['One to One', 'One to Many', 'Many to Many', 'Single to All'],
        correctIndex: 3,
        explanation: 'ডেটাবেজ রিলেশন প্রধানত তিন প্রকার: One to One, One to Many এবং Many to Many।'
      },
      {
        id: 'q_i2_30',
        question: '৩০. বিশ্বব্যাপী ওয়েবসাইট ব্রাউজ করার জন্য যে সফটওয়্যার ব্যবহৃত হয় তাকে বলে—',
        options: ['ওয়েব ব্রাউজার', 'সার্চ ইঞ্জিন', 'সার্ভার', 'আইএসপি'],
        correctIndex: 0,
        explanation: 'Google Chrome, Firefox, Safari ইত্যাদি ওয়েব ব্রাউজারের মাধ্যমে ওয়েব পেজ রেন্ডার ও প্রদর্শন করা হয়।'
      }
    ]
  },

  // Class 11-12 Bangla Chapter
  {
    id: 'mcq_ch_ban_1',
    subjectId: 'mcq_sub_11_12_bangla',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'অপরিচিতা (গল্প)',
    subtitle: 'রবীন্দ্রনাথ ঠাকুরের বিখ্যাত ছোটগল্প ভিত্তিক এমসিকিউ',
    bgColor: 'bg-rose-100/90',
    iconColor: 'text-rose-700',
    questions: [
      {
        id: 'q_b1_1',
        question: '‘অপরিচিতা’ গল্পটি প্রথম কোন পত্রিকায় প্রকাশিত হয়?',
        options: ['সবুজ পত্র', 'বঙ্গদর্শন', 'প্রবাসী', 'সাধনা'],
        correctIndex: 0,
        explanation: '‘অপরিচিতা’ গল্পটি প্রমথ চৌধুরী সম্পাদিত ‘সবুজ পত্র’ পত্রিকার ১৩২২ বঙ্গাব্দের কার্তিক সংখ্যায় প্রথম প্রকাশিত হয়।'
      },
      {
        id: 'q_b1_2',
        question: '‘অপরিচিতা’ গল্পের নায়ক অনুপমের বয়স বিয়ের সময় কত ছিল?',
        options: ['২৩ বছর', '২৭ বছর', '২০ বছর', '২৫ বছর'],
        correctIndex: 0,
        explanation: 'গল্পের শুরুতে অনুপম বলেছে— “আজি আমার বয়স সাতাশ... বিয়ের সময় বয়স ছিল তেইশ।”'
      }
    ]
  },

  // Class 9-10 Math Chapter
  {
    id: 'mcq_ch_ssc_math_1',
    subjectId: 'mcq_sub_9_10_math',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'বাস্তব সংখ্যা ও সেট',
    subtitle: 'মূলদ, অমূলদ ও ফাংশন সংক্রান্ত প্রশ্নাবলী',
    bgColor: 'bg-emerald-100/90',
    iconColor: 'text-emerald-700',
    questions: [
      {
        id: 'q_sm1_1',
        question: 'নিচের কোনটি অমূলদ সংখ্যা?',
        options: ['√3', '√4', '3/4', '0.25'],
        correctIndex: 0,
        explanation: 'যে সংখ্যাকে দুটি পূর্ণসংখ্যার অনুপাতে প্রকাশ করা যায় না তা অমূলদ। √3 অমূলদ সংখ্যা।'
      },
      {
        id: 'q_sm1_2',
        question: 'একটি সেটের উপাদান সংখ্যা 3 হলে তার উপসেট সংখ্যা কত?',
        options: ['8', '6', '4', '9'],
        correctIndex: 0,
        explanation: 'উপসেট সংখ্যা = 2ⁿ = 2³ = 8।',
        needsCalc: true
      }
    ]
  }
];
