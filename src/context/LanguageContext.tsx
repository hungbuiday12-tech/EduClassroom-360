import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, viText?: string, enText?: string) => string;
  translate: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'educlassroom_app_language';

export const TRANSLATIONS: Record<string, { vi: string; en: string }> = {
  // Navigation & Top Bar
  'nav.classroom': { vi: 'Lớp học', en: 'Classroom' },
  'nav.math': { vi: 'Toán học (Đồ thị & 3D)', en: 'Math (Graphs & 3D)' },
  'nav.physics': { vi: 'Vật lí (Mô phỏng 2D/3D)', en: 'Physics (2D/3D Labs)' },
  'nav.cs': { vi: 'Tin học (Online Judge & Tự do)', en: 'CS (Online Judge & Studio)' },
  'nav.exams': { vi: 'Đề Thi (60 Đề Chuẩn)', en: 'Exams (60 Official Papers)' },
  'nav.overview': { vi: 'Tổng quan', en: 'Overview' },
  'nav.leaderboard': { vi: 'Bảng xếp hạng XP', en: 'XP Leaderboard' },
  'nav.home': { vi: 'Trang chủ', en: 'Home' },
  'nav.login': { vi: 'Đăng nhập', en: 'Sign In' },
  'nav.logout': { vi: 'Đăng xuất', en: 'Sign Out' },
  'nav.profile': { vi: 'Hồ sơ cá nhân', en: 'My Profile' },
  'nav.guest': { vi: 'Khách tham quan', en: 'Guest Student' },
  'nav.theme': { vi: 'Chế độ giao diện', en: 'Theme Mode' },
  'nav.lang': { vi: 'Ngôn ngữ', en: 'Language' },
  'nav.returnLanding': { vi: 'Quay lại Giới thiệu', en: 'Back to Landing' },

  // Brand & Subtitle
  'brand.subtitle': {
    vi: 'Nền tảng học tập chuyên sâu tích hợp đồ họa tương tác thời gian thực, mô phỏng 2D/3D và ngân hàng 60 đề thi chuẩn quốc gia.',
    en: 'Advanced academic platform featuring real-time 2D/3D interactive simulations, live Online Judge, and 60 official national exam papers.',
  },
  'brand.tagline': {
    vi: 'Vũ trụ học tập mô phỏng Toán - Lí - Tin THCS & THPT',
    en: 'Interactive STEM Learning Galaxy for Grades 9-12',
  },

  // Common actions & buttons
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
  'btn.autoGenerateTests': { vi: '⚡ Tự động sinh bộ Test thông minh', en: '⚡ AI Generate Test Suite' },
  'btn.close': { vi: 'Đóng', en: 'Close' },
  'btn.copy': { vi: 'Sao chép', en: 'Copy' },
  'btn.copied': { vi: 'Đã sao chép!', en: 'Copied!' },
  'btn.fullscreen': { vi: 'Toàn màn hình', en: 'Fullscreen' },
  'btn.exitFullscreen': { vi: 'Thu nhỏ', en: 'Exit Fullscreen' },
  'btn.filter': { vi: 'Bộ lọc', en: 'Filter' },
  'btn.search': { vi: 'Tìm kiếm...', en: 'Search...' },
  'btn.all': { vi: 'Tất cả', en: 'All' },
  'btn.select': { vi: 'Chọn', en: 'Select' },
  'btn.back': { vi: 'Quay lại', en: 'Back' },
  'btn.next': { vi: 'Tiếp theo', en: 'Next' },
  'btn.prev': { vi: 'Trước', en: 'Previous' },
  'btn.clear': { vi: 'Xóa sạch', en: 'Clear' },
  'btn.export': { vi: 'Xuất file', en: 'Export' },
  'btn.import': { vi: 'Nhập file', en: 'Import' },
  'btn.save': { vi: 'Lưu thay đổi', en: 'Save Changes' },

  // Grades (Lớp 9, 10, 11, 12)
  'grade.all': { vi: 'Tất cả các lớp (9-12)', en: 'All Grades (9-12)' },
  'grade.9': { vi: 'Lớp 9 (THCS)', en: 'Grade 9 (Junior High)' },
  'grade.10': { vi: 'Lớp 10 (THPT)', en: 'Grade 10 (High School)' },
  'grade.11': { vi: 'Lớp 11 (THPT)', en: 'Grade 11 (High School)' },
  'grade.12': { vi: 'Lớp 12 (Tốt nghiệp & Chuyên)', en: 'Grade 12 (Graduation & Olympic)' },

  // Exam tracks
  'track.all': { vi: 'Tất cả lĩnh vực (60 đề)', en: 'All Tracks (60 Exams)' },
  'track.chuyen': { vi: '🏆 1. Đề Chuyên & Olympic (30 đề)', en: '🏆 1. Specialized & Olympic (30 Exams)' },
  'track.khong_chuyen': { vi: '🎯 2. Đề Không Chuyên & Tốt Nghiệp (30 đề)', en: '🎯 2. Standard & Graduation (30 Exams)' },

  // Subjects
  'subject.all': { vi: 'Tất cả môn', en: 'All Subjects' },
  'subject.math': { vi: 'Toán Học', en: 'Mathematics' },
  'subject.physics': { vi: 'Vật Lí', en: 'Physics' },
  'subject.cs': { vi: 'Tin Học', en: 'Computer Science' },
  'subject.literature': { vi: 'Ngữ Văn', en: 'Literature' },

  // CS Judge statuses
  'status.ac': { vi: 'Accepted (Chính xác hoàn toàn)', en: 'Accepted (All Passed)' },
  'status.wa': { vi: 'Wrong Answer (Sai kết quả)', en: 'Wrong Answer' },
  'status.tle': { vi: 'Time Limit Exceeded (Quá thời gian)', en: 'Time Limit Exceeded' },
  'status.ce': { vi: 'Compile / Syntax Error (Lỗi biên dịch)', en: 'Compilation / Syntax Error' },
  'status.partial': { vi: 'Điểm một phần', en: 'Partial Score' },

  // Simulation tabs
  'sim.2d': { vi: 'Phòng Lab 2D Động', en: '2D Dynamic Lab' },
  'sim.3d': { vi: 'Không Gian Mô Phỏng 3D', en: '3D Simulation Space' },
  'sim.theory': { vi: 'Lý Thuyết & Công Thức', en: 'Theory & Formulas' },
  'sim.practice': { vi: 'Bài Tập Củng Cố', en: 'Practice Exercises' },
  'sim.flashcards': { vi: 'Thẻ Ghi Nhớ Flashcards', en: 'Flashcards' },
  'sim.telemetry': { vi: 'Thông số thời gian thực', en: 'Real-time Telemetry' },
  'sim.controls': { vi: 'Bảng Điều Khiển Tham Số', en: 'Parameter Control Panel' },

  // Math Tabs & Features
  'math.title': { vi: 'Toán Học Tương Tác 360°', en: 'Interactive Mathematics 360°' },
  'math.desc': {
    vi: 'Khảo sát đồ thị hàm số 2D, phòng thực hành vẽ hình học phẳng, mô phỏng không gian Oxyz 3D và kho bài giảng Lớp 9 - 12',
    en: '2D function graphing, dynamic Euclidean geometry studio, 3D Oxyz spatial simulation, and comprehensive curriculum for Grades 9-12',
  },
  'math.tab.grapher': { vi: 'Đồ thị hàm số 2D', en: '2D Function Grapher' },
  'math.tab.geometry': { vi: 'Vẽ hình học phẳng', en: 'Plane Geometry Studio' },
  'math.tab.3d': { vi: 'Không gian Oxyz 3D', en: '3D Spatial Geometry' },
  'math.tab.lectures': { vi: 'Bài giảng & Trắc nghiệm (Lớp 9-12)', en: 'Lectures & Quizzes (Grades 9-12)' },

  // Physics Tabs & Features
  'physics.title': { vi: 'Phòng Thí Nghiệm Vật Lí 2D & 3D', en: 'Physics Laboratory 2D & 3D' },
  'physics.desc': {
    vi: 'Mô phỏng chuyển động cơ học, điện từ học, quang hình và dao động sóng từ Lớp 9 đến Lớp 12',
    en: 'Simulating Newtonian mechanics, electromagnetism, optics, and wave oscillations for Grades 9 through 12',
  },

  // CS Tabs & Features
  'cs.title': { vi: 'Kho Luyện Tin Học & Trình Chấm Online Judge', en: 'Computer Science & Online Judge Studio' },
  'cs.desc': {
    vi: 'Lộ trình bài giảng chuẩn thuật toán, code mẫu C++/Python, hệ thống tự do giải đề phong cách Sublime Text và AI sinh Test tự động.',
    en: 'Algorithmic curriculum, C++/Python bilingual code, Sublime Text style free problem solver, and AI test generation.',
  },
  'cs.tab.curriculum': { vi: 'Bài giảng & Code mẫu', en: 'Curriculum & Sample Code' },
  'cs.tab.judge': { vi: 'Chấm đề thi chuẩn', en: 'Standard Online Judge' },
  'cs.tab.custom': { vi: '⚡ Tự do giải đề & AI sinh Test (Sublime Text)', en: '⚡ Free Problem Solver & Sublime Studio' },

  // Sublime Text Studio Keys
  'sublime.title': { vi: 'Sublime Text Studio - Môi Trường Lập Trình Chuyên Nghiệp', en: 'Sublime Text Studio - Professional Coding IDE' },
  'sublime.uploadPrompt': { vi: 'Gửi đề bằng Hình ảnh / File hoặc Văn bản', en: 'Upload Problem via Image / File or Text' },
  'sublime.tabPhoto': { vi: '📷 Tải ảnh đề bài', en: '📷 Photo / Screenshot' },
  'sublime.tabFile': { vi: '📄 Tải file đề bài', en: '📄 Problem File' },
  'sublime.tabText': { vi: '✍️ Nhập văn bản đề', en: '✍️ Raw Text' },
  'sublime.tabSample': { vi: '💡 Đề mẫu có sẵn', en: '💡 Sample Problems' },
  'sublime.analyzeBtn': { vi: '⚡ Phân tích & Tự động sinh bộ Test', en: '⚡ Analyze & Auto-Generate Tests' },
  'sublime.analyzing': { vi: 'Đang phân tích đề bài & sinh bộ test...', en: 'Analyzing problem & synthesizing test suite...' },
  'sublime.runSingle': { vi: '▶ Chạy test tùy chọn (Ctrl+Enter)', en: '▶ Run Custom Input (Ctrl+Enter)' },
  'sublime.judgeAll': { vi: '🏆 Nộp bài chấm toàn bộ test', en: '🏆 Submit & Grade All Tests' },
  'sublime.editorSettings': { vi: 'Cài đặt Sublime Text', en: 'Sublime Settings' },
  'sublime.themeMonokai': { vi: 'Chủ đề Monokai cổ điển', en: 'Classic Monokai Theme' },
  'sublime.shortcuts': { vi: 'Phím tắt: Tab thụt lề 4 space, Ctrl+Enter chạy test, Ctrl+S lưu bài', en: 'Shortcuts: Tab indents 4 spaces, Ctrl+Enter runs tests, Ctrl+S saves' },

  // Classroom Overview
  'overview.title': { vi: 'Trung Tâm Lớp Học EduClassroom 360', en: 'EduClassroom 360 Academic Center' },
  'overview.welcome': { vi: 'Chào mừng bạn đến với vũ trụ học tập tương tác', en: 'Welcome to your interactive learning galaxy' },
  'overview.quickStart': { vi: 'Khám phá nhanh các phân hệ học thuật', en: 'Explore Academic Modules' },
  'overview.mathCard': { vi: 'Phòng Toán Học 2D/3D', en: 'Mathematics 2D/3D' },
  'overview.physicsCard': { vi: 'Phòng Vật Lí Mô Phỏng', en: 'Physics Simulation Lab' },
  'overview.csCard': { vi: 'Đấu Trường Tin Học & Online Judge', en: 'Computer Science Arena' },
  'overview.examsCard': { vi: 'Ngân Hàng 60 Đề Thi Tuyển Sinh & THPT', en: '60 Official Exam Papers Hub' },

  // Exams Hub
  'exams.title': { vi: 'Ngân Hàng Đề Thi Quốc Gia & Chuyên', en: 'Official & Specialized Exam Hub' },
  'exams.totalPapers': { vi: '60 Đề Thi Chọn Lọc Kèm Lời Giải Chi Tiết', en: '60 Curated Exam Papers with Step-by-Step Solutions' },
  'exams.filterTrack': { vi: 'Phân loại đề', en: 'Exam Category' },
  'exams.filterSubject': { vi: 'Môn học', en: 'Subject' },
  'exams.filterGrade': { vi: 'Khối lớp', en: 'Grade Level' },
  'exams.doExam': { vi: 'Bắt đầu giải đề', en: 'Start Solving' },
  'exams.timeRemaining': { vi: 'Thời gian còn lại', en: 'Time Remaining' },
  'exams.score': { vi: 'Điểm số đạt được', en: 'Score Achieved' },
  'exams.viewSolution': { vi: 'Xem đáp án chi tiết & Biểu điểm', en: 'View Detailed Solution & Scoring Rubric' },
};

