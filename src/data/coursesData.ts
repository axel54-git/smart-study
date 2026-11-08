import { ClassCategory, SubjectItem, ChapterItem } from './hierarchyData';

export const INITIAL_COURSES_CLASSES: ClassCategory[] = [
  {
    id: 'course_class_9_10',
    title: '৯ম - ১০ম পূর্ণাঙ্গ একাডেমি কোর্স',
    subtitle: 'SSC Complete Master Course • সকল বিষয়',
    code: '9-10',
    bgColor: 'bg-emerald-100/90',
    iconColor: 'text-emerald-700'
  },
  {
    id: 'course_class_11_12',
    title: '১১শ - ১২শ একাডেমি ও এডমিশন কোর্স',
    subtitle: 'HSC & Admission Foundation • বিজ্ঞান বিভাগ',
    code: '11-12',
    bgColor: 'bg-blue-100/90',
    iconColor: 'text-blue-700'
  }
];

export const INITIAL_COURSES_SUBJECTS: SubjectItem[] = [
  // Class 9-10 Courses Subjects
  {
    id: 'c_sub_9_10_math',
    classId: 'course_class_9_10',
    name: 'গণিত স্পেশাল কোর্স',
    subtitle: 'বীজগণিত, জ্যামিতি ও ত্রিকোণমিতি কমপ্লিট সিলেবাস',
    code: 'MATH',
    bgColor: 'bg-emerald-100/80',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'c_sub_9_10_science',
    classId: 'course_class_9_10',
    name: 'সাধারণ বিজ্ঞান ও পদার্থ',
    subtitle: 'তত্ত্বীয় ও ব্যবহারিক সম্পূর্ণ গাইড',
    code: 'SCI',
    bgColor: 'bg-cyan-100/80',
    iconColor: 'text-cyan-600'
  },
  {
    id: 'c_sub_9_10_english',
    classId: 'course_class_9_10',
    name: 'ইংরেজি গ্রামার মাস্টারক্লাস',
    subtitle: 'Right form of verbs, Passage & Writing',
    code: 'ENG',
    bgColor: 'bg-indigo-100/80',
    iconColor: 'text-indigo-600'
  },

  // Class 11-12 Courses Subjects
  {
    id: 'c_sub_11_12_physics',
    classId: 'course_class_11_12',
    name: 'পদার্থবিজ্ঞান ১ম ও ২য় পত্র',
    subtitle: 'ভেক্টর, গতিবিদ্যা, তাপগতিবিদ্যা ও আধুনিক পদার্থ',
    code: 'PHY',
    bgColor: 'bg-amber-100/80',
    iconColor: 'text-amber-700'
  },
  {
    id: 'c_sub_11_12_higher_math',
    classId: 'course_class_11_12',
    name: 'উচ্চতর গণিত স্পেশাল ব্যাচ',
    subtitle: 'ক্যালকুলাস, ম্যাট্রিক্স, ত্রিকোণমিতি ও স্থিতিবিদ্যা',
    code: 'HMATH',
    bgColor: 'bg-purple-100/80',
    iconColor: 'text-purple-700'
  },
  {
    id: 'c_sub_11_12_ict',
    classId: 'course_class_11_12',
    name: 'আইসিটি (ICT) ক্র্যাশ কোর্স',
    subtitle: 'এইচএসসি আইসিটি সি প্রোগ্রামিং ও ওয়েব ডিজাইন',
    code: 'ICT',
    bgColor: 'bg-teal-100/80',
    iconColor: 'text-teal-700'
  }
];

