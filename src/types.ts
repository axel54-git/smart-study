export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  pdfUrl?: string;
  summary: string;
  completed?: boolean;
}

export interface SubjectCourse {
  id: string;
  title: string;
  subject: string;
  grade: string; // e.g. "Class 9-10", "HSC", "Admission", "Job"
  thumbnail: string;
  instructor: string;
  totalLessons: number;
  totalDuration: string;
  color: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  rewardPoints: number;
  questions: QuizQuestion[];
  category: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  isUrgent?: boolean;
}

export interface UserStats {
  name: string;
  points: number;
  streakDays: number;
  quizzesCompleted: number;
  lessonsWatched: number;
  badges: string[];
}
