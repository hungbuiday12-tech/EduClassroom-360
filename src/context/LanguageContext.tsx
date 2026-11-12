import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, viText?: string, enText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'educlassroom_app_language';

const TRANSLATIONS: Record<string, { vi: string; en: string }> = {
  // Navigation
  'nav.classroom': { vi: 'Lớp học', en: 'Classroom' },
  'nav.math': { vi: 'Toán học (Đồ thị & 3D)', en: 'Math (Graphs & 3D)' },
  'nav.physics': { vi: 'Vật lí (Mô phỏng 2D/3D)', en: 'Physics (2D/3D Labs)' },
  'nav.cs': { vi: 'Tin học (Online Judge & Tự do)', en: 'CS (Online Judge & Custom)' },
  'nav.exams': { vi: 'Đề Thi (60 Đề)', en: 'Exams (60 Papers)' },
  'nav.overview': { vi: 'Tổng quan', en: 'Overview' },
  'nav.leaderboard': { vi: 'Bảng xếp hạng XP', en: 'XP Leaderboard' },

  // Brand
  'brand.subtitle': {
    vi: 'Nền tảng học tập chuyên sâu tích hợp đồ họa tương tác thời gian thực, mô phỏng 3D và ngân hàng 60 đề thi chuẩn quốc gia.',
    en: 'Advanced academic platform featuring real-time 2D/3D interactive simulations, live Online Judge, and 60 official exam papers.',
  },

  // Common actions
  'btn.start': { vi: 'Bắt đầu làm', en: 'Start' },
  'btn.pause': { vi: 'Tạm dừng', en: 'Pause' },
  'btn.resume': { vi: 'Tiếp tục', en: 'Resume' },
  'btn.reset': { vi: 'Làm lại', en: 'Reset' },
  'btn.submit': { vi: 'Nộp bài & Chấm điểm', en: 'Submit & Grade' },
  'btn.solution': { vi: 'Xem hướng dẫn giải', en: 'Solution Guide' },
  'btn.hideSolution': { vi: 'Thu gọn lời giải', en: 'Hide Solution' },
  'btn.runCode': { vi: 'Chạy thử test', en: 'Run Tests' },
  'btn.submitCode': { vi: 'Nộp bài chấm Online Judge', en: 'Submit Online Judge' },
  'btn.createProblem': { vi: '➕ Tạo đề bài tự do mới', en: '➕ Create Custom Problem' },
  'btn.autoGenerateTests': { vi: '⚡ Tự động sinh bộ Test thông minh', en: '⚡ Auto-Generate Test Suite' },
  'btn.close': { vi: 'Đóng', en: 'Close' },
  'btn.copy': { vi: 'Sao chép', en: 'Copy' },
  'btn.copied': { vi: 'Đã sao chép!', en: 'Copied!' },
  'btn.fullscreen': { vi: 'Toàn màn hình', en: 'Fullscreen' },
  'btn.exitFullscreen': { vi: 'Thu nhỏ', en: 'Exit Fullscreen' },

  // Grades
  'grade.all': { vi: 'Tất cả các lớp', en: 'All Grades' },
  'grade.9': { vi: 'Lớp 9', en: 'Grade 9' },
  'grade.10': { vi: 'Lớp 10', en: 'Grade 10' },
  'grade.11': { vi: 'Lớp 11', en: 'Grade 11' },
  'grade.12': { vi: 'Lớp 12', en: 'Grade 12' },

  // Exam tracks
  'track.all': { vi: 'Tất cả lĩnh vực (60 đề)', en: 'All Tracks (60 Exams)' },
  'track.chuyen': { vi: '🏆 1. Đề Chuyên & Olympic (30 đề)', en: '🏆 1. Specialized & Olympic (30 Exams)' },
  'track.khong_chuyen': { vi: '🎯 2. Đề Không Chuyên & Tốt Nghiệp (30 đề)', en: '🎯 2. Standard & Graduation (30 Exams)' },

  // Subjects
  'subject.all': { vi: 'Tất cả môn', en: 'All Subjects' },
  'subject.math': { vi: 'Toán Học', en: 'Mathematics' },
  'subject.physics': { vi: 'Vật Lý', en: 'Physics' },
  'subject.cs': { vi: 'Tin Học', en: 'Computer Science' },

  // CS Judge statuses
  'status.ac': { vi: 'Accepted (Chính xác hoàn toàn)', en: 'Accepted (All Passed)' },
  'status.wa': { vi: 'Wrong Answer (Sai kết quả)', en: 'Wrong Answer' },
  'status.tle': { vi: 'Time Limit Exceeded (Quá thời gian)', en: 'Time Limit Exceeded' },
  'status.ce': { vi: 'Compile / Syntax Error (Lỗi biên dịch)', en: 'Compilation / Syntax Error' },

  // Simulation tabs
  'sim.2d': { vi: 'Phòng Lab 2D Động', en: '2D Dynamic Lab' },
  'sim.3d': { vi: 'Không Gian Mô Phỏng 3D Three.js', en: 'Three.js 3D Simulation' },
  'sim.theory': { vi: 'Lý Thuyết & Công Thức', en: 'Theory & Formulas' },
  'sim.practice': { vi: 'Bài Tập Củng Cố', en: 'Practice Exercises' },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved === 'en' || saved === 'vi') return saved;
    } catch {}
    return 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, lang);
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  const t = (key: string, viText?: string, enText?: string): string => {
    if (TRANSLATIONS[key]) {
      return language === 'en' ? TRANSLATIONS[key].en : TRANSLATIONS[key].vi;
    }
    if (language === 'en') {
      return enText || viText || key;
    }
    return viText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