export const INITIAL_COURSES_CHAPTERS: ChapterItem[] = [
  // Class 11-12 Physics Courses
  {
    id: 'c_ch_phy_1',
    subjectId: 'c_sub_11_12_physics',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'ভেক্টর ও গতিবিদ্যা কোর্স',
    subtitle: 'ডট গুণন, ক্রস গুণন ও প্রাসের গতি',
    bgColor: 'bg-amber-100/90',
    iconColor: 'text-amber-700',
    videos: [
      {
        id: 'c_vid_p1_1',
        title: 'লেকচার ১: ভেক্টর বিভাজন ও লব্ধির বিস্তারিত গাণিতিক বিশ্লেষণ',
        duration: '৩৫:৪০',
        youtubeUrl: 'https://youtu.be/zF_QuSpQdsI',
        instructor: 'প্রকৌশলী তানভীর আহমেদ',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'c_vid_p1_2',
        title: 'লেকচার ২: নদী-নৌকা সমস্যা ও ডট-ক্রস গুণনের ম্যাথ সলভ',
        duration: '৪২:১৫',
        youtubeUrl: 'https://youtu.be/zF_QuSpQdsI',
        instructor: 'প্রকৌশলী তানভীর আহমেদ',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'c_ch_phy_2',
    subjectId: 'c_sub_11_12_physics',
    chapterNumber: 'দ্বিতীয় অধ্যায়',
    title: 'কাজ, ক্ষমতা ও শক্তি কোর্স',
    subtitle: 'সংরক্ষণশীল বল ও স্প্রিং সংক্রান্ত হিসাব',
    bgColor: 'bg-rose-100/90',
    iconColor: 'text-rose-700',
    videos: [
      {
        id: 'c_vid_p2_1',
        title: 'লেকচার ১: পরিবর্তনশীল বল দ্বারা কৃতকাজ ও কুয়ার ম্যাথ',
        duration: '৩৮:২০',
        youtubeUrl: 'https://youtu.be/zF_QuSpQdsI',
        instructor: 'ড. ফারহানা হক',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },

  // Class 11-12 Higher Math Courses
  {
    id: 'c_ch_math_1',
    subjectId: 'c_sub_11_12_higher_math',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'ম্যাট্রিক্স ও নির্ণায়ক মাস্টার কোর্স',
    subtitle: 'ইনভার্স ম্যাট্রিক্স ও ক্র্যামারের নিয়ম',
    bgColor: 'bg-purple-100/90',
    iconColor: 'text-purple-700',
    videos: [
      {
        id: 'c_vid_m1_1',
        title: 'লেকচার ১: ম্যাট্রিক্সের গুণন ও ইনভার্স ম্যাট্রিক্স শর্টকাট',
        duration: '৪০:১০',
        youtubeUrl: 'https://youtu.be/zF_QuSpQdsI',
        instructor: 'হাসান মাহমুদ (বুয়েট)',
        thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },

  // Class 11-12 ICT Course
  {
    id: 'c_ch_ict_1',
    subjectId: 'c_sub_11_12_ict',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'সি প্রোগ্রামিং ভাষা ও অ্যালগরিদম',
    subtitle: 'লুপ, কন্ডিশন ও ফাংশন হাতে-কলমে প্র্যাকটিস',
    bgColor: 'bg-teal-100/90',
    iconColor: 'text-teal-700',
    videos: [
      {
        id: 'c_vid_i1_1',
        title: 'লেকচার ১: সি প্রোগ্রামিং শুরু থেকে স্ট্রাকচার ও ভেরিয়েবল',
        duration: '৪৫:০০',
        youtubeUrl: 'https://youtu.be/zF_QuSpQdsI',
        instructor: 'সৌরভ দাস (সফটওয়্যার ইঞ্জিনিয়ার)',
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },

  // Class 9-10 Math Course
  {
    id: 'c_ch_ssc_math_1',
    subjectId: 'c_sub_9_10_math',
    chapterNumber: 'প্রথম অধ্যায়',
    title: 'বাস্তব সংখ্যা ও সেট-ফাংশন',
    subtitle: 'এসএসসি বোর্ড পরীক্ষায় ১০০% কমনের প্রস্তুতি',
    bgColor: 'bg-emerald-100/90',
    iconColor: 'text-emerald-700',
    videos: [
      {
        id: 'c_vid_sm1_1',
        title: 'লেকচার ১: বাস্তব সংখ্যার শ্রেণিবিভাগ ও প্রমাণসমূহ',
        duration: '৩০:১৫',
        youtubeUrl: 'https://youtu.be/zF_QuSpQdsI',
        instructor: 'মাসুদ রানা',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80'
      }
    ]
  }
];
