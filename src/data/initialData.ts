import { SubjectCourse, Quiz, Notice, UserStats } from '../types';

export const INITIAL_COURSES: SubjectCourse[] = [
  {
    id: 'c1',
    title: 'উচ্চতর গণিত: ক্যালকুলাস ও বীজগণিত স্পেশাল',
    subject: 'উচ্চতর গণিত',
    grade: 'HSC / Admission',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    instructor: 'রাকিবুল হাসান (বুয়েট)',
    totalLessons: 12,
    totalDuration: '৬ ঘণ্টা ৩০ মিনিট',
    color: 'from-blue-600 to-indigo-700',
    lessons: [
      {
        id: 'l1',
        title: '১.১ লিমিট ও কন্টিনিউইটি এর মৌলিক ধারণা',
        duration: '২৫ মিনিট',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'লিমিটের বেসিক সূত্রাবলী এবং L\'Hospital রুল প্রয়োগ করে দ্রুত সমাধান করার সহজ টেকনিক।',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'l2',
        title: '১.২ অন্তরীকরণ (Differentiation) শর্টকাট ট্রিকস',
        duration: '৩০ মিনিট',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'চেইন রুল এবং দ্রুত ক্যালকুলেশন মেথড যা বোর্ড পরীক্ষা ও অ্যাডমিশনে বারবার আসে।',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'l3',
        title: '১.৩ যোগজীকরণ (Integration) সমাধান',
        duration: '৪০ মিনিট',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'নির্দিষ্ট ও অনির্দিষ্ট যোগজীকরণের গুরুত্বপূর্ণ সমস্যা ও সমাধান।',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    ]
  },
  {
    id: 'c2',
    title: 'পদার্থবিজ্ঞান: নিউটনিয়ান বলবিদ্যা ও মহাকর্ষ',
    subject: 'পদার্থবিজ্ঞান',
    grade: 'HSC / SSC',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    instructor: 'ড. তানভীর আহমেদ (ঢাবি)',
    totalLessons: 8,
    totalDuration: '৪ ঘণ্টা ১৫ মিনিট',
    color: 'from-amber-500 to-orange-600',
    lessons: [
      {
        id: 'l4',
        title: '২.১ রৈখিক ও কৌণিক ভরবেগ সংরক্ষণ নীতি',
        duration: '২৮ মিনিট',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'ভরবেগ সংরক্ষণ সূত্রের বাস্তব প্রয়োগ এবং গাণিতিক সমস্যার দ্রুত সমাধান কৌশল।',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'l5',
        title: '২.২ ব্যাংকিং কোণ ও ঘর্ষণ বলের হিসাব',
        duration: '২২ মিনিট',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'যানবাহনের নিরাপদ গতি এবং মোড়ে বাঁক নেওয়ার প্রয়োজনীয় সমীকরণ।',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    ]
  },
  {
    id: 'c3',
    title: 'আইসিটি (ICT): ডিজিটাল ডিভাইস ও সি প্রোগ্রামিং',
    subject: 'তথ্য ও প্রযুক্তি (ICT)',
    grade: 'HSC',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    instructor: 'সুমাইয়া আক্তার (CSE, সুয়েট)',
    totalLessons: 10,
    totalDuration: '৫ ঘণ্টা ১০ মিনিট',
    color: 'from-emerald-500 to-teal-700',
    lessons: [
      {
        id: 'l6',
        title: '৩.১ লজিক গেট ও ডিমরগ্যান এর উপপাদ্য',
        duration: '৩৫ মিনিট',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'লজিক সার্কিট সরলীকরণ এবং ট্রুথ টেবিল তৈরির মাস্টারক্লাস।',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    ]
  },
  {
    id: 'c4',
    title: 'ইংরেজি ব্যাকরণ ও ভোকাবুলারি বুস্টার',
    subject: 'ইংরেজি',
    grade: 'সব ক্লাসের জন্য',
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    instructor: 'নাজমুল করিম (ইংরেজি প্রশিক্ষক)',
    totalLessons: 15,
    totalDuration: '৭ ঘণ্টা',
    color: 'from-purple-600 to-pink-600',
    lessons: [
      {
        id: 'l7',
        title: '৪.১ Right Form of Verbs এর সহজ ১০টি নিয়ম',
        duration: '২৫ মিনিট',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'যে নিয়মগুলো মনে রাখলে যেকোনো প্রতিযোগিতামূলক পরীক্ষায় নির্ভুল উত্তর দেওয়া সম্ভব।',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    ]
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    title: 'ডেইলি চ্যালেঞ্জ: বিজ্ঞান ও প্রযুক্তি স্পেশাল',
    subject: 'সাধারণ বিজ্ঞান',
    category: 'Daily',
    durationMinutes: 5,
    rewardPoints: 50,
    questions: [
      {
        id: 'q1_1',
        question: 'সূর্যের আলো থেকে ভিটামিন কোন প্রক্রিয়ায় আমাদের ত্বকে সংশ্লেষিত হয়?',
        options: ['ভিটামিন A', 'ভিটামিন C', 'ভিটামিন D', 'ভিটামিন B12'],
        correctIndex: 2,
        explanation: 'সূর্যের আলট্রাভায়োলেট-বি (UVB) রশ্মির সংস্পর্শে ত্বকে থাকা কোলেস্টেরল থেকে ভিটামিন D উৎপন্ন হয়।'
      },
      {
        id: 'q1_2',
        question: 'কোন যন্ত্রের সাহায্যে বিদ্যুৎ প্রবাহ পরিমাপ করা হয়?',
        options: ['ভোল্টমিটার', 'অ্যামিটার', 'গ্যালভানোমিটার', 'ব্যারোমিটার'],
        correctIndex: 1,
        explanation: 'বর্তনীতে বিদ্যুৎ প্রবাহ (Current) সরাসরি পরিমাপ করার জন্য অ্যামিটার ব্যবহার করা হয়।'
      },
      {
        id: 'q1_3',
        question: 'কম্পিউটারের প্রসেসরে ডেটা অস্থায়ীভাবে ধরে রাখার জন্য কোনটি ব্যবহৃত হয়?',
        options: ['ROM', 'রেজিস্টার (Register)', 'হার্ডডিস্ক', 'SSD'],
        correctIndex: 1,
        explanation: 'CPU-এর অভ্যন্তরে থাকা দ্রুততম মেমোরি হলো রেজিস্টার (Register)।'
      },
      {
        id: 'q1_4',
        question: 'পানির অণুতে হাইড্রোজেন ও অক্সিজেনের ভরের অনুপাত কত?',
        options: ['২ : ১', '১ : ৮', '৮ : ১', '১ : ২'],
        correctIndex: 1,
        explanation: 'পানির রাসায়নিক সংকেত H2O। হাইড্রোজেনের ভর ২ এবং অক্সিজেনের ভর ১৬, তাই অনুপাত ২:১৬ = ১:৮।'
      }
    ]
  },
  {
    id: 'q2',
    title: 'এইচএসসি গণিত স্পেশাল মক টেস্ট',
    subject: 'উচ্চতর গণিত',
    category: 'Exam',
    durationMinutes: 10,
    rewardPoints: 100,
    questions: [
      {
        id: 'q2_1',
        question: 'lim (x→0) sin(5x)/x এর মান কত হবে?',
        options: ['0', '1', '5', 'অসীম'],
        correctIndex: 2,
        explanation: 'আমরা জানি lim (θ→0) sin(θ)/θ = 1। এখানে (5 * sin(5x))/(5x) = 5 * 1 = 5।'
      },
      {
        id: 'q2_2',
        question: 'যদি y = ln(sin x) হয়, তবে dy/dx এর মান কোনটি?',
        options: ['tan x', 'cot x', '-cot x', 'sec x'],
        correctIndex: 1,
        explanation: 'dy/dx = (1/sin x) * d/dx(sin x) = (1/sin x) * cos x = cot x।'
      },
      {
        id: 'q2_3',
        question: '∫ e^(2x) dx এর অনির্দিষ্ট যোগজীকরণ কোনটি?',
        options: ['e^(2x) + C', '(1/2)e^(2x) + C', '2e^(2x) + C', '(1/4)e^(2x) + C'],
        correctIndex: 1,
        explanation: '∫ e^(ax) dx = (1/a)e^(ax) + C। এখানে a = 2।'
      }
    ]
  },
  {
    id: 'q3',
    title: 'ইংরেজি গ্রামার টেস্ট: Preposition & Idioms',
    subject: 'ইংরেজি',
    category: 'Grammar',
    durationMinutes: 6,
    rewardPoints: 60,
    questions: [
      {
        id: 'q3_1',
        question: 'He is proficient ___ English.',
        options: ['at', 'in', 'on', 'with'],
        correctIndex: 1,
        explanation: 'কোনো বিষয় বা ভাষায় দক্ষ বোঝাতে "proficient in" ব্যবহৃত হয়।'
      },
      {
        id: 'q3_2',
        question: 'The idiom "A piece of cake" means:',
        options: ['A delicious bakery item', 'Something very easy to do', 'A difficult challenge', 'An expensive gift'],
        correctIndex: 1,
        explanation: '"A piece of cake" একটি জনপ্রিয় ইডিয়ম যার অর্থ অত্যন্ত সহজ বা অনায়াসসাধ্য কাজ।'
      }
    ]
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: '📢 আগামী শুক্রবার রাত ৮:০০ টায় ফ্রি মেগা স্কলারশিপ টেস্ট অনুষ্ঠিত হবে!',
    date: 'আজ',
    isUrgent: true
  },
  {
    id: 'n2',
    title: '✨ উচ্চতর গণিত ও আইসিটি কোর্সের নতুন ৩টি লেকচার নোট আপলোড করা হয়েছে।',
    date: 'গতকাল',
    isUrgent: false
  },
  {
    id: 'n3',
    title: '🏆 ডেইলি চ্যালেঞ্জে অংশগ্রহণ করে ডাবল রিওয়ার্ড কয়েন সংগ্রহ করুন।',
    date: '১ দিন আগে',
    isUrgent: false
  }
];

export const INITIAL_USER_STATS: UserStats = {
  name: 'শিক্ষার্থী সিয়াম',
  points: 340,
  streakDays: 5,
  quizzesCompleted: 8,
  lessonsWatched: 14,
  badges: ['স্টাডি স্টার্টার 🚀', 'কুইজ ফাইটার 🎯', '৫ দিনের ধারাবাহিকতা 🔥']
};