// Rich lookup table mapping frequent Vietnamese phrases directly to English
const VI_TO_EN_DICTIONARY: Record<string, string> = {
  // Grades & Levels
  'Lớp 9': 'Grade 9',
  'Lớp 10': 'Grade 10',
  'Lớp 11': 'Grade 11',
  'Lớp 12': 'Grade 12',
  'Lớp 9 - 12': 'Grades 9 - 12',
  'Lớp 9-10': 'Grades 9-10',
  'Lớp 11-12': 'Grades 11-12',
  'Tất cả': 'All',
  'Tất cả các lớp': 'All Grades',
  'Tất cả chuyên đề': 'All Topics',
  'Tất cả môn': 'All Subjects',
  'Cơ bản': 'Beginner',
  'Thông hiểu': 'Intermediate',
  'Trung cấp': 'Intermediate',
  'Vận dụng': 'Advanced',
  'Vận dụng cao': 'Mastery',
  'Nâng cao': 'Advanced',
  'Chuyên / HSG': 'Specialized / Olympic',
  'Nâng cao / HSG': 'Advanced / Olympic',

  // Subjects
  'Toán học': 'Mathematics',
  'Toán Học': 'Mathematics',
  'Vật lí': 'Physics',
  'Vật Lí': 'Physics',
  'Vật lý': 'Physics',
  'Tin học': 'Computer Science',
  'Tin Học': 'Computer Science',
  'Ngữ văn': 'Literature',
  'Ngữ Văn': 'Literature',

  // Math categories
  'Giải tích': 'Calculus',
  'Giải tích 12': 'Grade 12 Calculus',
  'Hình học': 'Geometry',
  'Hình học Oxyz & Không gian': 'Spatial Geometry & Oxyz',
  'Mũ & Logarit': 'Exponential & Logarithm',
  'Lượng giác & Mũ': 'Trigonometry & Exponential',
  'Số phức': 'Complex Numbers',
  'Đại số & Xác suất': 'Algebra & Probability',
  'Đại số': 'Algebra',
  'Hình học phẳng': 'Plane Geometry',

  // Actions
  'Bắt đầu': 'Start',
  'Bắt đầu làm': 'Start Test',
  'Tạm dừng': 'Pause',
  'Tiếp tục': 'Resume',
  'Làm lại': 'Reset',
  'Nộp bài': 'Submit',
  'Nộp bài & Chấm điểm': 'Submit & Grade',
  'Xem hướng dẫn giải': 'View Solution Guide',
  'Thu gọn lời giải': 'Hide Solution',
  'Chạy thử': 'Run',
  'Chạy thử test': 'Run Custom Test',
  'Sao chép': 'Copy',
  'Đã sao chép!': 'Copied!',
  'Đóng': 'Close',
  'Lưu': 'Save',
  'Khôi phục': 'Restore',
  'Xóa': 'Delete',
  'Tải lại': 'Reload',
  'Toàn màn hình': 'Fullscreen',
  'Thu nhỏ': 'Exit Fullscreen',

  // Terms & Labels
  'Lý thuyết': 'Theory',
  'Lý Thuyết': 'Theory',
  'Lý thuyết trọng tâm': 'Core Theory',
  'Công thức': 'Formulas',
  'Công thức then chốt': 'Key Formulas',
  'Bài tập củng cố': 'Practice Exercises',
  'Thẻ ghi nhớ': 'Flashcards',
  'Câu hỏi': 'Question',
  'Đáp án': 'Answer',
  'Lời giải': 'Solution',
  'Giải thích': 'Explanation',
  'Mẹo ghi nhớ': 'Mnemonic Tips',
  'Bẫy thường gặp': 'Common Traps',
  'Điểm': 'Points',
  'Thời gian': 'Time',
  'Độ khó': 'Difficulty',
  'Thời lượng đọc': 'Read Time',
  'phút': 'minutes',
  'giây': 'seconds',

  // Navigation
  'Tổng quan': 'Overview',
  'Đề thi': 'Exams',
  'Đề Thi': 'Exams',
  'Bảng xếp hạng': 'Leaderboard',
  'Đăng nhập': 'Sign In',
  'Đăng xuất': 'Sign Out',
  'Học sinh': 'Student',
  'Giáo viên': 'Teacher',
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
    const next = language === 'vi' ? 'en' : 'vi';
    setLanguage(next);
  };

  const translate = (text: string): string => {
    if (!text || language === 'vi') return text;
    if (VI_TO_EN_DICTIONARY[text]) return VI_TO_EN_DICTIONARY[text];

    // Compound pattern replacements
    let result = text;
    result = result.replace(/Lớp 9/g, 'Grade 9');
    result = result.replace(/Lớp 10/g, 'Grade 10');
    result = result.replace(/Lớp 11/g, 'Grade 11');
    result = result.replace(/Lớp 12/g, 'Grade 12');
    result = result.replace(/Giải tích/g, 'Calculus');
    result = result.replace(/Hình học/g, 'Geometry');
    result = result.replace(/Đại số/g, 'Algebra');
    result = result.replace(/Vật lí|Vật lý/g, 'Physics');
    result = result.replace(/Toán học|Toán Học/g, 'Mathematics');
    result = result.replace(/Tin học|Tin Học/g, 'Computer Science');
    result = result.replace(/Bài tập củng cố/g, 'Practice Exercises');
    result = result.replace(/Lý thuyết trọng tâm/g, 'Core Theory');
    result = result.replace(/Công thức then chốt/g, 'Key Formulas');
    result = result.replace(/Mẹo ghi nhớ/g, 'Memory Mnemonics');
    result = result.replace(/Bẫy thường gặp/g, 'Common Traps');
    result = result.replace(/Độ khó/g, 'Difficulty');
    result = result.replace(/Thời gian làm bài/g, 'Duration');
    result = result.replace(/Xem lời giải chi tiết/g, 'View Detailed Solution');
    result = result.replace(/Thu gọn lời giải/g, 'Hide Solution');

    return result;
  };

  const t = (key: string, viText?: string, enText?: string): string => {
    if (TRANSLATIONS[key]) {
      return language === 'en' ? TRANSLATIONS[key].en : TRANSLATIONS[key].vi;
    }
    if (language === 'en') {
      if (enText) return enText;
      if (viText) return translate(viText);
      return translate(key);
    }
    return viText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, translate }}>
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
